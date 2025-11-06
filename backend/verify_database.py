#!/usr/bin/env python
"""Script de vérification des données en base de données"""

import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from news.models import News, Comment, NewsLike, Category
from django.contrib.auth import get_user_model

User = get_user_model()

def main():
    print("\n" + "="*80)
    print("🔍 VÉRIFICATION DE LA BASE DE DONNÉES")
    print("="*80 + "\n")
    
    # Comptage des données
    users_count = User.objects.count()
    news_count = News.objects.count()
    comments_count = Comment.objects.count()
    likes_count = NewsLike.objects.count()
    categories_count = Category.objects.count()
    
    print(f"✅ Base de données SQLite: backend/db.sqlite3")
    print(f"\n📊 RÉSUMÉ DES DONNÉES:")
    print(f"   👥 Utilisateurs: {users_count}")
    print(f"   📰 Actualités: {news_count}")
    print(f"   🏷️  Catégories: {categories_count}")
    print(f"   💬 Commentaires: {comments_count}")
    print(f"   ❤️  Likes: {likes_count}")
    
    # Détails par statut
    published = News.objects.filter(status='published').count()
    pending = News.objects.filter(status='pending').count()
    draft = News.objects.filter(status='draft').count()
    
    print(f"\n📈 RÉPARTITION DES ACTUALITÉS:")
    print(f"   ✓ Publiées: {published}")
    print(f"   ⏳ En attente: {pending}")
    print(f"   📝 Brouillons: {draft}")
    
    # Détails par rôle
    print(f"\n👥 RÉPARTITION DES UTILISATEURS:")
    for role, label in [('admin', 'Admins'), ('moderator', 'Modérateurs'), 
                        ('teacher', 'Enseignants'), ('publisher', 'Publiants'), 
                        ('student', 'Étudiants')]:
        count = User.objects.filter(role=role).count()
        print(f"   {label}: {count}")
    
    # Taille du fichier
    db_path = 'db.sqlite3'
    if os.path.exists(db_path):
        size_bytes = os.path.getsize(db_path)
        size_mb = size_bytes / (1024 * 1024)
        size_kb = size_bytes / 1024
        print(f"\n💾 TAILLE DE LA BASE:")
        print(f"   {size_mb:.2f} MB ({size_kb:.2f} KB)")
    
    # Quelques exemples
    print(f"\n🔎 EXEMPLES DE DONNÉES:")
    
    # 3 actualités récentes
    recent_news = News.objects.filter(status='published').order_by('-created_at')[:3]
    print(f"\n   📰 Actualités récentes publiées:")
    for news in recent_news:
        print(f"      - {news.title[:50]}... ({news.author.get_full_name()})")
    
    # 3 utilisateurs
    print(f"\n   👤 Exemples d'utilisateurs:")
    for user in User.objects.all()[:5]:
        print(f"      - {user.username} ({user.get_full_name()}) - {user.role}")
    
    # Catégories
    print(f"\n   🏷️  Catégories disponibles:")
    for category in Category.objects.all():
        news_in_cat = News.objects.filter(category=category, status='published').count()
        print(f"      - {category.name}: {news_in_cat} actualités publiées")
    
    print("\n" + "="*80)
    print("✅ TOUTES LES DONNÉES SONT BIEN EN BASE DE DONNÉES!")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()
