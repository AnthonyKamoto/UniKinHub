import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from django.contrib.auth import get_user_model
from news.models import News, Comment, NewsLike, Category

User = get_user_model()

print('📊 Statistiques des données créées:')
print('=' * 50)
print(f'👥 Utilisateurs: {User.objects.count()}')
print(f'   - Admins: {User.objects.filter(role="admin").count()}')
print(f'   - Modérateurs: {User.objects.filter(role="moderator").count()}')
print(f'   - Enseignants: {User.objects.filter(role="teacher").count()}')
print(f'   - Publiants: {User.objects.filter(role="publisher").count()}')
print(f'   - Étudiants: {User.objects.filter(role="student").count()}')
print()
print(f'📰 Actualités: {News.objects.count()}')
print(f'   - Publiées: {News.objects.filter(status="published").count()}')
print(f'   - En attente: {News.objects.filter(status="pending").count()}')
print(f'   - Brouillons: {News.objects.filter(status="draft").count()}')
print()
print(f'🏷️  Catégories: {Category.objects.count()}')
for cat in Category.objects.all():
    count = News.objects.filter(category=cat, status="published").count()
    print(f'   - {cat.name}: {count} actualités publiées')
print()
print(f'💬 Commentaires: {Comment.objects.count()}')
print(f'❤️  Likes: {NewsLike.objects.count()}')
print('=' * 50)
