from rest_framework import serializers
from accounts.models import User
from .models import Appointment


class DoctorSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "department",
        ]


class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment

        fields = [
            "id",
            "patient",
            "doctor",
            "appointment_date",
            "appointment_time",
            "reason",
            "status",
        ]

        read_only_fields = [
            "id",
            "patient",
            "status",
        ]

    def validate_doctor(self, value):

        if value.role != "DOCTOR":
            raise serializers.ValidationError(
                "Selected user is not a doctor."
            )

        return value