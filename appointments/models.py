from django.db import models
from accounts.models import User
from patients.models import Patient


class Appointment(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
        ("REJECTED", "Rejected"),
    ]

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="doctor_appointments"
    )

    appointment_date = models.DateField()

    appointment_time = models.TimeField()

    reason = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.patient.patient_id} - {self.appointment_date}"