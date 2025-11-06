from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random

from news.models import Category, News, Comment, NewsLike

User = get_user_model()


class Command(BaseCommand):
    help = "Crée des données de test complètes pour l'application"

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=15,
            help='Nombre d\'utilisateurs à créer'
        )
        parser.add_argument(
            '--news',
            type=int,
            default=30,
            help='Nombre d\'actualités à créer'
        )
        parser.add_argument(
            '--comments',
            type=int,
            default=50,
            help='Nombre de commentaires à créer'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Début de la création des données de test...'))
        
        # Créer les catégories si elles n'existent pas
        categories = self.create_categories()
        
        # Créer les utilisateurs de test
        users = self.create_users(options['users'])
        
        # Créer les actualités
        news_list = self.create_news(options['news'], users, categories)
        
        # Créer les commentaires
        self.create_comments(options['comments'], users, news_list)
        
        self.stdout.write(self.style.SUCCESS('✅ Données de test créées avec succès!'))
        self.stdout.write(self.style.SUCCESS(f'   - {len(users)} utilisateurs'))
        self.stdout.write(self.style.SUCCESS(f'   - {len(news_list)} actualités'))
        self.stdout.write(self.style.SUCCESS(f'   - {options["comments"]} commentaires'))

    def create_categories(self):
        """Crée les catégories de base"""
        categories_data = [
            {
                'name': 'Académique',
                'description': 'Informations académiques et pédagogiques',
                'color': '#2196F3'
            },
            {
                'name': 'Événements',
                'description': 'Événements universitaires et culturels',
                'color': '#FF9800'
            },
            {
                'name': 'Sports',
                'description': 'Activités sportives et compétitions',
                'color': '#4CAF50'
            },
            {
                'name': 'Administratif',
                'description': 'Annonces administratives',
                'color': '#9C27B0'
            },
            {
                'name': 'Recherche',
                'description': 'Actualités de la recherche scientifique',
                'color': '#00BCD4'
            },
            {
                'name': 'Vie étudiante',
                'description': 'Activités et services pour étudiants',
                'color': '#E91E63'
            },
        ]
        
        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': cat_data['description'],
                    'color': cat_data['color']
                }
            )
            categories.append(category)
            if created:
                self.stdout.write(f'  ✓ Catégorie créée: {category.name}')
        
        return categories

    def create_users(self, count):
        """Crée des utilisateurs de test"""
        universities = ['UNIKIN', 'UPN', 'ISC', 'ULK', 'UNILU']
        programs = ['Informatique', 'Sciences', 'Médecine', 'Droit', 'Économie', 'Ingénierie']
        roles = ['student', 'teacher', 'publisher', 'moderator']
        
        first_names = [
            'Jean', 'Marie', 'Pierre', 'Sophie', 'Luc', 'Anne', 'Paul', 'Claire',
            'Michel', 'Isabelle', 'François', 'Nathalie', 'Marc', 'Sandrine', 'David'
        ]
        last_names = [
            'Mukendi', 'Kabongo', 'Tshimanga', 'Kalala', 'Mbuyi', 'Kasongo',
            'Ngoy', 'Ilunga', 'Mutombo', 'Kabamba', 'Mwamba', 'Kayembe'
        ]
        
        users = []
        
        # Créer un admin si pas existe
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@unikin.cd',
                'first_name': 'Admin',
                'last_name': 'System',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
                'university': 'UNIKIN',
                'program': 'Administration'
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(f'  ✓ Admin créé: {admin.username}')
        users.append(admin)
        
        # Créer des utilisateurs variés
        for i in range(count):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            username = f'{first_name.lower()}.{last_name.lower()}{i}'
            
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@student.unikin.cd',
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': random.choice(roles),
                    'university': random.choice(universities),
                    'program': random.choice(programs),
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'  ✓ Utilisateur créé: {user.username} ({user.role})')
            users.append(user)
        
        return users

    def create_news(self, count, users, categories):
        """Crée des actualités de test"""
        news_templates = [
            {
                'title': 'Nouvelle procédure d\'inscription pour l\'année académique',
                'content': 'L\'université annonce une nouvelle procédure d\'inscription en ligne simplifiée pour tous les étudiants...',
                'importance': 'high'
            },
            {
                'title': 'Conférence internationale sur l\'Intelligence Artificielle',
                'content': 'La faculté des sciences organise une conférence internationale sur l\'IA et le Machine Learning...',
                'importance': 'medium'
            },
            {
                'title': 'Journée portes ouvertes - Découvrez nos programmes',
                'content': 'Venez découvrir nos différents programmes d\'études lors de notre journée portes ouvertes...',
                'importance': 'medium'
            },
            {
                'title': 'Résultats du championnat universitaire de football',
                'content': 'L\'équipe de football de notre université remporte le championnat inter-universitaire...',
                'importance': 'low'
            },
            {
                'title': 'Nouvelle bibliothèque numérique disponible',
                'content': 'Les étudiants ont maintenant accès à une bibliothèque numérique avec plus de 10 000 ouvrages...',
                'importance': 'high'
            },
            {
                'title': 'Séminaire sur l\'entrepreneuriat étudiant',
                'content': 'Participez au séminaire sur l\'entrepreneuriat et découvrez comment créer votre startup...',
                'importance': 'medium'
            },
            {
                'title': 'Bourses d\'études disponibles pour l\'année prochaine',
                'content': 'Plusieurs bourses d\'études nationales et internationales sont disponibles pour les étudiants méritants...',
                'importance': 'high'
            },
            {
                'title': 'Nouveau laboratoire de recherche en biotechnologie',
                'content': 'L\'université inaugure un nouveau laboratoire de recherche équipé des dernières technologies...',
                'importance': 'medium'
            },
            {
                'title': 'Session de rattrapage - Calendrier des examens',
                'content': 'Le calendrier des examens de rattrapage est maintenant disponible sur le portail étudiant...',
                'importance': 'high'
            },
            {
                'title': 'Concert de fin d\'année par l\'orchestre universitaire',
                'content': 'L\'orchestre universitaire donnera un concert exceptionnel pour célébrer la fin de l\'année...',
                'importance': 'low'
            },
        ]
        
        news_list = []
        statuses = ['published', 'published', 'published', 'pending', 'draft']
        
        # Filtrer les utilisateurs qui peuvent créer des actualités
        publishers = [u for u in users if u.role in ['admin', 'teacher', 'publisher', 'moderator']]
        
        for i in range(count):
            template = random.choice(news_templates)
            
            # Générer une variation du titre
            title_variations = [
                template['title'],
                f"{template['title']} - {random.choice(['Important', 'À ne pas manquer', 'Urgent'])}",
                f"{template['title']} {2024 + random.randint(0, 1)}",
            ]
            
            # Date aléatoire dans les 30 derniers jours
            days_ago = random.randint(0, 30)
            publish_date = timezone.now() - timedelta(days=days_ago)
            
            status = random.choice(statuses)
            author = random.choice(publishers)
            
            news = News.objects.create(
                final_title=random.choice(title_variations),
                final_content=f"{template['content']}\n\nPublié par {author.get_full_name()} le {publish_date.strftime('%d/%m/%Y')}.",
                author=author,
                category=random.choice(categories),
                status=status,
                importance=template['importance'],
                publish_date=publish_date if status == 'published' else None,
                written_at=publish_date - timedelta(hours=random.randint(1, 48)),
            )
            
            # Ajouter des likes aléatoires
            if status == 'published':
                num_likes = random.randint(0, 15)
                likers = random.sample(users, min(num_likes, len(users)))
                for liker in likers:
                    NewsLike.objects.get_or_create(news=news, user=liker)
            
            news_list.append(news)
            self.stdout.write(f'  ✓ Actualité créée: {news.final_title[:50]}... ({status})')
        
        return news_list

    def create_comments(self, count, users, news_list):
        """Crée des commentaires sur les actualités"""
        comment_templates = [
            "Très intéressant ! Merci pour le partage.",
            "Super initiative, j'ai hâte d'y participer.",
            "Quelqu'un a plus d'informations sur les dates ?",
            "Excellente nouvelle pour notre université !",
            "Merci pour ces informations utiles.",
            "Je serai présent à cet événement.",
            "Bravo à l'équipe organisatrice !",
            "Où peut-on s'inscrire ?",
            "C'est une excellente opportunité pour les étudiants.",
            "Très bonne initiative, continuez comme ça !",
            "Quelqu'un sait si c'est gratuit ?",
            "Merci de nous tenir informés.",
        ]
        
        # Ne commenter que les actualités publiées
        published_news = [n for n in news_list if n.status == 'published']
        
        if not published_news:
            self.stdout.write(self.style.WARNING('  ⚠ Aucune actualité publiée pour commenter'))
            return
        
        for i in range(count):
            news = random.choice(published_news)
            user = random.choice(users)
            content = random.choice(comment_templates)
            
            # Date aléatoire après la publication
            days_after = random.randint(0, 7)
            created_at = news.publish_date + timedelta(days=days_after, hours=random.randint(0, 23))
            
            comment = Comment.objects.create(
                news=news,
                author=user,
                content=content,
                created_at=created_at
            )
            
            if i % 10 == 0:  # Afficher tous les 10 commentaires
                self.stdout.write(f'  ✓ {i+1}/{count} commentaires créés...')
