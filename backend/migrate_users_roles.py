import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from news.models import Role
from django.contrib.auth import get_user_model

User = get_user_model()

print('\n🔄 Migration des utilisateurs vers les nouveaux rôles...\n')

# Mapping ancien nom -> nouveau nom
role_mapping = {
    'Administrateur': 'admin_global',
    'Modérateur': 'moderateur',
    'Enseignant': 'enseignant',
    'Publiant': 'publiant',
    'Étudiant': 'etudiant',
}

# Récupérer les nouveaux rôles
new_roles = {nom: Role.objects.get(nom=nom) for nom in role_mapping.values()}

# Migrer les utilisateurs
for old_name, new_name in role_mapping.items():
    try:
        old_role = Role.objects.get(nom=old_name)
        new_role = new_roles[new_name]
        
        users = User.objects.filter(nouveau_role=old_role)
        count = users.count()
        
        if count > 0:
            users.update(nouveau_role=new_role)
            print(f'✓ {count} utilisateurs migrés: "{old_name}" → "{new_role.get_nom_display()}"')
    except Role.DoesNotExist:
        print(f'  ⚠ Rôle "{old_name}" introuvable')

print('\n📊 Répartition des utilisateurs par rôle:')
for role in Role.objects.filter(est_actif=True).order_by('nom'):
    count = User.objects.filter(nouveau_role=role).count()
    if count > 0:
        print(f'  {role.get_nom_display()}: {count} utilisateurs')

print()
