"""
Custom middleware for LizConMart.
"""

import logging
import time
import uuid

logger = logging.getLogger(__name__)


class TenantMiddleware:
    """
    Resolves the tenant from the request using the X-Tenant-ID header
    or subdomain and attaches it to the request object.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tenant_id = request.headers.get("X-Tenant-ID")
        if tenant_id:
            try:
                from apps.tenants.models import Tenant
                request.tenant = Tenant.objects.get(id=tenant_id, is_active=True)
            except Exception:
                request.tenant = None
        else:
            request.tenant = None
        return self.get_response(request)


class AuditLogMiddleware:
    """
    Logs every mutating API request for the audit trail.
    """

    MUTATING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_id = str(uuid.uuid4())
        request.request_id = request_id
        start = time.monotonic()
        response = self.get_response(request)
        duration_ms = int((time.monotonic() - start) * 1000)

        if request.method in self.MUTATING_METHODS:
            user = getattr(request, "user", None)
            user_id = user.id if user and user.is_authenticated else "anonymous"
            logger.info(
                "AUDIT %s %s %s user=%s status=%s duration=%dms",
                request_id,
                request.method,
                request.path,
                user_id,
                response.status_code,
                duration_ms,
            )
        return response
