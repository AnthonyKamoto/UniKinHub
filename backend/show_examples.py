import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from django.contrib.auth import get_user_model
from news.models import News

User = get_user_model()

print('📰 Exemples d\'actualités publiées:')
print('=' * 80)

for news in News.objects.filter(status='published').order_by('-publish_date')[:5]:
    print(f'\n✓ {news.final_title}')
    print(f'  📅 Publié le: {news.publish_date.strftime("%d/%m/%Y à %H:%M")}')
    print(f'  👤 Auteur: {news.author.get_full_name()} ({news.author.role})')
    print(f'  🏷️  Catégorie: {news.category.name}')
    print(f'  ⭐ Importance: {news.importance}')
    print(f'  ❤️  Likes: {news.likes.count()}')
    print(f'  💬 Commentaires: {news.comments.count()}')

print('\n' + '=' * 80)
print('\n👥 Exemples d\'utilisateurs créés:')
print('=' * 80)

for role in ['admin', 'moderator', 'teacher', 'publisher', 'student']:
    users = User.objects.filter(role=role)[:2]
    if users:
        print(f'\n{role.upper()}:')
        for user in users:
            print(f'  - {user.username} ({user.get_full_name()}) - {user.university}')
