from django.db import models
from accounts.models import User
from patients.models import Patient


class LabTest(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("COMPLETED", "Completed"),
    ]

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="lab_tests"
    )

    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="lab_tests"
    )

    test_name = models.CharField(
        max_length=100
    )

    test_date = models.DateField(
        auto_now_add=True
    )

    result = models.TextField(
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
        return f"{self.patient.patient_id} - {self.test_name}"