from django.urls import path
from . import views
from .views import (
    PatientRegistrationView,
    PatientActivationView,
    PatientSearchView,
    PatientDetailView,
)


urlpatterns = [
    path("register/", PatientRegistrationView.as_view(), name="patient-register"),
    path("activate/", PatientActivationView.as_view(), name="patient-activate"),
    path('billing-list/', views.PatientBillingListView.as_view(), name='patient-billing-list'),

    # Find Patient feature.
    # NOTE: search/ must come before <str:patient_id>/ so it isn't
    # swallowed by the dynamic patient_id route.
    path("search/", PatientSearchView.as_view(), name="patient-search"),
    path("<str:patient_id>/", PatientDetailView.as_view(), name="patient-detail"),
]
