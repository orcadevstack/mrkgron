from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="auth-register"),
    path("login/", views.LoginView.as_view(), name="auth-login"),
    path("logout/", views.LogoutView.as_view(), name="auth-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("me/", views.MeView.as_view(), name="auth-me"),
    path("me/profile/", views.ProfileView.as_view(), name="auth-profile"),
    path("me/change-password/", views.ChangePasswordView.as_view(), name="auth-change-password"),
    path("audit-logs/", views.AuditLogListView.as_view(), name="auth-audit-logs"),
]
