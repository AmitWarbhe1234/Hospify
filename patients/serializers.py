from rest_framework import serializers
from .models import Patient


class PatientRegistrationSerializer(serializers.Serializer):

    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()

    date_of_birth = serializers.DateField()
    gender = serializers.CharField(max_length=20)
    blood_group = serializers.CharField(
        max_length=5,
        required=False
    )
    mobile = serializers.CharField(max_length=15)

    emergency_contact = serializers.CharField(
    max_length=15,
    required=False,
    allow_blank=True
    )

    address = serializers.CharField(
        required=False,
        allow_blank=True
    )

    def validate_email(self, value):

        if self.context["request"].user.role != "RECEPTIONIST":
            raise serializers.ValidationError(
                "Only receptionist can register patients."
            )

        from accounts.models import User

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )

        return value




class PatientActivationSerializer(serializers.Serializer):

    email = serializers.EmailField()

    activation_token = serializers.CharField()

    password = serializers.CharField(write_only=True, min_length=8)



class PatientListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'patient_id', 'full_name', 'email', 'mobile']