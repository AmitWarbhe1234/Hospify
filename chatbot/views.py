from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FAQ


class ChatbotView(APIView):
    """
    POST { "message": "user ka text" }
    Returns { "reply": "matched answer" }
    """

    def post(self, request):
        user_msg = request.data.get('message', '').strip().lower()

        if not user_msg:
            return Response(
                {'reply': 'Kripya apna sawaal likhein.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        best_match = None
        best_score = 0

        for faq in FAQ.objects.all():
            score = 0
            for kw in faq.keywords.split(','):
                kw = kw.strip().lower()
                if kw and kw in user_msg:
                    score += 1
            if score > best_score:
                best_score = score
                best_match = faq

        if best_match:
            return Response({'reply': best_match.answer})

        return Response({
            'reply': (
                "Sorry, I didn't understand that. "
                "Please contact us at recep@hospify.com for further assistance."
            )
        })