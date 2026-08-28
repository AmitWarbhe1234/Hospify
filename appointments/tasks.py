from celery import shared_task


@shared_task
def test_celery_task():
    print("Celery task is working successfully!")
    return "Success"