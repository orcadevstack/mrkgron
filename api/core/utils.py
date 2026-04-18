"""
Shared utility functions and exception handler.
"""

import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Wrap DRF default exception handler with a consistent envelope."""
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            "success": False,
            "errors": response.data,
            "status_code": response.status_code,
        }
    else:
        logger.exception("Unhandled exception", exc_info=exc)
        response = Response(
            {"success": False, "errors": "An unexpected error occurred.", "status_code": 500},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response


def success_response(data=None, message="OK", status_code=200):
    return Response(
        {"success": True, "message": message, "data": data},
        status=status_code,
    )
