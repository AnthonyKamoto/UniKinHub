import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from news.models import Role

roles = Role.objects.all()
print(f'\n📋 Rôles en base de données: {roles.count()}\n')

for r in roles:
    print(f'ID: {r.id}')
    print(f'  nom: "{r.nom}"')
    print(f'  nom_display: "{r.get_nom_display()}"')
    print(f'  actif: {r.est_actif}')
    print(f'  description: "{r.description}"')
    print()
