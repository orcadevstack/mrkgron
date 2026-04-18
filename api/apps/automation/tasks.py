"""
Automation Celery tasks — Workflow execution engine.
"""

import logging
from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def execute_workflow(self, execution_id: str):
    from apps.automation.models import WorkflowExecution

    try:
        execution = WorkflowExecution.objects.select_related(
            "workflow", "customer"
        ).prefetch_related("workflow__steps__action").get(id=execution_id)
    except WorkflowExecution.DoesNotExist:
        logger.error("Execution %s not found", execution_id)
        return

    execution.status = WorkflowExecution.STATUS_RUNNING
    execution.started_at = timezone.now()
    execution.save(update_fields=["status", "started_at"])

    try:
        steps = list(execution.workflow.steps.order_by("order"))
        for step in steps:
            _execute_workflow_step(step, execution)
    except Exception as exc:
        logger.exception("Workflow execution %s failed", execution_id)
        execution.status = WorkflowExecution.STATUS_FAILED
        execution.error_message = str(exc)
        execution.save(update_fields=["status", "error_message"])
        raise self.retry(exc=exc)

    execution.status = WorkflowExecution.STATUS_COMPLETED
    execution.completed_at = timezone.now()
    execution.save(update_fields=["status", "completed_at"])
    logger.info("Workflow execution %s completed", execution_id)


def _execute_workflow_step(step, execution):
    from apps.automation.models import Action

    action = step.action
    log_entry = {"step_id": str(step.id), "action_type": action.action_type, "status": "started"}
    execution.execution_log.append(log_entry)
    execution.save(update_fields=["execution_log"])

    if action.action_type == Action.TYPE_SEND_EMAIL:
        _action_send_email(action.config, execution)
    elif action.action_type == Action.TYPE_UPDATE_CUSTOMER:
        _action_update_customer(action.config, execution)
    elif action.action_type == Action.TYPE_ADD_TO_SEGMENT:
        _action_add_to_segment(action.config, execution)
    elif action.action_type == Action.TYPE_REMOVE_FROM_SEGMENT:
        _action_remove_from_segment(action.config, execution)
    elif action.action_type == Action.TYPE_WEBHOOK:
        _action_webhook(action.config, execution)

    log_entry["status"] = "completed"
    execution.save(update_fields=["execution_log"])


def _action_send_email(config, execution):
    from django.core.mail import send_mail
    customer = execution.customer
    if not customer:
        return
    send_mail(
        subject=config.get("subject", ""),
        message=config.get("body", ""),
        from_email=None,
        recipient_list=[customer.email],
        fail_silently=True,
    )


def _action_update_customer(config, execution):
    customer = execution.customer
    if not customer:
        return
    field = config.get("field")
    value = config.get("value")
    if field and hasattr(customer, field):
        setattr(customer, field, value)
        customer.save(update_fields=[field])


def _action_add_to_segment(config, execution):
    from apps.segments.models import Segment, SegmentMembership
    segment_id = config.get("segment_id")
    customer = execution.customer
    if not segment_id or not customer:
        return
    try:
        segment = Segment.objects.get(id=segment_id)
        SegmentMembership.objects.get_or_create(
            segment=segment, customer=customer, defaults={"added_via": "automation"}
        )
    except Segment.DoesNotExist:
        pass


def _action_remove_from_segment(config, execution):
    from apps.segments.models import SegmentMembership
    segment_id = config.get("segment_id")
    customer = execution.customer
    if not segment_id or not customer:
        return
    SegmentMembership.objects.filter(segment_id=segment_id, customer=customer).delete()


def _action_webhook(config, execution):
    import requests
    url = config.get("url")
    if url:
        payload = {
            "execution_id": str(execution.id),
            "customer_id": str(execution.customer_id) if execution.customer_id else None,
            "trigger_data": execution.trigger_data,
        }
        requests.post(url, json=payload, timeout=10)


@shared_task
def process_scheduled_triggers():
    """
    Periodic task: fire time-based workflow triggers.
    Runs every minute via Celery Beat.
    """
    from apps.automation.models import Trigger, Workflow, WorkflowExecution
    from apps.crm.models import Customer
    from django.utils import timezone

    now = timezone.now()
    triggers = Trigger.objects.filter(
        trigger_type=Trigger.TYPE_SCHEDULE,
        is_active=True,
    ).prefetch_related("workflows")

    for trigger in triggers:
        schedule = trigger.config.get("schedule")
        if not schedule:
            continue
        for workflow in trigger.workflows.filter(status=Workflow.STATUS_ACTIVE):
            customer_ids = workflow.conditions.get("customer_ids", [])
            for cid in customer_ids:
                WorkflowExecution.objects.create(
                    workflow=workflow,
                    customer_id=cid,
                    trigger_data={"scheduled_at": now.isoformat()},
                )
