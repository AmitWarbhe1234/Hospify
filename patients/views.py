from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import secrets
from accounts.models import User
from .models import Patient
from .serializers import PatientRegistrationSerializer
from .tasks import send_patient_activation_email
from rest_framework.generics import ListAPIView
from .serializers import PatientListSerializer






class PatientRegistrationView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != User.Role.RECEPTIONIST:
            return Response(
                {
                    "detail": "Only receptionists can register patients."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PatientRegistrationSerializer(
                data=request.data,
                context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        user = User.objects.create_user(
            email=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            role=User.Role.PATIENT,
            is_active=False
        )
        user.set_unusable_password()
        user.save()

        activation_token = secrets.token_urlsafe(32)

        patient = Patient.objects.create(
            user=user,
            patient_id=self.generate_patient_id(),
            activation_token=activation_token,
            date_of_birth=data["date_of_birth"],
            gender=data["gender"],
            blood_group=data.get("blood_group", ""),
            mobile=data["mobile"],
            emergency_contact=data.get("emergency_contact", ""),
            address=data.get("address", "")
        )

        try:
            send_patient_activation_email.delay(
                user.id,
                activation_token
            )
        except Exception as e:
            print(f"Failed to send activation email: {e}")
        
        return Response(
            {
                "message": "Patient registered successfully.",
                "patient_id": patient.patient_id,
                "email": user.email,
                "activation_token": patient.activation_token,
            },
            status=status.HTTP_201_CREATED
        )

    def generate_patient_id(self):

        last_patient = Patient.objects.order_by("-id").first()

        if not last_patient:
            number = 1
        else:
            number = last_patient.id + 1

        return f"PAT-{number:04d}"



class PatientActivationView(APIView):

    def post(self, request):

        email = request.data.get("email")
        activation_token = request.data.get("activation_token")
        password = request.data.get("password")

        if not password or len(password) < 8:
            return Response(
                {
                    "message": "Password must be at least 8 characters long."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(
                email=email,
                role=User.Role.PATIENT
            )
        except User.DoesNotExist:
            return Response(
                {
                    "message": "Patient not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        patient = Patient.objects.get(user=user)

        if patient.activation_token != activation_token:
            return Response(
                {
                    "message": "Invalid activation token."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.is_active = True
        user.save()

        patient.activation_token = None
        patient.save()

        return Response(
            {
                "message": "Patient account activated successfully. You can now log in."
            },
            status=status.HTTP_200_OK
        )


class PatientBillingListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Patient.objects.all()
    serializer_class = PatientListSerializer