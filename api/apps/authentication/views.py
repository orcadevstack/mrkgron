"""
Authentication views.
"""

from django.contrib.auth import get_user_model
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AuditLog
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    AuditLogSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class ChangePasswordView(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Password updated successfully."})


class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        return AuditLog.objects.select_related("user").all()
