from django.db import models
from accounts.models import User


class Patient(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="patient_profile"
    )

    patient_id = models.CharField(
        max_length=20,
        unique=True
    )

    activation_token = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    date_of_birth = models.DateField(
        null=True,
        blank=True
    )

    gender = models.CharField(
        max_length=20
    )

    blood_group = models.CharField(
        max_length=5,
        blank=True
    )

    mobile = models.CharField(
        max_length=15
    )


    emergency_contact = models.CharField(
    max_length=15,
    blank=True
    )


    address = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.patient_id