from django.urls import path
from . import views
from .views import PatientRegistrationView, PatientActivationView


urlpatterns = [
    path("register/",PatientRegistrationView.as_view(),name="patient-register"),
    path("activate/",PatientActivationView.as_view(),name="patient-activate"),
    path('billing-list/', views.PatientBillingListView.as_view(), name='patient-billing-list'),
]