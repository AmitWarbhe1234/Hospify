from django.urls import path

from .views import (
    LabTestListAPIView,
    CreateLabTestAPIView,
    CompleteLabTestAPIView,
    PatientLabReportsAPIView,
    DoctorLabReportsAPIView
)


urlpatterns = [

    path(
        "tests/",
        LabTestListAPIView.as_view(),
        name="lab-test-list"
    ),

    path(
        "request/",
        CreateLabTestAPIView.as_view(),
        name="create-lab-test"
    ),

    path(
        "complete/<int:test_id>/",
        CompleteLabTestAPIView.as_view(),
        name="complete-lab-test"
    ),

    path(
        "my-reports/",
        PatientLabReportsAPIView.as_view(),
        name="patient-lab-reports"
    ),

    path(
        "doctor-reports/",
        DoctorLabReportsAPIView.as_view(),
        name="doctor-lab-reports"
    ),
]