import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from news.models import Role

print('\n🔧 Création/Mise à jour des rôles corrects...\n')

# Définir les rôles conformes au modèle
roles_data = [
    {
        'nom': 'admin_global',
        'description': 'Administrateur global du système avec tous les droits',
        'permissions': {
            'can_manage_all': True,
            'can_verify_users': True,
            'can_moderate_news': True,
            'can_create_content': True,
            'can_view_content': True,
        }
    },
    {
        'nom': 'moderateur',
        'description': 'Modérateur de contenu, peut approuver/rejeter les actualités',
        'permissions': {
            'can_moderate_news': True,
            'can_view_content': True,
        }
    },
    {
        'nom': 'enseignant',
        'description': 'Enseignant ou professeur',
        'permissions': {
            'can_create_content': True,
            'can_view_content': True,
        }
    },
    {
        'nom': 'publiant',
        'description': 'Publiant, peut créer du contenu',
        'permissions': {
            'can_create_content': True,
            'can_view_content': True,
        }
    },
    {
        'nom': 'etudiant',
        'description': 'Étudiant, peut consulter le contenu',
        'permissions': {
            'can_view_content': True,
        }
    },
]

for role_data in roles_data:
    role, created = Role.objects.update_or_create(
        nom=role_data['nom'],
        defaults={
            'description': role_data['description'],
            'permissions': role_data['permissions'],
            'est_actif': True,
        }
    )
    action = 'Créé' if created else 'Mis à jour'
    print(f'✓ {action}: {role.get_nom_display()} ({role.nom})')

print(f'\n📊 Total: {Role.objects.count()} rôles en base\n')
