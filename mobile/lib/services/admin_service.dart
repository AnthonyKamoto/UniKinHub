import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class AdminService {
  static const String baseUrl = 'http://10.0.2.2:8000';

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non authentifié'};
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/admin/dashboard-stats/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return {
          'total_users': 0,
          'total_news': 0,
          'pending_news': 0,
          'active_categories': 0,
          'popular_categories': [],
          'total_views': 0,
          'total_likes': 0,
          'total_comments': 0,
        };
      }
    } catch (e) {
      return {
        'total_users': 0,
        'total_news': 0,
        'pending_news': 0,
        'active_categories': 0,
        'popular_categories': [],
      };
    }
  }

  Future<List<User>> getAllUsers() async {
    try {
      final token = await _getToken();
      if (token == null) {
        return [];
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/admin/users/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => User.fromJson(json)).toList();
      } else {
        return [];
      }
    } catch (e) {
      print('Error loading users: $e');
      return [];
    }
  }

  Future<List<dynamic>> getAllNews() async {
    try {
      final token = await _getToken();
      if (token == null) {
        return [];
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/news-api/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['results'] ?? [];
      } else {
        return [];
      }
    } catch (e) {
      print('Error loading news: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>> updateUser(
    int userId,
    Map<String, dynamic> data,
  ) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non authentifié'};
      }

      final response = await http.patch(
        Uri.parse('$baseUrl/api/admin/users/$userId/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
        body: jsonEncode(data),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Utilisateur mis à jour'};
      } else {
        return {'success': false, 'error': 'Erreur de mise à jour'};
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> deleteNews(int newsId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non authentifié'};
      }

      final response = await http.delete(
        Uri.parse('$baseUrl/api/news-api/$newsId/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 204 || response.statusCode == 200) {
        return {'success': true, 'message': 'Actualité supprimée'};
      } else {
        return {'success': false, 'error': 'Erreur de suppression'};
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur réseau: $e'};
    }
  }
}
