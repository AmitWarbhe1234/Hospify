from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = "Create a superuser if one doesn't already exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not email or not password:
            self.stdout.write("DJANGO_SUPERUSER_EMAIL or DJANGO_SUPERUSER_PASSWORD not set, skipping.")
            return

        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"Superuser {email} created."))
        else:
            self.stdout.write("Superuser already exists, skipping.")