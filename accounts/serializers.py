from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User


class LoginSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["email"] = user.email
        token["role"] = user.role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data["user"] = {
            "email": self.user.email,
            "role": self.user.role,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        }

        return data



class StaffCreateSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.ChoiceField(
        choices=[
            ("DOCTOR", "Doctor"),
            ("RECEPTIONIST", "Receptionist"),
            ("LAB_TECHNICIAN", "Lab Technician"),
        ]
    )
    department = serializers.ChoiceField(
        choices=User.Department.choices,
        required=False,
        allow_blank=True,
        allow_null=True
    )

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )

        return value

    def validate(self, data):

        if data.get("role") == "DOCTOR" and not data.get("department"):
            raise serializers.ValidationError(
                {"department": "Department is required for doctors."}
            )

        return data

    def create(self, validated_data):

        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            role=validated_data["role"],
            department=validated_data.get("department") or None,
            is_active=True
        )