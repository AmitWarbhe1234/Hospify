from django.db import models
from accounts.models import User
from patients.models import Patient


class LabTest(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Bill(models.Model):
    STATUS_CHOICES = (
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
    )
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='bills')
    doctor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='doctor_bills'
    )
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unpaid')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bill #{self.id} - {self.patient}"


class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('created', 'Created'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    )

    bill = models.OneToOneField(
        Bill,
        on_delete=models.CASCADE,
        related_name='payment'
    )

    razorpay_order_id = models.CharField(max_length=200, unique=True)
    razorpay_payment_id = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )
    razorpay_signature = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='created'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment - Bill #{self.bill.id}"