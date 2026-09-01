from django.db import models


class FAQ(models.Model):
    question = models.CharField(max_length=255)
    keywords = models.CharField(
        max_length=255,
        help_text="Comma separated keywords, e.g: appointment,book,schedule"
    )
    answer = models.TextField()

    class Meta:
        ordering = ['question']

    def __str__(self):
        return self.question