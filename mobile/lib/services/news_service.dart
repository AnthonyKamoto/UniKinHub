import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/news.dart';
import '../models/category.dart';

class NewsService {
  static const String baseUrl = 'http://192.168.1.198:8000/api';

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
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
    print("NewsService: Mock getNewsById $id");
    return {'success': true, 'news': null};
  }

  Future<Map<String, dynamic>> createNews({
    required String title,
    required String content,
    required int categoryId,
    String? imageUrl,
    String? importance,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'Non authentifié'};
      }

      final body = {
        'title': title,
        'content': content,
        'category': categoryId,
        'importance': importance ?? 'medium',
        'target_universities': <String>[],
        'target_programs': <String>[],
      };

      final response = await http.post(
        Uri.parse('$baseUrl/news/create/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return {
          'success': true,
          'message': 'Actualité créée avec succès',
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
    print("NewsService: Mock updateNews $id");
    return {'success': true};
  }

  Future<Map<String, dynamic>> deleteNews(int id) async {
    print("NewsService: Mock deleteNews $id");
    return {'success': true};
  }

  Future<Map<String, dynamic>> moderateNews({
    required int newsId,
    required String action,
    String? reason,
  }) async {
    print("NewsService: Mock moderateNews $newsId - $action");
    return {'success': true, 'message': 'Modération appliquée'};
  }

  Future<Map<String, dynamic>> getPendingNews() async {
    print("NewsService: Mock getPendingNews");
    return {'success': true, 'news': <News>[]};
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
    print("NewsService: Mock getMyNews");
    return {'success': true, 'news': <News>[]};
  }

  Future<Map<String, dynamic>> getDashboardStats() async {
    print("NewsService: Mock getDashboardStats");
    return {
      'success': true,
      'stats': {
        'totalNews': 0,
        'pendingNews': 0,
        'approvedNews': 0,
        'rejectedNews': 0,
      },
    };
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
    print("NewsService: Mock fetchNews");
    return [];
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
