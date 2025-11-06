import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/news.dart';
import '../models/category.dart';

class NewsService {
  static const String baseUrl = 'http://10.0.2.2:8000/api';

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<Map<String, dynamic>> getNews({
    String? search,
    String? category,
    int? categoryId,
    String? importance,
    String? university,
    String? status,
    int? page,
    int? limit,
    bool showPending = false,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non connecté'};
      }

      final queryParams = <String, String>{};
      if (search != null) queryParams['search'] = search;
      if (category != null) queryParams['category'] = category;
      if (categoryId != null) queryParams['category'] = categoryId.toString();
      if (importance != null) queryParams['importance'] = importance;
      if (university != null) queryParams['university'] = university;
      if (status != null) queryParams['status'] = status;
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();

      final uri = Uri.parse(
        '$baseUrl/news/',
      ).replace(queryParameters: queryParams);
      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> newsData = data['results'] ?? [];
        final List<News> newsList = newsData
            .map((json) => News.fromJson(json))
            .toList();

        return {
          'success': true,
          'news': newsList,
          'count': data['count'] ?? 0,
          'next': data['next'],
        };
      } else {
        return {
          'success': false,
          'error': 'Erreur de chargement des actualités',
        };
      }
    } catch (e) {
      print("NewsService: Error getNews - $e");
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> getNewsById(int id) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non connecté'};
      }

      final response = await http.get(
        Uri.parse('$baseUrl/news-api/$id/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final news = News.fromJson(data);
        return {'success': true, 'news': news};
      } else {
        return {
          'success': false,
          'error': 'Erreur de chargement de l\'actualité',
        };
      }
    } catch (e) {
      print("NewsService: Error getNewsById - $e");
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> createNews({
    required String title,
    required String content,
    required int categoryId,
    String? imageUrl,
    String? importance,
    String? program,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'Non authentifié'};
      }

      final body = {
        'draft_title': title,
        'draft_content': content,
        'category': categoryId,
        'importance': importance ?? 'medium',
        'programme_ou_formation': program ?? '',
        'target_universities': <String>[],
        'target_programs': <String>[],
        if (imageUrl != null && imageUrl.isNotEmpty) 'image': imageUrl,
      };

      final response = await http.post(
        Uri.parse('$baseUrl/news-api/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return {
          'success': true,
          'message': 'Actualité créée avec succès et envoyée en modération',
          'news': jsonDecode(response.body),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['detail'] ?? 'Erreur lors de la création',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Erreur réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> updateNews(
    int id,
    Map<String, dynamic> newsData,
  ) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'Non authentifié'};
      }

      final response = await http.put(
        Uri.parse('$baseUrl/news-api/$id/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
        body: jsonEncode(newsData),
      );

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': 'Actualité modifiée avec succès',
          'news': jsonDecode(response.body),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['detail'] ?? 'Erreur lors de la modification',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Erreur réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> deleteNews(int id) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'Non authentifié'};
      }

      final response = await http.delete(
        Uri.parse('$baseUrl/news-api/$id/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 204 || response.statusCode == 200) {
        return {'success': true, 'message': 'Actualité supprimée avec succès'};
      } else {
        return {'success': false, 'message': 'Erreur lors de la suppression'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Erreur réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> moderateNews({
    required int newsId,
    required String action,
    String? reason,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'Non authentifié'};
      }

      // action peut être 'approve' ou 'reject'
      final body = action == 'approve'
          ? {'comment': reason ?? ''}
          : {'reason': reason ?? ''};

      final response = await http.post(
        Uri.parse('$baseUrl/news-api/$newsId/$action/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'message': data['message'] ?? 'Modération appliquée avec succès',
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message':
              error['error'] ??
              error['detail'] ??
              'Erreur lors de la modération',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Erreur réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> getPendingNews() async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non connecté'};
      }

      // Utiliser l'endpoint dédié pour les news en attente
      final response = await http.get(
        Uri.parse('$baseUrl/news-api/pending/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // L'endpoint /pending/ retourne directement un tableau
        final List<dynamic> newsData = data is List
            ? data
            : (data['results'] ?? []);
        final List<News> newsList = newsData
            .map((json) => News.fromJson(json))
            .toList();

        return {'success': true, 'news': newsList, 'count': newsList.length};
      } else {
        return {
          'success': false,
          'error': 'Erreur de chargement des actualités en attente',
        };
      }
    } catch (e) {
      print("NewsService: Error getPendingNews - $e");
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> getCategories() async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non connecté'};
      }

      final response = await http.get(
        Uri.parse('$baseUrl/categories/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> categoriesData = data['results'] ?? [];
        final List<Category> categories = categoriesData
            .map((json) => Category.fromJson(json))
            .toList();

        return {'success': true, 'categories': categories};
      } else {
        return {
          'success': false,
          'error': 'Erreur de chargement des catégories',
        };
      }
    } catch (e) {
      print("NewsService: Error getCategories - $e");
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> toggleLike(int newsId, bool isLiked) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non connecté'};
      }

      print("NewsService: toggleLike $newsId - currently liked: $isLiked");

      final uri = Uri.parse('$baseUrl/news/$newsId/like/');
      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Token $token',
      };

      // Si déjà liké, on retire le like (DELETE), sinon on ajoute (POST)
      final response = isLiked
          ? await http.delete(uri, headers: headers)
          : await http.post(uri, headers: headers);

      print("NewsService: toggleLike response status - ${response.statusCode}");

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print("NewsService: toggleLike response data - $data");

        return {
          'success': true,
          'liked': data['liked'] ?? !isLiked,
          'likes_count': data['likes_count'],
        };
      } else {
        print("NewsService: toggleLike failed - ${response.body}");
        return {'success': false, 'error': 'Erreur serveur'};
      }
    } catch (e) {
      print("NewsService: Error toggleLike - $e");
      return {'success': false, 'error': 'Erreur lors du like: $e'};
    }
  }

  Future<Map<String, dynamic>> getMyNews() async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non connecté'};
      }

      final response = await http.get(
        Uri.parse('$baseUrl/news/my/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> newsData = data['results'] ?? [];
        final List<News> newsList = newsData
            .map((json) => News.fromJson(json))
            .toList();

        return {'success': true, 'news': newsList, 'count': data['count'] ?? 0};
      } else {
        return {
          'success': false,
          'error': 'Erreur de chargement de vos actualités',
        };
      }
    } catch (e) {
      print("NewsService: Error getMyNews - $e");
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'error': 'Non connecté'};
      }

      final response = await http.get(
        Uri.parse('$baseUrl/dashboard/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {'success': true, 'stats': data};
      } else {
        return {
          'success': false,
          'error': 'Erreur de chargement des statistiques',
        };
      }
    } catch (e) {
      print("NewsService: Error getDashboardStats - $e");
      return {
        'success': false,
        'error': 'Erreur de réseau: $e',
        'stats': {
          'totalNews': 0,
          'pendingNews': 0,
          'approvedNews': 0,
          'rejectedNews': 0,
        },
      };
    }
  }

  Future<List<News>> fetchNews({
    String? search,
    String? category,
    int? categoryId,
    String? importance,
    String? university,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final result = await getNews(
        search: search,
        category: category,
        categoryId: categoryId,
        importance: importance,
        university: university,
        page: page,
        limit: limit,
      );

      if (result['success'] == true) {
        return result['news'] as List<News>;
      }
      return [];
    } catch (e) {
      print("NewsService: Error fetchNews - $e");
      return [];
    }
  }

  Future<List<Category>> fetchCategories() async {
    try {
      final result = await getCategories();
      if (result['success'] == true) {
        return result['categories'] as List<Category>;
      }
      return [];
    } catch (e) {
      print("NewsService: Error fetchCategories - $e");
      return [];
    }
  }
}
