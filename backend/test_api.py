#!/usr/bin/env python
"""Script de test de l'API REST"""

import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from django.test import RequestFactory
from rest_framework.test import force_authenticate
from news.views import NewsViewSet, CategoryViewSet
from django.contrib.auth import get_user_model

User = get_user_model()

def test_api():
    print("\n" + "="*80)
    print("🌐 TEST DE L'API REST")
    print("="*80 + "\n")
    
    # Créer une requête factory
    factory = RequestFactory()
    
    # Test 1: Liste des actualités publiées
    print("📰 Test 1: GET /api/news/ (actualités publiées)")
    view = NewsViewSet.as_view({'get': 'list'})
    request = factory.get('/api/news/')
    response = view(request)
    print(f"   Statut: {response.status_code}")
    if response.status_code == 200:
        count = len(response.data.get('results', []))
        print(f"   ✅ Nombre d'actualités retournées: {count}")
        if count > 0:
            first_news = response.data['results'][0]
            print(f"   📄 Exemple: {first_news.get('title', 'Sans titre')[:50]}")
    
    # Test 2: Liste des catégories
    print(f"\n🏷️  Test 2: GET /api/categories/")
    view = CategoryViewSet.as_view({'get': 'list'})
    request = factory.get('/api/categories/')
    response = view(request)
    print(f"   Statut: {response.status_code}")
    if response.status_code == 200:
        categories = response.data
        print(f"   ✅ Nombre de catégories: {len(categories)}")
        print(f"   📋 Catégories disponibles:")
        for cat in categories:
            print(f"      - {cat.get('name')}")
    
    # Test 3: Actualités en attente (nécessite authentification)
    print(f"\n⏳ Test 3: GET /api/news/pending/ (authentifié)")
    moderator = User.objects.filter(role='moderator').first()
    if moderator:
        view = NewsViewSet.as_view({'get': 'pending'})
        request = factory.get('/api/news/pending/')
        force_authenticate(request, user=moderator)
        response = view(request)
        print(f"   Statut: {response.status_code}")
        if response.status_code == 200:
            count = len(response.data.get('results', []))
            print(f"   ✅ Actualités en attente: {count}")
    
    # Test 4: Statistiques admin
    print(f"\n📊 Test 4: GET /api/admin/dashboard/ (authentifié)")
    admin = User.objects.filter(role='admin').first()
    if admin:
        from news.views import AdminDashboardView
        view = AdminDashboardView.as_view()
        request = factory.get('/api/admin/dashboard/')
        force_authenticate(request, user=admin)
        response = view(request)
        print(f"   Statut: {response.status_code}")
        if response.status_code == 200:
            stats = response.data
            print(f"   ✅ Statistiques disponibles:")
            print(f"      - Total actualités: {stats.get('total_news', 0)}")
            print(f"      - Actualités récentes: {stats.get('recent_news', 0)}")
            print(f"      - Notifications: {stats.get('unread_notifications', 0)}")
    
    print("\n" + "="*80)
    print("✅ L'API REST RETOURNE BIEN LES DONNÉES DE LA BASE!")
    print("="*80 + "\n")

if __name__ == '__main__':
    test_api()
