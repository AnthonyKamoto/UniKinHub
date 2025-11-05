"""
Tâches Celery pour l'envoi automatisé des notifications
"""

import logging

from celery import shared_task

from .notification_service import NotificationService

logger = logging.getLogger(__name__)


@shared_task(name="news.send_daily_digest")
def send_daily_digest_task():
    """
    Tâche planifiée pour envoyer le digest quotidien
    À exécuter chaque jour à 8h00 du matin
    """
    try:
        count = NotificationService.send_daily_digest()
        logger.info(f"Daily digest task completed. Sent to {count} users")
        return f"Daily digest sent to {count} users"
    except Exception as e:
        logger.error(f"Daily digest task failed: {str(e)}")
        raise


@shared_task(name="news.send_weekly_digest")
def send_weekly_digest_task():
    """
    Tâche planifiée pour envoyer le digest hebdomadaire
    À exécuter chaque lundi à 9h00 du matin
    """
    try:
        count = NotificationService.send_weekly_digest()
        logger.info(f"Weekly digest task completed. Sent to {count} users")
        return f"Weekly digest sent to {count} users"
    except Exception as e:
        logger.error(f"Weekly digest task failed: {str(e)}")
        raise


@shared_task(name="news.send_immediate_notification")
def send_immediate_notification_task(news_id):
    """
    Tâche pour envoyer une notification immédiate pour une news
    Utilisée pour les news importantes/urgentes
    """
    try:
        from .models import News

        news = News.objects.get(id=news_id)
        count = NotificationService.send_immediate_notification(news)
        logger.info(
            f"Immediate notification task completed for news {news_id}. Sent to {count} users"
        )
        return f"Immediate notification sent to {count} users"
    except News.DoesNotExist:
        logger.error(f"News {news_id} not found")
        return f"News {news_id} not found"
    except Exception as e:
        logger.error(f"Immediate notification task failed for news {news_id}: {str(e)}")
        raise


@shared_task(name="news.notify_on_news_published")
def notify_on_news_published_task(news_id):
    """
    Tâche pour notifier les utilisateurs lors de la publication d'une news
    Appelée automatiquement lors de l'approbation d'une news par un modérateur
    """
    try:
        from .models import News

        news = News.objects.get(id=news_id)
        NotificationService.notify_on_news_published(news)
        logger.info(f"Notification task completed for news {news_id}")
        return f"Notifications sent for news {news_id}"
    except News.DoesNotExist:
        logger.error(f"News {news_id} not found")
        return f"News {news_id} not found"
    except Exception as e:
        logger.error(f"Notification task failed for news {news_id}: {str(e)}")
        raise
