import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from news.models import Role

print('\n🧹 Nettoyage des rôles incorrects...\n')

# Les valeurs correctes selon le modèle
correct_roles = ['admin_global', 'moderateur', 'enseignant', 'publiant', 'etudiant']

# Supprimer les rôles qui ne sont pas dans la liste
incorrect_roles = Role.objects.exclude(nom__in=correct_roles)
count = incorrect_roles.count()

if count > 0:
    print(f'Rôles incorrects trouvés: {count}')
    for role in incorrect_roles:
        print(f'  - {role.nom} (ID: {role.id})')
    
    incorrect_roles.delete()
    print(f'\n✓ {count} rôles incorrects supprimés\n')
else:
    print('✓ Aucun rôle incorrect trouvé\n')

# Afficher les rôles restants
print('📋 Rôles actifs:')
for role in Role.objects.filter(est_actif=True).order_by('nom'):
    print(f'  ✓ {role.get_nom_display()} ({role.nom})')

print(f'\n📊 Total: {Role.objects.count()} rôles en base\n')
