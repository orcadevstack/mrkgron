"""
Celery tasks for Journey execution engine.
"""

import logging
from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def execute_journey_step(self, enrollment_id: str):
    """
    Execute the current step for a journey enrollment and advance to next.
    """
    from apps.journeys.models import JourneyEnrollment, JourneyStep

    try:
        enrollment = JourneyEnrollment.objects.select_related(
            "current_step", "customer", "journey"
        ).get(id=enrollment_id)
    except JourneyEnrollment.DoesNotExist:
        logger.error("Enrollment %s not found", enrollment_id)
        return

    if enrollment.status != JourneyEnrollment.STATUS_ACTIVE:
        return

    step = enrollment.current_step
    if not step:
        enrollment.status = JourneyEnrollment.STATUS_COMPLETED
        enrollment.completed_at = timezone.now()
        enrollment.save(update_fields=["status", "completed_at"])
        return

    try:
        _execute_step(step, enrollment)
    except Exception as exc:
        logger.exception("Error executing step %s for enrollment %s", step.id, enrollment_id)
        enrollment.status = JourneyEnrollment.STATUS_FAILED
        enrollment.save(update_fields=["status"])
        raise self.retry(exc=exc)

    # Advance to next step
    next_step = step.next_step_on_success
    if next_step:
        enrollment.current_step = next_step
        enrollment.save(update_fields=["current_step"])
        if next_step.step_type == JourneyStep.TYPE_WAIT:
            delay_seconds = next_step.config.get("delay_seconds", 0)
            execute_journey_step.apply_async((enrollment_id,), countdown=delay_seconds)
        else:
            execute_journey_step.delay(enrollment_id)
    else:
        enrollment.status = JourneyEnrollment.STATUS_COMPLETED
        enrollment.completed_at = timezone.now()
        enrollment.save(update_fields=["status", "completed_at"])


def _execute_step(step, enrollment):
    from apps.journeys.models import JourneyStep

    if step.step_type == JourneyStep.TYPE_SEND_EMAIL:
        _send_email_step(step, enrollment)
    elif step.step_type == JourneyStep.TYPE_SEND_SMS:
        _send_sms_step(step, enrollment)
    elif step.step_type == JourneyStep.TYPE_UPDATE_FIELD:
        _update_field_step(step, enrollment)
    elif step.step_type == JourneyStep.TYPE_WEBHOOK:
        _webhook_step(step, enrollment)
    # WAIT and END are handled in main flow


def _send_email_step(step, enrollment):
    from django.core.mail import send_mail
    customer = enrollment.customer
    config = step.config
    send_mail(
        subject=config.get("subject", ""),
        message=config.get("body", ""),
        from_email=None,
        recipient_list=[customer.email],
        fail_silently=True,
    )


def _send_sms_step(step, enrollment):
    pass  # Integrate with Twilio in _send_sms from communications/tasks


def _update_field_step(step, enrollment):
    customer = enrollment.customer
    config = step.config
    field = config.get("field")
    value = config.get("value")
    if field and hasattr(customer, field):
        setattr(customer, field, value)
        customer.save(update_fields=[field])


def _webhook_step(step, enrollment):
    import requests
    config = step.config
    url = config.get("url")
    if url:
        payload = {"customer_id": str(enrollment.customer_id), "step_id": str(step.id)}
        requests.post(url, json=payload, timeout=10)
