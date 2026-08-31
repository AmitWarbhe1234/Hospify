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

    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment

        fields = [
            "id",
            "patient",
            "doctor",
            "doctor_name",
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

    def get_doctor_name(self, obj):
        return f"{obj.doctor.first_name} {obj.doctor.last_name}".strip()

    def validate_doctor(self, value):

        if value.role != "DOCTOR":
            raise serializers.ValidationError(
                "Selected user is not a doctor."
            )

        return value