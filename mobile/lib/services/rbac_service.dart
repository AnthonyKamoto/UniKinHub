import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/rbac_models.dart';

class RbacService {
  static const String baseUrl = 'http://192.168.1.198:8000/api';

  static Map<String, String> _getHeaders(String? token) {
    Map<String, String> headers = {'Content-Type': 'application/json'};

    if (token != null) {
      headers['Authorization'] = 'Token $token';
    }

    return headers;
  }

  // Récupération du token
  static Future<List<Role>> getRoles({String? token}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/roles/'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final decodedBody = json.decode(response.body);

        // Gérer les deux formats: liste simple ou paginé
        List<dynamic> data;
        if (decodedBody is List) {
          data = decodedBody;
        } else if (decodedBody is Map && decodedBody.containsKey('results')) {
          data = decodedBody['results'] as List<dynamic>;
        } else {
          throw Exception('Format de réponse inattendu');
        }

        return data
            .map((json) => Role.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw Exception(
          'Erreur lors de la récupération des rôles: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer un rôle par ID
  static Future<Role> getRoleById(int id, {String? token}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/roles/$id/'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return Role.fromJson(json.decode(response.body));
      } else {
        throw Exception(
          'Erreur lors de la récupération du rôle: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer toutes les universités
  static Future<List<Universite>> getUniversites({String? token}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/universites/'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final decodedBody = json.decode(response.body);

        // Gérer les deux formats
        List<dynamic> data;
        if (decodedBody is List) {
          data = decodedBody;
        } else if (decodedBody is Map && decodedBody.containsKey('results')) {
          data = decodedBody['results'] as List<dynamic>;
        } else {
          throw Exception('Format de réponse inattendu');
        }

        return data
            .map((json) => Universite.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw Exception(
          'Erreur lors de la récupération des universités: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer une université par ID
  static Future<Universite> getUniversiteById(int id, {String? token}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/universites/$id/'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return Universite.fromJson(json.decode(response.body));
      } else {
        throw Exception(
          'Erreur lors de la récupération de l\'université: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer les facultés d'une université
  static Future<List<Faculte>> getFacultesByUniversite(
    int universiteId, {
    String? token,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/facultes/?universite=$universiteId'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final decodedBody = json.decode(response.body);

        List<dynamic> data;
        if (decodedBody is List) {
          data = decodedBody;
        } else if (decodedBody is Map && decodedBody.containsKey('results')) {
          data = decodedBody['results'] as List<dynamic>;
        } else {
          throw Exception('Format de réponse inattendu');
        }

        return data
            .map((json) => Faculte.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw Exception(
          'Erreur lors de la récupération des facultés: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer une faculté par ID
  static Future<Faculte> getFaculteById(int id, {String? token}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/facultes/$id/'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return Faculte.fromJson(json.decode(response.body));
      } else {
        throw Exception(
          'Erreur lors de la récupération de la faculté: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer les départements d'une faculté
  static Future<List<Departement>> getDepartementsByFaculte(
    int faculteId, {
    String? token,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/departements/?faculte=$faculteId'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final decodedBody = json.decode(response.body);

        List<dynamic> data;
        if (decodedBody is List) {
          data = decodedBody;
        } else if (decodedBody is Map && decodedBody.containsKey('results')) {
          data = decodedBody['results'] as List<dynamic>;
        } else {
          throw Exception('Format de réponse inattendu');
        }

        return data
            .map((json) => Departement.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw Exception(
          'Erreur lors de la récupération des départements: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer un département par ID
  static Future<Departement> getDepartementById(int id, {String? token}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/departements/$id/'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return Departement.fromJson(json.decode(response.body));
      } else {
        throw Exception(
          'Erreur lors de la récupération du département: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer les statistiques d'organisation
  static Future<OrganisationStats> getOrganisationStats({String? token}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/organisation-stats/'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return OrganisationStats.fromJson(json.decode(response.body));
      } else {
        throw Exception(
          'Erreur lors de la récupération des statistiques: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Vérifier si un utilisateur a une permission spécifique
  static Future<bool> hasPermission(String permission, {String? token}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/check-permission/?permission=$permission'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['has_permission'] ?? false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  // Soumettre une demande de vérification d'utilisateur
  static Future<bool> submitVerificationRequest({
    required String token,
    required String documentPath,
    String? promotion,
  }) async {
    try {
      final body = {
        'document': documentPath,
        if (promotion != null) 'promotion': promotion,
      };

      final response = await http.post(
        Uri.parse('$baseUrl/submit-verification/'),
        headers: _getHeaders(token),
        body: json.encode(body),
      );

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  // Mettre à jour le profil RBAC d'un utilisateur
  static Future<bool> updateUserRbacProfile({
    required String token,
    int? roleId,
    int? universiteId,
    int? faculteId,
    int? departementId,
    String? promotion,
  }) async {
    try {
      final body = <String, dynamic>{};

      if (roleId != null) body['nouveau_role'] = roleId;
      if (universiteId != null) body['universite'] = universiteId;
      if (faculteId != null) body['faculte'] = faculteId;
      if (departementId != null) body['departement'] = departementId;
      if (promotion != null) body['promotion'] = promotion;

      final response = await http.patch(
        Uri.parse('$baseUrl/user-profile/'),
        headers: _getHeaders(token),
        body: json.encode(body),
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  // Récupérer les utilisateurs à vérifier (pour admin/modérateurs)
  static Future<List<UserVerificationData>> getPendingVerifications({
    String? token,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/pending-verifications/'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body) as List<dynamic>;
        return data
            .map(
              (json) =>
                  UserVerificationData.fromJson(json as Map<String, dynamic>),
            )
            .toList();
      } else {
        throw Exception(
          'Erreur lors de la récupération des vérifications: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Approuver/Rejeter une vérification d'utilisateur
  static Future<bool> processVerification({
    required String token,
    required int userId,
    required bool approved,
    String? reason,
  }) async {
    try {
      final body = {'approved': approved, if (reason != null) 'reason': reason};

      final response = await http.post(
        Uri.parse('$baseUrl/process-verification/$userId/'),
        headers: _getHeaders(token),
        body: json.encode(body),
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
