from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
import json

from .models import Category, News

User = get_user_model()


class NewsAPITestCase(APITestCase):
    """Tests pour l'API des actualités"""
    
    def setUp(self):
        """Configuration des données de test"""
        # Créer des utilisateurs
        self.admin_user = User.objects.create_user(
            username='admin_test',
            email='admin@test.com',
            password='test123',
            role='admin'
        )
        
        self.student_user = User.objects.create_user(
            username='student_test',
            email='student@test.com',
            password='test123',
            role='student'
        )
        
        # Créer une catégorie
        self.category = Category.objects.create(
            name='Test Category',
            description='Test description',
            color='#007bff'
        )
        
        # Créer une actualité
        self.news = News.objects.create(
            title='Test News',
            content='Test content',
            author=self.admin_user,
            category=self.category,
            status='published',
            importance='medium'
        )
    
    def test_get_categories(self):
        """Test de récupération des catégories"""
        url = reverse('news:categories')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Category')
    
    def test_get_news_list(self):
        """Test de récupération de la liste des actualités"""
        url = reverse('news:news-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test News')
    
    def test_get_news_detail(self):
        """Test de récupération du détail d'une actualité"""
        url = reverse('news:news-detail', kwargs={'pk': self.news.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test News')
        self.assertEqual(response.data['content'], 'Test content')


class NewsModelTestCase(TestCase):
    """Tests pour les modèles"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='test123',
            role='student',
            university='UNIKIN',
            program='Informatique'
        )
        
        self.category = Category.objects.create(
            name='Test Category',
            description='Test description'
        )
    
    def test_user_creation(self):
        """Test de création d'utilisateur"""
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.role, 'student')
        self.assertEqual(self.user.university, 'UNIKIN')
    
    def test_category_creation(self):
        """Test de création de catégorie"""
        self.assertEqual(self.category.name, 'Test Category')
        self.assertTrue(self.category.is_active)
    
    def test_news_creation(self):
        """Test de création d'actualité"""
        news = News.objects.create(
            title='Test News',
            content='Test content',
            author=self.user,
            category=self.category,
            importance='high',
            target_universities=['UNIKIN', 'UPN']
        )
        
        self.assertEqual(news.title, 'Test News')
        self.assertEqual(news.author, self.user)
        self.assertEqual(news.category, self.category)
        self.assertEqual(news.status, 'draft')  # Statut par défaut
        self.assertEqual(news.importance, 'high')
        self.assertEqual(news.target_universities, ['UNIKIN', 'UPN'])
