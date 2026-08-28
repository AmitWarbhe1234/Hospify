from rest_framework import serializers
from .models import Bill, LabTest


class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = ['id', 'name', 'price']


class BillSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)

    class Meta:
        model = Bill
        fields = [
            'id', 'patient', 'patient_name', 'doctor',
            'registration_fee', 'consultation_fee', 'total_amount',
            'status', 'created_at'
        ]
        read_only_fields = ['total_amount', 'created_at']

    def create(self, validated_data):
        bill = Bill.objects.create(**validated_data)
        bill.total_amount = bill.registration_fee + bill.consultation_fee
        bill.save()
        return bill