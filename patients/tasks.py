from celery import shared_task
from .utils import send_activation_email


@shared_task
def send_patient_activation_email(user_id, activation_token):

    from accounts.models import User

    user = User.objects.get(id=user_id)

    send_activation_email(
        user,
        activation_token
    )

    return "Patient activation email sent successfully."