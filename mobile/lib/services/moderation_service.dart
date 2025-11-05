/// Service API pour la modération des news
/// Gestion des actions de modération, approbation, rejet et invalidation
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/news_extended.dart';
import '../config/api_config.dart';

class ModerationService {
  final String baseUrl;
  String? _token;

  ModerationService({String? baseUrl}) : baseUrl = baseUrl ?? ApiConfig.baseUrl;

  /// Définir le token d'authentification
  void setToken(String token) {
    _token = token;
  }

  /// Headers avec authentification
  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Token $_token',
  };

  /// Récupérer les news en attente de modération
  Future<List<NewsExtended>> getPendingNews() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/news-api/pending/'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
        return data.map((json) => NewsExtended.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors du chargement des news en attente');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Récupérer les news créées par l'utilisateur
  Future<List<NewsExtended>> getMyNews() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/news-api/my_news/'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
        return data.map((json) => NewsExtended.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors du chargement de vos news');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Récupérer toutes les news avec filtres
  Future<List<NewsExtended>> getAllNews({
    String? status,
    String? importance,
    String? program,
    int? page,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (status != null) queryParams['status'] = status;
      if (importance != null) queryParams['importance'] = importance;
      if (program != null) queryParams['program'] = program;
      if (page != null) queryParams['page'] = page.toString();

      final uri = Uri.parse(
        '$baseUrl/api/news-api/',
      ).replace(queryParameters: queryParams.isNotEmpty ? queryParams : null);

      final response = await http.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
        return data.map((json) => NewsExtended.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors du chargement des news');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Récupérer une news par ID
  Future<NewsExtended> getNewsById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/news-api/$id/'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        return NewsExtended.fromJson(
          json.decode(utf8.decode(response.bodyBytes)),
        );
      } else {
        throw Exception('Erreur lors du chargement de la news');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Modérer une news (avec modifications du contenu)
  Future<NewsExtended> moderateNews({
    required int newsId,
    required String finalTitle,
    required String finalContent,
    required bool moderatorApproved,
    String? moderationComment,
  }) async {
    try {
      final body = json.encode({
        'final_title': finalTitle,
        'final_content': finalContent,
        'moderator_approved': moderatorApproved,
        'moderation_comment': moderationComment ?? '',
      });

      final response = await http.post(
        Uri.parse('$baseUrl/api/news-api/$newsId/moderate/'),
        headers: _headers,
        body: body,
      );

      if (response.statusCode == 200) {
        return NewsExtended.fromJson(
          json.decode(utf8.decode(response.bodyBytes)),
        );
      } else {
        final error = json.decode(utf8.decode(response.bodyBytes));
        throw Exception(error['error'] ?? 'Erreur lors de la modération');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Approuver rapidement une news sans modifications
  Future<Map<String, dynamic>> approveNews(
    int newsId, {
    String? comment,
  }) async {
    try {
      final body = json.encode({'comment': comment ?? 'Approuvé'});

      final response = await http.post(
        Uri.parse('$baseUrl/api/news-api/$newsId/approve/'),
        headers: _headers,
        body: body,
      );

      if (response.statusCode == 200) {
        return json.decode(utf8.decode(response.bodyBytes));
      } else {
        final error = json.decode(utf8.decode(response.bodyBytes));
        throw Exception(error['error'] ?? 'Erreur lors de l\'approbation');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Rejeter une news avec une raison
  Future<Map<String, dynamic>> rejectNews(int newsId, String reason) async {
    try {
      if (reason.trim().isEmpty) {
        throw Exception('La raison du rejet est obligatoire');
      }

      final body = json.encode({'reason': reason});

      final response = await http.post(
        Uri.parse('$baseUrl/api/news-api/$newsId/reject/'),
        headers: _headers,
        body: body,
      );

      if (response.statusCode == 200) {
        return json.decode(utf8.decode(response.bodyBytes));
      } else {
        final error = json.decode(utf8.decode(response.bodyBytes));
        throw Exception(error['error'] ?? 'Erreur lors du rejet');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Invalider une news publiée (administrateurs uniquement)
  Future<Map<String, dynamic>> invalidateNews(
    int newsId,
    String invalidationReason,
  ) async {
    try {
      if (invalidationReason.trim().isEmpty) {
        throw Exception('La motivation de l\'invalidation est obligatoire');
      }

      final body = json.encode({
        'admin_invalidation_reason': invalidationReason,
      });

      final response = await http.post(
        Uri.parse('$baseUrl/api/news-api/$newsId/invalidate/'),
        headers: _headers,
        body: body,
      );

      if (response.statusCode == 200) {
        return json.decode(utf8.decode(response.bodyBytes));
      } else {
        final error = json.decode(utf8.decode(response.bodyBytes));
        throw Exception(error['error'] ?? 'Erreur lors de l\'invalidation');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Filtrer les news par importance
  Future<List<NewsExtended>> getNewsByImportance(String importance) async {
    try {
      final response = await http.get(
        Uri.parse(
          '$baseUrl/api/news-api/by_importance/?importance=$importance',
        ),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
        return data.map((json) => NewsExtended.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors du filtrage par importance');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Filtrer les news par programme
  Future<List<NewsExtended>> getNewsByProgram(String program) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/news-api/by_program/?program=$program'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
        return data.map((json) => NewsExtended.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors du filtrage par programme');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }

  /// Créer une nouvelle news
  Future<NewsExtended> createNews({
    required String programmeOuFormation,
    required String draftTitle,
    required String draftContent,
    required int category,
    required String importance,
    required DateTime desiredPublishStart,
    DateTime? desiredPublishEnd,
    DateTime? expiryDate,
    String? imagePath,
    String? attachmentPath,
  }) async {
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/news-api/'),
      );

      // Headers
      request.headers.addAll(_headers);

      // Champs obligatoires
      request.fields['programme_ou_formation'] = programmeOuFormation;
      request.fields['draft_title'] = draftTitle;
      request.fields['draft_content'] = draftContent;
      request.fields['category'] = category.toString();
      request.fields['importance'] = importance;
      request.fields['desired_publish_start'] = desiredPublishStart
          .toIso8601String();

      // Champs optionnels
      if (desiredPublishEnd != null) {
        request.fields['desired_publish_end'] = desiredPublishEnd
            .toIso8601String();
      }
      if (expiryDate != null) {
        request.fields['expiry_date'] = expiryDate.toIso8601String();
      }

      // Fichiers
      if (imagePath != null) {
        request.files.add(
          await http.MultipartFile.fromPath('image', imagePath),
        );
      }
      if (attachmentPath != null) {
        request.files.add(
          await http.MultipartFile.fromPath('attachment', attachmentPath),
        );
      }

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return NewsExtended.fromJson(
          json.decode(utf8.decode(response.bodyBytes)),
        );
      } else {
        final error = json.decode(utf8.decode(response.bodyBytes));
        throw Exception(error['error'] ?? 'Erreur lors de la création');
      }
    } catch (e) {
      throw Exception('Erreur réseau: $e');
    }
  }
}
