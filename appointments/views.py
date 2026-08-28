from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from .models import Appointment
from .serializers import (DoctorSerializer,AppointmentSerializer)


class DoctorListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        department = request.query_params.get(
            "department"
        )

        doctors = User.objects.filter(
            role="DOCTOR"
        )

        if department:

            doctors = doctors.filter(
                department=department
            )

        serializer = DoctorSerializer(
            doctors,
            many=True
        )

        return Response(serializer.data)

class BookAppointmentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        # Check whether logged-in user is a patient
        if request.user.role != "PATIENT":
            return Response(
                {
                    "detail": "Only patients can book appointments."
                },
                status=403
            )

        # Get patient profile of logged-in user
        patient = request.user.patient_profile

        serializer = AppointmentSerializer(
            data=request.data
        )

        if serializer.is_valid():

            appointment = serializer.save(
                patient=patient
            )

            return Response(
                {
                    "message": "Appointment booked successfully.",
                    "appointment": AppointmentSerializer(
                        appointment
                    ).data
                },
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )


class MyAppointmentsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Check whether logged-in user is a patient
        if request.user.role != "PATIENT":
            return Response(
                {
                    "detail": "Only patients can view appointments."
                },
                status=403
            )

        # Get logged-in patient's profile
        patient = request.user.patient_profile

        # Get all appointments of this patient
        appointments = Appointment.objects.filter(
            patient=patient
        ).order_by("-appointment_date", "-appointment_time")

        serializer = AppointmentSerializer(
            appointments,
            many=True
        )

        return Response(serializer.data)




class DoctorAppointmentsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Check whether logged-in user is a doctor
        if request.user.role != "DOCTOR":
            return Response(
                {
                    "detail": "Only doctors can view appointments."
                },
                status=403
            )

        # Get all appointments of logged-in doctor
        appointments = Appointment.objects.filter(
            doctor=request.user
        ).order_by(
            "-appointment_date",
            "-appointment_time"
        )

        serializer = AppointmentSerializer(
            appointments,
            many=True
        )

        return Response(serializer.data)


class UpdateAppointmentStatusAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, appointment_id):

        # Check whether logged-in user is a doctor
        if request.user.role != "DOCTOR":
            return Response(
                {
                    "detail": "Only doctors can update appointment status."
                },
                status=403
            )

        try:
            appointment = Appointment.objects.get(
                id=appointment_id,
                doctor=request.user
            )
        except Appointment.DoesNotExist:
            return Response(
                {
                    "detail": "Appointment not found."
                },
                status=404
            )

        new_status = request.data.get("status")

        valid_statuses = ["CONFIRMED", "REJECTED", "COMPLETED"]

        if new_status not in valid_statuses:
            return Response(
                {
                    "detail": "Invalid status. Must be one of: CONFIRMED, REJECTED, COMPLETED."
                },
                status=400
            )

        # Business rule: REJECTED ya COMPLETED appointment ko aage update nahi kar sakte
        if appointment.status in ["REJECTED", "COMPLETED"]:
            return Response(
                {
                    "detail": "This appointment has already been finalized and cannot be updated."
                },
                status=400
            )

        appointment.status = new_status
        appointment.save()

        serializer = AppointmentSerializer(appointment)

        return Response(
            {
                "message": f"Appointment {new_status.lower()} successfully.",
                "appointment": serializer.data
            },
            status=200
        )



class CancelAppointmentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, appointment_id):

        # Check whether logged-in user is a patient
        if request.user.role != "PATIENT":
            return Response(
                {
                    "detail": "Only patients can cancel appointments."
                },
                status=403
            )

        # Get logged-in patient's profile
        patient = request.user.patient_profile

        # Find appointment belonging to this patient
        try:

            appointment = Appointment.objects.get(
                id=appointment_id,
                patient=patient
            )

        except Appointment.DoesNotExist:

            return Response(
                {
                    "detail": "Appointment not found."
                },
                status=404
            )

        # Check whether appointment can be cancelled
        if appointment.status in [
            "COMPLETED",
            "REJECTED",
            "CANCELLED"
        ]:

            return Response(
                {
                    "detail": "This appointment cannot be cancelled."
                },
                status=400
            )

        # Cancel appointment
        appointment.status = "CANCELLED"
        appointment.save()

        serializer = AppointmentSerializer(
            appointment
        )

        return Response(
            {
                "message": "Appointment cancelled successfully.",
                "appointment": serializer.data
            },
            status=200
        )