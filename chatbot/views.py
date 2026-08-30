import os

from dotenv import load_dotenv
from openai import OpenAI

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


load_dotenv()


class ChatbotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get("message", "").strip()

        if not message:
            return Response(
                {"error": "Message is required."},
                status=400
            )

        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            return Response(
                {"error": "OpenAI API key is not configured."},
                status=500
            )

        try:
            client = OpenAI(api_key=api_key)

            response = client.responses.create(
                model="gpt-4o-mini",
                instructions="""
You are Hospify Assistant, an AI healthcare assistant
for the Hospify Healthcare Management System.

Your responsibilities:
- Help patients understand how to use Hospify.
- Explain appointments, doctors, lab reports, patient profiles,
  registration, and other healthcare-management features.
- Give general health information in simple language.
- Never claim to diagnose a patient.
- Never replace a qualified doctor.
- If the user describes serious or emergency symptoms,
  advise them to seek immediate professional medical help.
- Keep responses clear, helpful, and reasonably concise.
- Do not invent patient records, appointments, medical reports,
  or other information that you cannot access.
""",
                input=message
            )

            return Response({
                "reply": response.output_text
            })

        except Exception as e:
            print("OpenAI Error:", str(e))

            return Response(
                {
                    "error": "Unable to get a response from the AI assistant."
                },
                status=500
            )