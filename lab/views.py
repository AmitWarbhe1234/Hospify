from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from patients.models import Patient

from .models import LabTest
from .serializers import LabTestSerializer






class LabTestListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != User.Role.LAB_TECHNICIAN:
            return Response(
                {
                    "detail": "Only lab technicians can view lab tests."
                },
                status=403
            )

        lab_tests = LabTest.objects.filter(
            status="PENDING"
        ).order_by("-created_at")

        serializer = LabTestSerializer(
            lab_tests,
            many=True
        )

        return Response(serializer.data)


class CreateLabTestAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != User.Role.DOCTOR:
            return Response(
                {
                    "detail": "Only doctors can request lab tests."
                },
                status=403
            )

        patient_id = request.data.get("patient")
        test_name = request.data.get("test_name")

        if not patient_id:
            return Response(
                {
                    "detail": "Patient is required."
                },
                status=400
            )

        if not test_name:
            return Response(
                {
                    "detail": "Test name is required."
                },
                status=400
            )

        try:
            patient = Patient.objects.get(
                id=patient_id
            )
        except Patient.DoesNotExist:
            return Response(
                {
                    "detail": "Patient not found."
                },
                status=404
            )

        lab_test = LabTest.objects.create(
            patient=patient,
            doctor=request.user,
            test_name=test_name
        )

        serializer = LabTestSerializer(lab_test)

        return Response(
            {
                "message": "Lab test requested successfully.",
                "lab_test": serializer.data
            },
            status=201
        )




class CompleteLabTestAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, test_id):

        if request.user.role != User.Role.LAB_TECHNICIAN:
            return Response(
                {
                    "detail": "Only lab technicians can complete lab tests."
                },
                status=403
            )

        try:
            lab_test = LabTest.objects.get(
                id=test_id
            )
        except LabTest.DoesNotExist:
            return Response(
                {
                    "detail": "Lab test not found."
                },
                status=404
            )

        result = request.data.get("result")

        if not result:
            return Response(
                {
                    "detail": "Result is required."
                },
                status=400
            )

        lab_test.result = result
        lab_test.status = "COMPLETED"
        lab_test.save()

        serializer = LabTestSerializer(lab_test)

        return Response(
            {
                "message": "Lab test completed successfully.",
                "lab_test": serializer.data
            },
            status=200
        )




class PatientLabReportsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Only patients can view their lab reports
        if request.user.role != User.Role.PATIENT:
            return Response(
                {
                    "detail": "Only patients can view lab reports."
                },
                status=403
            )

        patient = request.user.patient_profile

        lab_tests = LabTest.objects.filter(
            patient=patient
        ).order_by("-created_at")

        serializer = LabTestSerializer(
            lab_tests,
            many=True
        )

        return Response(
            serializer.data,
            status=200
        )



class DoctorLabReportsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Only doctors can view this
        if request.user.role != User.Role.DOCTOR:
            return Response(
                {
                    "detail": "Only doctors can view lab reports."
                },
                status=403
            )

        # Sirf apne requested lab tests dikhao (security: doosre doctor ke patients ki reports nahi)
        lab_tests = LabTest.objects.filter(
            doctor=request.user
        ).order_by("-created_at")

        serializer = LabTestSerializer(
            lab_tests,
            many=True
        )

        return Response(
            serializer.data,
            status=200
        )