import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/models/news.dart';
import 'package:mobile/models/category.dart';
import 'package:mobile/models/user.dart';

void main() {
  group('Models Tests', () {
    test('News model should parse JSON correctly', () {
      final json = {
        'id': 1,
        'title': 'Test News',
        'content': 'Test content',
        'author': 1,
        'author_name': 'Test Author',
        'category': 1,
        'category_name': 'Test Category',
        'category_color': '#007bff',
        'status': 'published',
        'importance': 'medium',
        'created_at': '2025-10-21T10:00:00Z',
        'updated_at': '2025-10-21T10:00:00Z',
        'target_universities': ['UNIKIN'],
        'target_programs': ['Informatique'],
        'views_count': 10,
        'likes_count': 5,
        'is_liked': false,
        'time_since': '2 heures',
      };

      final news = News.fromJson(json);

      expect(news.id, 1);
      expect(news.title, 'Test News');
      expect(news.authorName, 'Test Author');
      expect(news.categoryName, 'Test Category');
      expect(news.importance, 'medium');
      expect(news.targetUniversities, ['UNIKIN']);
      expect(news.viewsCount, 10);
      expect(news.likesCount, 5);
      expect(news.isLiked, false);
    });

    test('Category model should parse JSON correctly', () {
      final json = {
        'id': 1,
        'name': 'Test Category',
        'description': 'Test description',
        'color': '#007bff',
        'is_active': true,
        'news_count': 5,
      };

      final category = Category.fromJson(json);

      expect(category.id, 1);
      expect(category.name, 'Test Category');
      expect(category.description, 'Test description');
      expect(category.color, '#007bff');
      expect(category.isActive, true);
      expect(category.newsCount, 5);
    });

    test('User model should parse JSON correctly', () {
      final json = {
        'id': 1,
        'username': 'testuser',
        'email': 'test@example.com',
        'first_name': 'Test',
        'last_name': 'User',
        'role': 'student',
        'university': 'UNIKIN',
        'program': 'Informatique',
        'phone_number': '+243123456789',
        'is_verified': true,
        'date_joined': '2025-10-21T10:00:00Z',
      };

      final user = User.fromJson(json);

      expect(user.id, 1);
      expect(user.username, 'testuser');
      expect(user.email, 'test@example.com');
      expect(user.fullName, 'Test User');
      expect(user.role, 'student');
      expect(user.roleDisplay, 'Étudiant');
      expect(user.university, 'UNIKIN');
      expect(user.isVerified, true);
    });

    test('News importance display should work correctly', () {
      final newsLow = News.fromJson({
        'id': 1,
        'title': 'Test',
        'content': 'Test',
        'author': 1,
        'author_name': 'Author',
        'category': 1,
        'category_name': 'Category',
        'category_color': '#007bff',
        'status': 'published',
        'importance': 'low',
        'created_at': '2025-10-21T10:00:00Z',
        'updated_at': '2025-10-21T10:00:00Z',
      });

      final newsUrgent = News.fromJson({
        'id': 2,
        'title': 'Test',
        'content': 'Test',
        'author': 1,
        'author_name': 'Author',
        'category': 1,
        'category_name': 'Category',
        'category_color': '#007bff',
        'status': 'published',
        'importance': 'urgent',
        'created_at': '2025-10-21T10:00:00Z',
        'updated_at': '2025-10-21T10:00:00Z',
      });

      expect(newsLow.importanceDisplay, 'Faible');
      expect(newsUrgent.importanceDisplay, 'Urgent');
    });

    test('User role display should work correctly', () {
      final admin = User.fromJson({
        'id': 1,
        'username': 'admin',
        'email': 'admin@example.com',
        'first_name': 'Admin',
        'last_name': 'User',
        'role': 'admin',
        'university': 'UNIKIN',
        'program': 'Administration',
        'phone_number': '',
        'is_verified': true,
        'date_joined': '2025-10-21T10:00:00Z',
      });

      final student = User.fromJson({
        'id': 2,
        'username': 'student',
        'email': 'student@example.com',
        'first_name': 'Student',
        'last_name': 'User',
        'role': 'student',
        'university': 'UNIKIN',
        'program': 'Informatique',
        'phone_number': '',
        'is_verified': false,
        'date_joined': '2025-10-21T10:00:00Z',
      });

      expect(admin.roleDisplay, 'Administrateur');
      expect(student.roleDisplay, 'Étudiant');
    });
  });
}
