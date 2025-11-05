from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from news.models import Category, News

User = get_user_model()


class Command(BaseCommand):
    help = "Crée des données de test pour le système de modération"

    def handle(self, *args, **options):
        # Créer un utilisateur modérateur
        moderator, created = User.objects.get_or_create(
            username="moderator",
            defaults={
                "email": "moderator@example.com",
                "first_name": "Jean",
                "last_name": "Moderateur",
                "role": "moderator",
                "is_staff": True,
                "university": "UNIKIN",
                "program": "Informatique",
            },
        )
        if created:
            moderator.set_password("moderator123")
            moderator.save()
            self.stdout.write(
                self.style.SUCCESS(f"Utilisateur modérateur créé: {moderator.username}")
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"Utilisateur modérateur existe déjà: {moderator.username}"
                )
            )

        # Créer un utilisateur publiant pour tester
        publisher, created = User.objects.get_or_create(
            username="publisher",
            defaults={
                "email": "publisher@example.com",
                "first_name": "Marie",
                "last_name": "Publiant",
                "role": "publisher",
                "university": "UPN",
                "program": "Sciences",
            },
        )
        if created:
            publisher.set_password("publisher123")
            publisher.save()
            self.stdout.write(
                self.style.SUCCESS(f"Utilisateur publiant créé: {publisher.username}")
            )

        # Créer des catégories si elles n'existent pas
        categories_data = [
            {
                "name": "Académique",
                "description": "Informations académiques",
                "color": "#FF9800",
            },
            {
                "name": "Infrastructure",
                "description": "Infrastructures universitaires",
                "color": "#2196F3",
            },
            {
                "name": "Événements",
                "description": "Événements du campus",
                "color": "#4CAF50",
            },
            {
                "name": "Urgent",
                "description": "Informations urgentes",
                "color": "#F44336",
            },
        ]

        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data["name"], defaults=cat_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Catégorie créée: {category.name}")
                )

        # Créer des actualités en attente de modération
        academic_cat = Category.objects.get(name="Académique")
        urgent_cat = Category.objects.get(name="Urgent")
        event_cat = Category.objects.get(name="Événements")

        news_data = [
            {
                "title": "Report des examens de fin de session",
                "content": "En raison de circonstances exceptionnelles liées aux conditions météorologiques, les examens de fin de session initialement prévus du 25 au 30 octobre sont reportés du 2 au 7 novembre 2025. Tous les étudiants sont priés de prendre note de ce changement important et de se préparer en conséquence.",
                "category": urgent_cat,
                "importance": "urgent",
                "status": "pending",
                "author": publisher,
            },
            {
                "title": "Nouvelle bibliothèque numérique disponible",
                "content": "L'université met à disposition une nouvelle plateforme de bibliothèque numérique avec plus de 50,000 ouvrages académiques. L'accès se fait via le portail étudiant avec vos identifiants habituels. Cette ressource sera particulièrement utile pour vos recherches et travaux de fin d'études.",
                "category": academic_cat,
                "importance": "medium",
                "status": "pending",
                "author": publisher,
            },
            {
                "title": "Concours de programmation inter-universitaire",
                "content": "Inscription ouverte pour le grand concours de programmation qui aura lieu le 15 novembre 2025. Prix attractifs pour les gagnants : ordinateurs portables, tablettes et bourses d'études. Équipes de 3 membres maximum. Inscriptions jusqu'au 5 novembre via le secrétariat de la faculté d'informatique.",
                "category": event_cat,
                "importance": "low",
                "status": "pending",
                "author": publisher,
            },
        ]

        for news_info in news_data:
            news, created = News.objects.get_or_create(
                title=news_info["title"], defaults=news_info
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Actualité créée: {news.title}"))

        self.stdout.write(
            self.style.SUCCESS(
                "✅ Données de test pour la modération créées avec succès!"
            )
        )
        self.stdout.write(
            self.style.SUCCESS("🔑 Identifiants modérateur: moderator / moderator123")
        )
        self.stdout.write(
            self.style.SUCCESS("🔑 Identifiants publiant: publisher / publisher123")
        )
