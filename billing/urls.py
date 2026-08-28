from django.urls import path
from . import views

urlpatterns = [
    path('bills/create/', views.create_bill),
    path('bills/my-bills/', views.my_bills),
    path('bills/<int:bill_id>/', views.bill_detail),
    path('bills/<int:bill_id>/pdf/', views.bill_pdf),


    # Payment
    path(
        'bills/<int:bill_id>/create-payment/',
        views.create_payment_order
    ),
    path(
        'bills/payment/verify/',
        views.verify_payment
    ),
    
   ]