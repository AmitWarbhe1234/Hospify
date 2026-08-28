from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import LoginSerializer, StaffCreateSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsDoctor, IsAdmin
from .models import User




class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class StaffCreateAPIView(APIView):

    permission_classes = [IsAdmin]

    def post(self, request):

        serializer = StaffCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        staff = serializer.save()

        return Response(
            {
                "message": "Staff created successfully.",
                "staff": {
                    "id": staff.id,
                    "email": staff.email,
                    "first_name": staff.first_name,
                    "last_name": staff.last_name,
                    "role": staff.role,
                    "department": staff.department,
                }
            },
            status=201
        )


class DoctorTestView(APIView):

    permission_classes = [IsDoctor]

    def get(self, request):
        return Response({
            "message": "Welcome Doctor!",
            "email": request.user.email,
            "role": request.user.role
        })




class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        response_data = {
            "email": user.email,
            "role": user.role,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }

        # Patient details
        if user.role == "PATIENT":

            patient = user.patient_profile

            response_data.update({
                "patient_id": patient.patient_id,
                "gender": patient.gender,
                "blood_group": patient.blood_group,
                "mobile": patient.mobile,
                "date_of_birth": patient.date_of_birth,
                "address": patient.address,
            })

        return Response(response_data)





class StaffListView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        staff = User.objects.filter(
            role__in=[
                "DOCTOR",
                "RECEPTIONIST",
                "LAB_TECHNICIAN"
            ]
        )

        data = []

        for user in staff:

            data.append({
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "department": user.department,
            })

        return Response(data)

class StaffDeleteAPIView(APIView):

    permission_classes = [IsAdmin]

    def delete(self, request, staff_id):

        try:
            staff = User.objects.get(
                id=staff_id,
                role__in=["DOCTOR", "RECEPTIONIST", "LAB_TECHNICIAN"]
            )
        except User.DoesNotExist:
            return Response(
                {"message": "Staff member not found."},
                status=404
            )

        staff.delete()

        return Response(
            {"message": "Staff deleted successfully."},
            status=200
        )


    
    def patch(self, request, staff_id):

        try:
            staff = User.objects.get(
                id=staff_id,
                role__in=["DOCTOR", "RECEPTIONIST", "LAB_TECHNICIAN"]
            )
        except User.DoesNotExist:
            return Response(
                {"message": "Staff member not found."},
                status=404
            )

        first_name = request.data.get("first_name", staff.first_name)
        last_name = request.data.get("last_name", staff.last_name)
        email = request.data.get("email", staff.email)
        role = request.data.get("role", staff.role)
        department = request.data.get("department", staff.department)

        # Email already kisi aur ke paas toh nahi hai, ye check
        if User.objects.filter(email=email).exclude(id=staff.id).exists():
            return Response(
                {"detail": "Is email se already koi account bana hua hai."},
                status=400
            )

        # Role sirf valid values mein se hi ho
        if role not in ["DOCTOR", "RECEPTIONIST", "LAB_TECHNICIAN"]:
            return Response(
                {"detail": "Invalid role."},
                status=400
            )

        # Doctor ke liye department required hai
        if role == "DOCTOR" and not department:
            return Response(
                {"detail": "Department is required for doctors."},
                status=400
            )

        # Doctor nahi hai to department clear kar do
        if role != "DOCTOR":
            department = None

        staff.first_name = first_name
        staff.last_name = last_name
        staff.email = email
        staff.role = role
        staff.department = department
        staff.save()

        return Response(
            {
                "id": staff.id,
                "email": staff.email,
                "first_name": staff.first_name,
                "last_name": staff.last_name,
                "role": staff.role,
                "department": staff.department,
            },
            status=200
        )




class PatientListView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        patients = User.objects.filter(role="PATIENT")

        data = []

        for user in patients:

            data.append({
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            })

        return Response(data)