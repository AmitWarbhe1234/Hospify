from django.core.mail import send_mail
from django.conf import settings


def send_activation_email(user, activation_token):

    activation_link = f"{settings.FRONTEND_URL}/activate?email={user.email}&token={activation_token}"

    # DEBUG: clean link terminal mein print karne ke liye (testing ke liye)
    print("=" * 60)
    print("ACTIVATION LINK (copy this):")
    print(activation_link)
    print("=" * 60)

    subject = "Activate your Hospify account"

    message = f"""
Hi {user.first_name},

Your account has been registered. Please click the link below to activate it:

{activation_link}

Regards,
Hospify Team
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )