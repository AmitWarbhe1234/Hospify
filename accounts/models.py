from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", User.Role.ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(
            email,
            password,
            **extra_fields
        )


class User(AbstractUser):

    username = None

    email = models.EmailField(unique=True)

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        RECEPTIONIST = "RECEPTIONIST", "Receptionist"
        DOCTOR = "DOCTOR", "Doctor"
        PATIENT = "PATIENT", "Patient"
        LAB_TECHNICIAN = "LAB_TECHNICIAN", "Lab Technician"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.PATIENT
    )

    class Department(models.TextChoices):
        ORTHOPEDICS = "ORTHOPEDICS", "Orthopedics"
        NEUROLOGY = "NEUROLOGY", "Neurology"
        CARDIOLOGY = "CARDIOLOGY", "Cardiology"
        OPHTHALMOLOGY = "OPHTHALMOLOGY", "Ophthalmology"
        GENERAL_MEDICINE = "GENERAL_MEDICINE", "General Medicine"
        PEDIATRICS = "PEDIATRICS", "Pediatrics"
        PULMONOLOGY = "PULMONOLOGY", "Pulmonology"

    department = models.CharField(
        max_length=30,
        choices=Department.choices,
        blank=True,
        null=True
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = UserManager()