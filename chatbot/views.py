from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class ChatbotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get("message", "").strip()

        if not message:
            return Response(
                {"error": "Message is required."},
                status=400
            )

        return Response({
            "reply": f"You said: {message}"
        })