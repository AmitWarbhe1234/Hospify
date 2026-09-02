from django.urls import path
from .views import (
    DoctorListAPIView,BookAppointmentAPIView,
    MyAppointmentsAPIView, DoctorAppointmentsAPIView,
    UpdateAppointmentStatusAPIView,AnalyticsAPIView,)


urlpatterns = [

    path(
        "doctors/",
        DoctorListAPIView.as_view(),
        name="doctor-list"
    ),

    path(
        "book/",
        BookAppointmentAPIView.as_view(),
        name="book-appointment"
    ),

    path(
        "my-appointments/",
        MyAppointmentsAPIView.as_view(),
        name="my-appointments"
    ),


    path(
        "doctor-appointments/",
        DoctorAppointmentsAPIView.as_view(),
        name="doctor-appointments"
),

    path(
        "update-status/<int:appointment_id>/",
        UpdateAppointmentStatusAPIView.as_view(),
        name="update-appointment-status"
),

    path(
        "cancel/<int:appointment_id>/",
        CancelAppointmentAPIView.as_view(),
        name="cancel-appointment"
),

    path(
        "analytics/",
        AnalyticsAPIView.as_view(),
        name="analytics"
),
]