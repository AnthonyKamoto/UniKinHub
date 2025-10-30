from django.core.management.base import BaseCommand
from news.models import User, News
from news.notification_service import NotificationService


class Command(BaseCommand):
    help = 'Teste l\'envoi de notifications email'

    def add_arguments(self, parser):
        parser.add_argument(
            '--type',
            type=str,
            choices=['approval', 'rejection', 'submission', 'daily', 'weekly'],
            default='submission',
            help='Type de notification à tester',
        )
        parser.add_argument(
            '--user',
            type=str,
            help='Username de l\'utilisateur pour les tests (optionnel)',
        )

    def handle(self, *args, **options):
        notification_type = options['type']
        username = options.get('user')
        
        self.stdout.write(
            self.style.SUCCESS(f'Test de notification email: {notification_type}')
        )
        
        try:
            if notification_type in ['approval', 'rejection', 'submission']:
                # Trouver un utilisateur et un article pour les tests
                if username:
                    user = User.objects.get(username=username)
                else:
                    user = User.objects.filter(is_active=True).first()
                    
                if not user:
                    self.stdout.write(self.style.ERROR('Aucun utilisateur trouvé'))
                    return
                
                # Trouver ou créer un article de test
                news = News.objects.filter(author=user).first()
                if not news:
                    self.stdout.write(self.style.WARNING('Aucun article trouvé pour cet utilisateur'))
                    return
                
                # Envoyer la notification appropriée
                if notification_type == 'submission':
                    success = NotificationService.send_submission_confirmation(news)
                elif notification_type == 'approval':
                    moderator = User.objects.filter(role='moderator').first() or user
                    success = NotificationService.send_moderation_notification(
                        news, 'approved', moderator, 'Article de qualité, bien rédigé.'
                    )
                elif notification_type == 'rejection':
                    moderator = User.objects.filter(role='moderator').first() or user
                    success = NotificationService.send_moderation_notification(
                        news, 'rejected', moderator, 'L\'article nécessite des corrections: vérifiez l\'orthographe et ajoutez des sources.'
                    )
                
                if success:
                    self.stdout.write(
                        self.style.SUCCESS(f'Notification {notification_type} envoyée avec succès à {user.email}')
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(f'Échec de l\'envoi de la notification {notification_type}')
                    )
                    
            elif notification_type == 'daily':
                count = NotificationService.send_daily_digest()
                self.stdout.write(
                    self.style.SUCCESS(f'Digest quotidien envoyé à {count} utilisateurs')
                )
                
            elif notification_type == 'weekly':
                count = NotificationService.send_weekly_digest()
                self.stdout.write(
                    self.style.SUCCESS(f'Digest hebdomadaire envoyé à {count} utilisateurs')
                )
                
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Utilisateur "{username}" non trouvé'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erreur lors du test: {str(e)}'))