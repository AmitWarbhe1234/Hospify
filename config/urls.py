from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenRefreshView,TokenVerifyView,)


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/auth/",
        include("accounts.urls")
    ),

    path(
        "api/patients/",
        include("patients.urls")
    ),

    path(
        "api/appointments/",
        include("appointments.urls")   
    ),

    path(
        "api/lab/",
        include("lab.urls")
    ),
    path('api/', include('billing.urls')),

    path(
    "api/chatbot/",
    include("chatbot.urls")
    ),

    # JWT token refresh + verify endpoints.
    # Frontend calls /api/token/refresh/ with the refresh token
    # to silently get a new access token instead of forcing re-login.
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    
]
