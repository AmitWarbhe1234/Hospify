from rest_framework import serializers
from .models import LabTest


class LabTestSerializer(serializers.ModelSerializer):

    patient_id = serializers.CharField(
        source="patient.patient_id",
        read_only=True
    )

    patient_name = serializers.SerializerMethodField()

    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = LabTest

        fields = [
            "id",
            "patient_id",
            "patient_name",
            "doctor",
            "doctor_name",
            "test_name",
            "test_date",
            "result",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "patient_id",
            "patient_name",
            "doctor",
            "doctor_name",
            "test_date",
            "result",
            "status",
            "created_at",
        ]

    def get_patient_name(self, obj):
        return f"{obj.patient.user.first_name} {obj.patient.user.last_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.first_name} {obj.doctor.last_name}"