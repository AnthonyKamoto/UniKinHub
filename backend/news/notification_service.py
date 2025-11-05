import json
import logging
import smtplib
from datetime import timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests
from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Q
from django.template.loader import render_to_string
from django.utils import timezone

from .models import News, Notification, User

logger = logging.getLogger(__name__)


class NotificationService:
    """Service pour gérer l'envoi de notifications"""

    @staticmethod
    def send_email_notification(
        user, news, template_name="email/news_notification.html"
    ):
        """Envoie une notification par email"""
        try:
            subject = f"Nouvelle actualité: {news.title}"

            # Contenu HTML
            html_content = render_to_string(
                template_name,
                {
                    "user": user,
                    "news": news,
                    "site_url": (
                        settings.SITE_URL
                        if hasattr(settings, "SITE_URL")
                        else "http://127.0.0.1:8000"
                    ),
                },
            )

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
                fail_silently=False,
            )

            # Enregistrer la notification
            notification = Notification.objects.create(
                user=user,
                news=news,
                notification_type="email",
                title=subject,
                message=text_content,
                status="sent" if success else "failed",
                sent_at=timezone.now() if success else None,
            )

            logger.info(
                f"Email notification {'sent' if success else 'failed'} to {user.email}"
            )
            return success

        except Exception as e:
            logger.error(f"Failed to send email notification to {user.email}: {str(e)}")

            # Enregistrer l'échec
            Notification.objects.create(
                user=user,
                news=news,
                notification_type="email",
                title=f"Nouvelle actualité: {news.title}",
                message=str(e),
                status="failed",
            )
            return False

    @staticmethod
    def send_push_notification(user, news):
        """Envoie une notification push via FCM"""
        if not user.fcm_token:
            logger.warning(f"User {user.username} has no FCM token")
            return False

        if not hasattr(settings, "FCM_SERVER_KEY") or not settings.FCM_SERVER_KEY:
            logger.error("FCM_SERVER_KEY not configured in settings")
            return False

        try:
            # Configuration FCM
            fcm_url = "https://fcm.googleapis.com/fcm/send"
            fcm_headers = {
                "Authorization": f"key={settings.FCM_SERVER_KEY}",
                "Content-Type": "application/json",
            }

            # Payload de la notification avec priorité élevée pour Android
            payload = {
                "to": user.fcm_token,
                "priority": "high",
                "notification": {
                    "title": f"📰 {news.category.name}",
                    "body": news.title,
                    "icon": "notification_icon",
                    "sound": "default",
                    "click_action": "FLUTTER_NOTIFICATION_CLICK",
                },
                "data": {
                    "news_id": str(news.pk),
                    "category": news.category.name,
                    "importance": news.importance,
                    "type": "new_article",
                    "route": "/news-detail",
                },
            }

            response = requests.post(
                fcm_url, headers=fcm_headers, data=json.dumps(payload), timeout=10
            )
            success = response.status_code == 200

            if not success:
                logger.error(f"FCM error: {response.text}")

            # Enregistrer la notification
            notification = Notification.objects.create(
                user=user,
                news=news,
                notification_type="push",
                title=f"📰 {news.category.name}",
                message=news.title,
                status="sent" if success else "failed",
                sent_at=timezone.now() if success else None,
            )

            logger.info(
                f"Push notification {'sent' if success else 'failed'} to {user.username}"
            )
            return success

        except Exception as e:
            logger.error(
                f"Failed to send push notification to {user.username}: {str(e)}"
            )

            # Enregistrer l'échec
            Notification.objects.create(
                user=user,
                news=news,
                notification_type="push",
                title="Notification Push",
                message=str(e),
                status="failed",
            )
            return False

    @staticmethod
    def notify_users_of_new_news(news):
        """Notifie tous les utilisateurs éligibles d'une nouvelle actualité"""
        notifications_sent = 0
        push_notifications_sent = 0

        # Les news urgentes doivent être envoyées immédiatement à tous les utilisateurs actifs
        if news.importance == "urgent":
            users = User.objects.filter(is_active=True)
            for user in users:
                if user.email_notifications and user.email:
                    if NotificationService.send_email_notification(user, news):
                        notifications_sent += 1
                if user.push_notifications and user.fcm_token:
                    if NotificationService.send_push_notification(user, news):
                        push_notifications_sent += 1

            logger.info(
                f"Sent {notifications_sent} email and {push_notifications_sent} push notifications (urgent) for news: {news.title}"
            )
            return notifications_sent + push_notifications_sent

        # Pour les news non-urgentes : envoyer immédiatement aux utilisateurs qui ont choisi 'immediate'
        immediate_users = User.objects.filter(
            is_active=True, notification_frequency="immediate"
        )
        for user in immediate_users:
            if user.email_notifications and user.email:
                if NotificationService.send_email_notification(user, news):
                    notifications_sent += 1
            if user.push_notifications and user.fcm_token:
                if NotificationService.send_push_notification(user, news):
                    push_notifications_sent += 1

        # Envoyer push aux utilisateurs ayant activé les push indépendamment de la fréquence
        push_users = User.objects.filter(
            is_active=True, push_notifications=True
        ).exclude(fcm_token="")
        for user in push_users:
            # éviter double envoi aux utilisateurs déjà traités
            if user in immediate_users:
                continue
            if NotificationService.send_push_notification(user, news):
                push_notifications_sent += 1

        logger.info(
            f"Sent {notifications_sent} email and {push_notifications_sent} push notifications for news: {news.title}"
        )
        return notifications_sent + push_notifications_sent

    @staticmethod
    def send_daily_digest():
        """Envoie un résumé quotidien aux utilisateurs qui l'ont demandé"""
        from datetime import timedelta

        yesterday = timezone.now() - timedelta(days=1)
        recent_news = News.objects.filter(
            status="published", publish_date__gte=yesterday
        ).order_by("-publish_date")

        if not recent_news.exists():
            logger.info("No news to send in daily digest")
            return

        daily_users = User.objects.filter(
            is_active=True, email_notifications=True, notification_frequency="daily"
        )

        notifications_sent = 0

        for user in daily_users:
            try:
                subject = (
                    f"Résumé quotidien - {recent_news.count()} nouvelles actualités"
                )

                html_content = render_to_string(
                    "email/daily_digest.html",
                    {
                        "user": user,
                        "news_list": recent_news,
                        "site_url": (
                            settings.SITE_URL
                            if hasattr(settings, "SITE_URL")
                            else "http://127.0.0.1:8000"
                        ),
                    },
                )

                success = send_mail(
                    subject=subject,
                    message=f"Bonjour {user.get_full_name() or user.username}, voici le résumé des actualités d'hier.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    html_message=html_content,
                    fail_silently=False,
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
            status="published", publish_date__gte=last_week
        ).order_by("-publish_date")

        if not recent_news.exists():
            logger.info("No news to send in weekly digest")
            return

        weekly_users = User.objects.filter(
            is_active=True, email_notifications=True, notification_frequency="weekly"
        )

        notifications_sent = 0

        for user in weekly_users:
            try:
                subject = f"Résumé hebdomadaire - {recent_news.count()} actualités cette semaine"

                html_content = render_to_string(
                    "email/weekly_digest.html",
                    {
                        "user": user,
                        "news_list": recent_news,
                        "site_url": (
                            settings.SITE_URL
                            if hasattr(settings, "SITE_URL")
                            else "http://127.0.0.1:8000"
                        ),
                    },
                )

                success = send_mail(
                    subject=subject,
                    message=f"Bonjour {user.get_full_name() or user.username}, voici le résumé des actualités de la semaine.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    html_message=html_content,
                    fail_silently=False,
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
            if action == "approved":
                subject = f"Votre article '{news.title}' a été approuvé"
                template_name = "email/news_approved.html"
                message_type = "approuvé"
            elif action == "rejected":
                subject = f"Votre article '{news.title}' a été rejeté"
                template_name = "email/news_rejected.html"
                message_type = "rejeté"
            else:
                logger.error(f"Unknown moderation action: {action}")
                return False

            # Contenu HTML
            html_content = render_to_string(
                template_name,
                {
                    "author": author,
                    "news": news,
                    "moderator": moderator,
                    "reason": reason,
                    "action": action,
                    "site_url": (
                        settings.SITE_URL
                        if hasattr(settings, "SITE_URL")
                        else "http://127.0.0.1:8000"
                    ),
                },
            )

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

            if action == "approved":
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
                fail_silently=False,
            )

            # Enregistrer la notification
            notification = Notification.objects.create(
                user=author,
                news=news,
                notification_type="email",
                title=subject,
                message=text_content,
                status="sent" if success else "failed",
                sent_at=timezone.now() if success else None,
            )

            logger.info(
                f"Moderation notification ({action}) {'sent' if success else 'failed'} to {author.email}"
            )
            return success

        except Exception as e:
            logger.error(
                f"Failed to send moderation notification to {author.email}: {str(e)}"
            )

            # Enregistrer l'échec
            Notification.objects.create(
                user=author,
                news=news,
                notification_type="email",
                title=f"Article {message_type}: {news.title}",
                message=str(e),
                status="failed",
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
            html_content = render_to_string(
                "email/submission_confirmation.html",
                {
                    "author": author,
                    "news": news,
                    "site_url": (
                        settings.SITE_URL
                        if hasattr(settings, "SITE_URL")
                        else "http://127.0.0.1:8000"
                    ),
                },
            )

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
                fail_silently=False,
            )

            # Enregistrer la notification
            notification = Notification.objects.create(
                user=author,
                news=news,
                notification_type="email",
                title=subject,
                message=text_content,
                status="sent" if success else "failed",
                sent_at=timezone.now() if success else None,
            )

            logger.info(
                f"Submission confirmation {'sent' if success else 'failed'} to {author.email}"
            )
            return success

        except Exception as e:
            logger.error(
                f"Failed to send submission confirmation to {author.email}: {str(e)}"
            )
            return False

    @staticmethod
    def send_immediate_notification(news):
        """
        Envoie une notification immédiate pour une news.
        Utilisé pour les news importantes/urgentes et les utilisateurs avec préférence 'immediate'
        """
        try:
            # Filtrer les utilisateurs concernés par le programme/formation
            users = User.objects.filter(
                Q(program=news.programme_ou_formation)
                | Q(programme_ou_formation=news.programme_ou_formation)
                | Q(target_programs__contains=news.programme_ou_formation),
                notification_frequency="immediate",
                email_notifications=True,
            ).exclude(
                notifications__news=news,
                notifications__notification_type="email",
                notifications__status="sent",
            )

            sent_count = 0
            for user in users:
                # Envoyer email
                if NotificationService.send_email_notification(user, news):
                    sent_count += 1

                # Envoyer push si activé
                if user.push_notifications:
                    NotificationService.send_push_notification(user, news)

            logger.info(
                f"Immediate notifications sent to {sent_count} users for news {news.pk}"
            )
            return sent_count

        except Exception as e:
            logger.error(f"Failed to send immediate notifications: {str(e)}")
            return 0

    @staticmethod
    def send_daily_digest():
        """
        Envoie le digest quotidien aux utilisateurs concernés.
        Inclut toutes les news publiées dans les dernières 24h pour leur programme
        """
        try:
            yesterday = timezone.now() - timedelta(days=1)

            # Utilisateurs avec préférence 'daily'
            users = User.objects.filter(
                notification_frequency="daily", email_notifications=True
            )

            sent_count = 0
            for user in users:
                # Filtrer les news pour cet utilisateur
                user_program = user.program or getattr(
                    user, "programme_ou_formation", None
                )
                if not user_program:
                    continue

                # News non encore notifiées pour ce programme
                news_list = (
                    News.objects.filter(
                        status="published",
                        programme_ou_formation=user_program,
                        publish_date__gte=yesterday,
                    )
                    .exclude(
                        notifications__user=user,
                        notifications__notification_type="email",
                        notifications__status="sent",
                    )
                    .order_by("-importance", "-publish_date")
                )

                if news_list.exists():
                    if NotificationService._send_digest_email(user, news_list, "daily"):
                        sent_count += 1

            logger.info(f"Daily digest sent to {sent_count} users")
            return sent_count

        except Exception as e:
            logger.error(f"Failed to send daily digest: {str(e)}")
            return 0

    @staticmethod
    def send_weekly_digest():
        """
        Envoie le digest hebdomadaire aux utilisateurs concernés.
        Inclut les news non-urgentes. Les news importantes/urgentes sont envoyées immédiatement.
        """
        try:
            last_week = timezone.now() - timedelta(days=7)

            # Utilisateurs avec préférence 'weekly'
            users = User.objects.filter(
                notification_frequency="weekly", email_notifications=True
            )

            sent_count = 0
            for user in users:
                # Filtrer les news pour cet utilisateur
                user_program = user.program or getattr(
                    user, "programme_ou_formation", None
                )
                if not user_program:
                    continue

                # News de la semaine passée (exclure urgent/high qui ont déjà été envoyées)
                news_list = (
                    News.objects.filter(
                        status="published",
                        programme_ou_formation=user_program,
                        publish_date__gte=last_week,
                        importance__in=[
                            "low",
                            "medium",
                        ],  # Seulement les news moins importantes
                    )
                    .exclude(
                        notifications__user=user,
                        notifications__notification_type="email",
                        notifications__status="sent",
                    )
                    .order_by("-importance", "-publish_date")
                )

                if news_list.exists():
                    if NotificationService._send_digest_email(
                        user, news_list, "weekly"
                    ):
                        sent_count += 1

            logger.info(f"Weekly digest sent to {sent_count} users")
            return sent_count

        except Exception as e:
            logger.error(f"Failed to send weekly digest: {str(e)}")
            return 0

    @staticmethod
    def _send_digest_email(user, news_list, digest_type):
        """
        Envoie un email digest (quotidien ou hebdomadaire) avec une liste de news
        """
        try:
            subject = f"Digest {'quotidien' if digest_type == 'daily' else 'hebdomadaire'} - Actualités"

            # Contenu HTML
            template_name = f"email/{digest_type}_digest.html"
            html_content = render_to_string(
                template_name,
                {
                    "user": user,
                    "news_list": news_list,
                    "digest_type": digest_type,
                    "site_url": (
                        settings.SITE_URL
                        if hasattr(settings, "SITE_URL")
                        else "http://127.0.0.1:8000"
                    ),
                },
            )

            # Contenu texte simple
            text_content = f"""
            Bonjour {user.get_full_name() or user.username},
            
            Voici votre digest {'quotidien' if digest_type == 'daily' else 'hebdomadaire'} des actualités :
            
            """

            for news in news_list:
                text_content += f"""
            --- [{news.get_importance_display()}] {news.title} ---
            Catégorie: {news.category.name}
            Programme: {news.programme_ou_formation}
            Date de publication: {news.publish_date.strftime('%d/%m/%Y à %H:%M')}
            
            {news.content[:200]}...
            
            """

            text_content += f"""
            Pour lire les articles complets, visitez: {settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://127.0.0.1:8000'}
            
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
                fail_silently=False,
            )

            # Enregistrer les notifications pour chaque news
            if success:
                for news in news_list:
                    Notification.objects.create(
                        user=user,
                        news=news,
                        notification_type="email",
                        title=subject,
                        message=f"Inclus dans le digest {digest_type}",
                        status="sent",
                        sent_at=timezone.now(),
                    )

            logger.info(
                f"{digest_type.capitalize()} digest {'sent' if success else 'failed'} to {user.email}"
            )
            return success

        except Exception as e:
            logger.error(
                f"Failed to send {digest_type} digest to {user.email}: {str(e)}"
            )
            return False

    @staticmethod
    def notify_on_news_published(news):
        """
        Point d'entrée principal pour les notifications lors de la publication d'une news.
        Gère la logique selon l'importance et les préférences des utilisateurs.
        """
        try:
            # News urgentes ou importantes : notification immédiate pour TOUS les utilisateurs concernés
            if news.importance in ["urgent", "high"]:
                # Envoyer à tous les utilisateurs du programme, quelle que soit leur préférence
                users = User.objects.filter(
                    Q(program=news.programme_ou_formation)
                    | Q(programme_ou_formation=news.programme_ou_formation),
                    email_notifications=True,
                ).exclude(notification_frequency="disabled")

                for user in users:
                    NotificationService.send_email_notification(user, news)
                    if user.push_notifications:
                        NotificationService.send_push_notification(user, news)

            # News normales : seulement pour les utilisateurs avec préférence 'immediate'
            else:
                NotificationService.send_immediate_notification(news)

            logger.info(
                f"Notifications triggered for news {news.pk} ({news.importance})"
            )

        except Exception as e:
            logger.error(f"Failed to notify on news published: {str(e)}")
