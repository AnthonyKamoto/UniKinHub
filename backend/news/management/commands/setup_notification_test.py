from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from news.models import News, Category
from datetime import timedelta
from django.utils import timezone

User = get_user_model()


class Command(BaseCommand):
    help = 'Configure les préférences de notification pour tester les digest'

    def add_arguments(self, parser):
        parser.add_argument(
            '--frequency',
            type=str,
            choices=['immediate', 'daily', 'weekly'],
            default='daily',
            help='Fréquence de notification à configurer',
        )

    def handle(self, *args, **options):
        frequency = options['frequency']
        
        self.stdout.write(
            self.style.SUCCESS(f'Configuration des utilisateurs pour les notifications {frequency}...')
        )
        
        # Mettre à jour tous les utilisateurs actifs
        users_updated = User.objects.filter(is_active=True).update(
            notification_frequency=frequency,
            email_notifications=True
        )
        
        self.stdout.write(
            self.style.SUCCESS(f'{users_updated} utilisateurs configurés avec la fréquence "{frequency}"')
        )
        
        # Créer quelques actualités récentes pour les tests
        if frequency in ['daily', 'weekly']:
            self.create_test_news()
        
        self.stdout.write(
            self.style.SUCCESS('Configuration terminée avec succès!')
        )

    def create_test_news(self):
        """Crée quelques actualités de test pour les digest"""
        try:
            # Obtenir une catégorie
            category = Category.objects.first()
            if not category:
                self.stdout.write(self.style.WARNING('Aucune catégorie trouvée'))
                return
            
            # Obtenir un utilisateur
            user = User.objects.filter(role='publisher').first()
            if not user:
                user = User.objects.filter(is_active=True).first()
            
            if not user:
                self.stdout.write(self.style.WARNING('Aucun utilisateur trouvé'))
                return
            
            # Créer quelques actualités récentes
            test_news = [
                {
                    'title': 'Nouvelle bibliothèque universitaire ouverte',
                    'content': 'Une nouvelle bibliothèque moderne vient d\'ouvrir ses portes avec plus de 50 000 ouvrages.',
                    'importance': 'medium'
                },
                {
                    'title': 'Concours de sciences informatiques',
                    'content': 'Le département d\'informatique organise un concours de programmation ouvert à tous.',
                    'importance': 'high'
                },
                {
                    'title': 'Nouvelle cafétéria étudiante',
                    'content': 'Une cafétéria moderne avec des plats variés a été inaugurée au campus principal.',
                    'importance': 'low'
                }
            ]
            
            created_count = 0
            for news_data in test_news:
                news, created = News.objects.get_or_create(
                    title=news_data['title'],
                    defaults={
                        'content': news_data['content'],
                        'author': user,
                        'category': category,
                        'importance': news_data['importance'],
                        'status': 'published',
                        'publish_date': timezone.now()
                    }
                )
                if created:
                    created_count += 1
            
            self.stdout.write(
                self.style.SUCCESS(f'{created_count} nouvelles actualités créées pour les tests')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Erreur lors de la création des actualités de test: {str(e)}')
            )