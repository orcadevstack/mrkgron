"""
Celery tasks for Communications module.
"""

import logging
from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def launch_campaign(self, campaign_id: str):
    """
    Launch a campaign by dispatching individual send tasks for each
    recipient in the campaign's segment.
    """
    from apps.communications.models import Campaign

    try:
        campaign = Campaign.objects.select_related("segment", "channel", "template").get(id=campaign_id)
    except Campaign.DoesNotExist:
        logger.error("Campaign %s not found", campaign_id)
        return

    campaign.status = Campaign.STATUS_RUNNING
    campaign.started_at = timezone.now()
    campaign.save(update_fields=["status", "started_at"])

    customers = []
    if campaign.segment:
        customers = list(campaign.segment.members.values_list("id", flat=True))

    for customer_id in customers:
        send_campaign_message.delay(str(campaign.id), str(customer_id))

    logger.info("Campaign %s launched for %d recipients", campaign_id, len(customers))


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_campaign_message(self, campaign_id: str, customer_id: str):
    """
    Send a single campaign message to a customer.
    """
    from apps.communications.models import Campaign, DeliveryLog
    from apps.crm.models import Customer

    try:
        campaign = Campaign.objects.select_related("channel", "template").get(id=campaign_id)
        customer = Customer.objects.get(id=customer_id)
    except Exception as exc:
        logger.exception("Error loading objects for send_campaign_message")
        raise self.retry(exc=exc)

    log = DeliveryLog.objects.create(
        campaign=campaign,
        customer=customer,
        channel_type=campaign.channel.channel_type if campaign.channel else "email",
        recipient=customer.email,
        status=DeliveryLog.STATUS_PENDING,
    )

    try:
        _dispatch_message(campaign, customer, log)
    except Exception as exc:
        log.status = DeliveryLog.STATUS_FAILED
        log.error_message = str(exc)
        log.save(update_fields=["status", "error_message"])
        raise self.retry(exc=exc)


def _dispatch_message(campaign, customer, log):
    """Internal dispatcher — routes to appropriate channel handler."""
    from apps.communications.models import Channel

    channel_type = log.channel_type
    if channel_type == Channel.EMAIL:
        _send_email(campaign, customer, log)
    elif channel_type == Channel.SMS:
        _send_sms(campaign, customer, log)
    else:
        log.status = log.STATUS_SENT
        log.sent_at = timezone.now()
        log.save(update_fields=["status", "sent_at"])


def _send_email(campaign, customer, log):
    from django.core.mail import send_mail
    from django.utils import timezone

    template = campaign.template
    if not template:
        return

    send_mail(
        subject=template.subject,
        message=template.body,
        from_email=None,
        recipient_list=[customer.email],
        html_message=template.html_body or None,
        fail_silently=False,
    )
    log.status = log.STATUS_SENT
    log.sent_at = timezone.now()
    log.save(update_fields=["status", "sent_at"])


def _send_sms(campaign, customer, log):
    from django.conf import settings
    from django.utils import timezone
    from twilio.rest import Client

    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    template = campaign.template
    if not template or not customer.phone:
        return

    client.messages.create(
        body=template.body,
        from_=settings.TWILIO_PHONE_NUMBER,
        to=customer.phone,
    )
    log.status = log.STATUS_SENT
    log.sent_at = timezone.now()
    log.save(update_fields=["status", "sent_at"])
