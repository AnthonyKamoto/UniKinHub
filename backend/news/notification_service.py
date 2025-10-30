import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from django.core.mail import send_mail
from .models import User, News, Notification
import requests
import json

logger = logging.getLogger(__name__)


class NotificationService:
    """Service pour gérer l'envoi de notifications"""
    
    @staticmethod
    def send_email_notification(user, news, template_name='email/news_notification.html'):
        """Envoie une notification par email"""
        try:
            subject = f"Nouvelle actualité: {news.title}"
            
            # Contenu HTML
            html_content = render_to_string(template_name, {
                'user': user,
                'news': news,
                'site_url': settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://127.0.0.1:8000'
            })
            
            # Contenu texte simple
            text_content = f"""
            Bonjour {user.get_full_name() or user.username},
            
            Une nouvelle actualité a été publiée :
            
            Titre: {news.title}
            Catégorie: {news.category.name}
            Importance: {news.get_importance_display()}
            
            {news.content[:200]}...
            
            Pour lire l'article complet, visitez notre site web.
            
            Cordialement,
            L'équipe Actualités Étudiantes Kinshasa
            """
            
            # Envoyer l'email
            success = send_mail(
                subject=subject,
                message=text_content,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                html_message=html_content,
                fail_silently=False
            )
            
            # Enregistrer la notification
            notification = Notification.objects.create(
                user=user,
                news=news,
                notification_type='email',
                title=subject,
                message=text_content,
                status='sent' if success else 'failed',
                sent_at=timezone.now() if success else None
            )
            
            logger.info(f"Email notification {'sent' if success else 'failed'} to {user.email}")
            return success
            
        except Exception as e:
            logger.error(f"Failed to send email notification to {user.email}: {str(e)}")
            
            # Enregistrer l'échec
            Notification.objects.create(
                user=user,
                news=news,
                notification_type='email',
                title=f"Nouvelle actualité: {news.title}",
                message=str(e),
                status='failed'
            )
            return False
    
    @staticmethod
    def send_push_notification(user, news):
        """Envoie une notification push via FCM"""
        if not user.fcm_token:
            logger.warning(f"User {user.username} has no FCM token")
            return False
        
        try:
            # Configuration FCM (nécessite une clé de serveur)
            fcm_url = "https://fcm.googleapis.com/fcm/send"
            fcm_headers = {
                "Authorization": f"key={settings.FCM_SERVER_KEY}",
                "Content-Type": "application/json"
            }
            
            # Payload de la notification
            payload = {
                "to": user.fcm_token,
                "notification": {
                    "title": "Nouvelle actualité",
                    "body": f"{news.title}",
                    "icon": "/static/images/icon-192x192.png",
                    "click_action": f"/news/{news.pk}/"
                },
                "data": {
                    "news_id": str(news.pk),
                    "category": news.category.name,
                    "importance": news.importance
                }
            }
            
            response = requests.post(fcm_url, headers=fcm_headers, data=json.dumps(payload))
            success = response.status_code == 200
            
            # Enregistrer la notification
            notification = Notification.objects.create(
                user=user,
                news=news,
                notification_type='push',
                title="Nouvelle actualité",
                message=news.title,
                status='sent' if success else 'failed',
                sent_at=timezone.now() if success else None
            )
            
            logger.info(f"Push notification {'sent' if success else 'failed'} to {user.username}")
            return success
            
        except Exception as e:
            logger.error(f"Failed to send push notification to {user.username}: {str(e)}")
            
            # Enregistrer l'échec
            Notification.objects.create(
                user=user,
                news=news,
                notification_type='push',
                title="Nouvelle actualité",
                message=str(e),
                status='failed'
            )
            return False
    
    @staticmethod
    def notify_users_of_new_news(news):
        """Notifie tous les utilisateurs éligibles d'une nouvelle actualité"""
        # Obtenir tous les utilisateurs qui doivent être notifiés
        users_to_notify = User.objects.filter(
            is_active=True,
            email_notifications=True
        )
        
        # Filtrer par fréquence de notification
        immediate_users = users_to_notify.filter(notification_frequency='immediate')
        
        notifications_sent = 0
        
        for user in immediate_users:
            # Pour le moment, envoyer à tous les utilisateurs qui ont activé les notifications
            # TODO: Implémenter les préférences détaillées plus tard
            
            # Envoyer les notifications
            if user.email_notifications and user.email:
                NotificationService.send_email_notification(user, news)
                notifications_sent += 1
            
            if user.push_notifications and user.fcm_token:
                NotificationService.send_push_notification(user, news)
        
        logger.info(f"Sent {notifications_sent} notifications for news: {news.title}")
        return notifications_sent
    
    @staticmethod
    def send_daily_digest():
        """Envoie un résumé quotidien aux utilisateurs qui l'ont demandé"""
        from datetime import timedelta
        
        yesterday = timezone.now() - timedelta(days=1)
        recent_news = News.objects.filter(
            status='published',
            publish_date__gte=yesterday
        ).order_by('-publish_date')
        
        if not recent_news.exists():
            logger.info("No news to send in daily digest")
            return
        
        daily_users = User.objects.filter(
            is_active=True,
            email_notifications=True,
            notification_frequency='daily'
        )
        
        notifications_sent = 0
        
        for user in daily_users:
            try:
                subject = f"Résumé quotidien - {recent_news.count()} nouvelles actualités"
                
                html_content = render_to_string('email/daily_digest.html', {
                    'user': user,
                    'news_list': recent_news,
                    'site_url': settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://127.0.0.1:8000'
                })
                
                success = send_mail(
                    subject=subject,
                    message=f"Bonjour {user.get_full_name() or user.username}, voici le résumé des actualités d'hier.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    html_message=html_content,
                    fail_silently=False
                )
                
                if success:
                    notifications_sent += 1
                    
            except Exception as e:
                logger.error(f"Failed to send daily digest to {user.email}: {str(e)}")
        
        logger.info(f"Sent {notifications_sent} daily digest emails")
        return notifications_sent
    
    @staticmethod
    def send_weekly_digest():
        """Envoie un résumé hebdomadaire aux utilisateurs qui l'ont demandé"""
        from datetime import timedelta
        
        last_week = timezone.now() - timedelta(days=7)
        recent_news = News.objects.filter(
            status='published',
            publish_date__gte=last_week
        ).order_by('-publish_date')
        
        if not recent_news.exists():
            logger.info("No news to send in weekly digest")
            return
        
        weekly_users = User.objects.filter(
            is_active=True,
            email_notifications=True,
            notification_frequency='weekly'
        )
        
        notifications_sent = 0
        
        for user in weekly_users:
            try:
                subject = f"Résumé hebdomadaire - {recent_news.count()} actualités cette semaine"
                
                html_content = render_to_string('email/weekly_digest.html', {
                    'user': user,
                    'news_list': recent_news,
                    'site_url': settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://127.0.0.1:8000'
                })
                
                success = send_mail(
                    subject=subject,
                    message=f"Bonjour {user.get_full_name() or user.username}, voici le résumé des actualités de la semaine.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    html_message=html_content,
                    fail_silently=False
                )
                
                if success:
                    notifications_sent += 1
                    
            except Exception as e:
                logger.error(f"Failed to send weekly digest to {user.email}: {str(e)}")
        
        logger.info(f"Sent {notifications_sent} weekly digest emails")
        return notifications_sent
    
    @staticmethod
    def send_moderation_notification(news, action, moderator, reason=None):
        """Envoie une notification à l'auteur suite à une action de modération"""
        try:
            author = news.author
            if not author or not author.email:
                logger.warning(f"No author or email for news {news.pk}")
                return False
            
            # Déterminer le sujet et le template selon l'action
            if action == 'approved':
                subject = f"Votre article '{news.title}' a été approuvé"
                template_name = 'email/news_approved.html'
                message_type = "approuvé"
            elif action == 'rejected':
                subject = f"Votre article '{news.title}' a été rejeté"
                template_name = 'email/news_rejected.html'
                message_type = "rejeté"
            else:
                logger.error(f"Unknown moderation action: {action}")
                return False
            
            # Contenu HTML
            html_content = render_to_string(template_name, {
                'author': author,
                'news': news,
                'moderator': moderator,
                'reason': reason,
                'action': action,
                'site_url': settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://127.0.0.1:8000'
            })
            
            # Contenu texte simple
            text_content = f"""
            Bonjour {author.get_full_name() or author.username},
            
            Votre article "{news.title}" a été {message_type} par {moderator.get_full_name() or moderator.username}.
            
            Détails:
            - Titre: {news.title}
            - Catégorie: {news.category.name}
            - Date de soumission: {news.created_at.strftime('%d/%m/%Y à %H:%M')}
            - Modérateur: {moderator.get_full_name() or moderator.username}
            """
            
            if reason:
                text_content += f"\nRaison: {reason}"
            
            if action == 'approved':
                text_content += f"\n\nVotre article est maintenant publié et visible par tous les utilisateurs."
            else:
                text_content += f"\n\nVous pouvez modifier votre article et le soumettre à nouveau pour révision."
            
            text_content += f"""
            
            Pour consulter vos articles, connectez-vous à votre espace: {settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://127.0.0.1:8000'}
            
            Cordialement,
            L'équipe de modération
            Actualités Étudiantes Kinshasa
            """
            
            # Envoyer l'email
            success = send_mail(
                subject=subject,
                message=text_content,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[author.email],
                html_message=html_content,
                fail_silently=False
            )
            
            # Enregistrer la notification
            notification = Notification.objects.create(
                user=author,
                news=news,
                notification_type='email',
                title=subject,
                message=text_content,
                status='sent' if success else 'failed',
                sent_at=timezone.now() if success else None
            )
            
            logger.info(f"Moderation notification ({action}) {'sent' if success else 'failed'} to {author.email}")
            return success
            
        except Exception as e:
            logger.error(f"Failed to send moderation notification to {author.email}: {str(e)}")
            
            # Enregistrer l'échec
            Notification.objects.create(
                user=author,
                news=news,
                notification_type='email',
                title=f"Article {message_type}: {news.title}",
                message=str(e),
                status='failed'
            )
            return False
    
    @staticmethod
    def send_submission_confirmation(news):
        """Envoie une confirmation de soumission à l'auteur"""
        try:
            author = news.author
            if not author or not author.email:
                logger.warning(f"No author or email for news {news.pk}")
                return False
            
            subject = f"Confirmation de soumission: '{news.title}'"
            
            # Contenu HTML
            html_content = render_to_string('email/submission_confirmation.html', {
                'author': author,
                'news': news,
                'site_url': settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://127.0.0.1:8000'
            })
            
            # Contenu texte simple
            text_content = f"""
            Bonjour {author.get_full_name() or author.username},
            
            Nous avons bien reçu votre article "{news.title}".
            
            Détails de la soumission:
            - Titre: {news.title}
            - Catégorie: {news.category.name}
            - Importance: {news.get_importance_display()}
            - Date de soumission: {news.created_at.strftime('%d/%m/%Y à %H:%M')}
            
            Votre article est maintenant en attente de modération. Vous recevrez une notification par email une fois qu'il aura été examiné par notre équipe.
            
            Le processus de modération peut prendre de quelques heures à quelques jours selon le volume de soumissions.
            
            Pour consulter le statut de vos articles, connectez-vous à votre espace: {settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://127.0.0.1:8000'}
            
            Merci pour votre contribution !
            
            Cordialement,
            L'équipe Actualités Étudiantes Kinshasa
            """
            
            # Envoyer l'email
            success = send_mail(
                subject=subject,
                message=text_content,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[author.email],
                html_message=html_content,
                fail_silently=False
            )
            
            # Enregistrer la notification
            notification = Notification.objects.create(
                user=author,
                news=news,
                notification_type='email',
                title=subject,
                message=text_content,
                status='sent' if success else 'failed',
                sent_at=timezone.now() if success else None
            )
            
            logger.info(f"Submission confirmation {'sent' if success else 'failed'} to {author.email}")
            return success
            
        except Exception as e:
            logger.error(f"Failed to send submission confirmation to {author.email}: {str(e)}")
            return False