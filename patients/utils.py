import requests
from django.conf import settings


def send_activation_email(user, activation_token):

    activation_link = f"{settings.FRONTEND_URL}/activate?email={user.email}&token={activation_token}"

    # DEBUG: clean link terminal mein print karne ke liye (testing ke liye)
    print("=" * 60)
    print("ACTIVATION LINK (copy this):")
    print(activation_link)
    print("=" * 60)

    subject = "Activate your Hospify account"

    html_content = f"""
    <p>Hi {user.first_name},</p>
    <p>Your account has been registered. Please click the link below to activate it:</p>
    <p><a href="{activation_link}">{activation_link}</a></p>
    <p>Regards,<br>Hospify Team</p>
    """

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    payload = {
        "sender": {"email": settings.DEFAULT_FROM_EMAIL, "name": "Hospify Team"},
        "to": [{"email": user.email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    response = requests.post(url, json=payload, headers=headers, timeout=15)

    if response.status_code not in (200, 201):
        raise Exception(f"Brevo API error: {response.status_code} - {response.text}")