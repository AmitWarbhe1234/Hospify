from django.contrib import admin
from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):

    list_display = (
        "patient_id",
        "user",
        "gender",
        "blood_group",
        "mobile",
        "created_at",
    )

    search_fields = (
        "patient_id",
        "user__email",
        "mobile",
    )
