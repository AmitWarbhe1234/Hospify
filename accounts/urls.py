from django.urls import path

from .views import (LoginView,ProfileView,DoctorTestView,StaffCreateAPIView,StaffListView,PatientListView,StaffDeleteAPIView)


urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("doctor-test/", DoctorTestView.as_view(), name="doctor-test"),
    path("staff/create/",StaffCreateAPIView.as_view(),name="staff-create"),
    path("staff/", StaffListView.as_view(), name="staff-list"),
    path("staff/<int:staff_id>/", StaffDeleteAPIView.as_view(), name="staff-delete"),
    path("patients/", PatientListView.as_view(), name="patient-list"),
]