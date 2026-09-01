from django.contrib import admin
from django.urls import path, include



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
    
]