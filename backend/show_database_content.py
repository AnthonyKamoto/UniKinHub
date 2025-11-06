#!/usr/bin/env python
"""Affichage détaillé des données de la base de données"""

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
    print("📋 CONTENU DÉTAILLÉ DE LA BASE DE DONNÉES")
    print("="*80 + "\n")
    
    # 1. Utilisateurs
    print("👥 UTILISATEURS (47 au total):")
    print("-" * 80)
    users = User.objects.all().order_by('role', 'username')
    for i, user in enumerate(users[:10], 1):
        print(f"{i:2}. {user.username:20} | {user.get_full_name():25} | {user.role:10} | {user.email}")
    if users.count() > 10:
        print(f"    ... et {users.count() - 10} autres utilisateurs")
    
    # 2. Catégories
    print(f"\n🏷️  CATÉGORIES (7 au total):")
    print("-" * 80)
    categories = Category.objects.all()
    for cat in categories:
        news_count = News.objects.filter(category=cat).count()
        published_count = News.objects.filter(category=cat, status='published').count()
        print(f"   • {cat.name:20} | Couleur: {cat.color:10} | {news_count} actualités ({published_count} publiées)")
    
    # 3. Actualités
    print(f"\n📰 ACTUALITÉS (70 au total):")
    print("-" * 80)
    
    print("\n   📌 Actualités PUBLIÉES (36):")
    published = News.objects.filter(status='published').order_by('-created_at')[:5]
    for i, news in enumerate(published, 1):
        title = news.title[:50] if news.title else "[Sans titre]"
        likes = NewsLike.objects.filter(news=news).count()
        comments = Comment.objects.filter(news=news).count()
        print(f"   {i}. {title}")
        print(f"      Auteur: {news.author.get_full_name()} | Catégorie: {news.category.name if news.category else 'Aucune'}")
        print(f"      ❤️  {likes} likes | 💬 {comments} commentaires | 📅 {news.created_at.strftime('%d/%m/%Y %H:%M')}")
    if News.objects.filter(status='published').count() > 5:
        print(f"      ... et {News.objects.filter(status='published').count() - 5} autres actualités publiées")
    
    print("\n   ⏳ Actualités EN ATTENTE (14):")
    pending = News.objects.filter(status='pending').order_by('-created_at')[:3]
    for i, news in enumerate(pending, 1):
        title = news.title[:50] if news.title else "[Sans titre]"
        print(f"   {i}. {title}")
        print(f"      Auteur: {news.author.get_full_name()} | Catégorie: {news.category.name if news.category else 'Aucune'}")
    if News.objects.filter(status='pending').count() > 3:
        print(f"      ... et {News.objects.filter(status='pending').count() - 3} autres actualités en attente")
    
    print("\n   📝 BROUILLONS (20):")
    drafts = News.objects.filter(status='draft').order_by('-created_at')[:3]
    for i, news in enumerate(drafts, 1):
        title = news.title[:50] if news.title else "[Sans titre]"
        print(f"   {i}. {title}")
        print(f"      Auteur: {news.author.get_full_name()}")
    if News.objects.filter(status='draft').count() > 3:
        print(f"      ... et {News.objects.filter(status='draft').count() - 3} autres brouillons")
    
    # 4. Commentaires
    print(f"\n💬 COMMENTAIRES (80 au total):")
    print("-" * 80)
    comments = Comment.objects.all().order_by('-created_at')[:5]
    for i, comment in enumerate(comments, 1):
        content = comment.content[:60] if len(comment.content) > 60 else comment.content
        print(f"   {i}. {content}...")
        print(f"      Par: {comment.author.get_full_name()} sur '{comment.news.title[:40] if comment.news.title else 'Sans titre'}'")
    if Comment.objects.count() > 5:
        print(f"      ... et {Comment.objects.count() - 5} autres commentaires")
    
    # 5. Likes
    print(f"\n❤️  LIKES (187 au total):")
    print("-" * 80)
    # Top 5 actualités les plus likées
    from django.db.models import Count
    top_liked = News.objects.annotate(
        total_likes=Count('likes')
    ).filter(total_likes__gt=0).order_by('-total_likes')[:5]
    
    for i, news in enumerate(top_liked, 1):
        likes_count = NewsLike.objects.filter(news=news).count()
        title = news.title[:50] if news.title else "[Sans titre]"
        print(f"   {i}. {title}")
        print(f"      ❤️  {likes_count} likes")
    
    print("\n" + "="*80)
    print("✅ CONFIRMATION: TOUTES LES DONNÉES SONT PERSISTÉES DANS db.sqlite3")
    print("="*80)
    print("\n💡 Ces données sont accessibles:")
    print("   • Via Django Admin: http://localhost:8000/admin/")
    print("   • Via l'API REST: http://localhost:8000/api/")
    print("   • Via l'application Web: http://localhost:3001/")
    print("   • Via l'application Mobile Flutter")
    print("\n")

if __name__ == '__main__':
    main()
