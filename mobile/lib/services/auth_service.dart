import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../config/api_config_manager.dart';

class AuthService {
  // URL dynamique - utilisera ApiConfigManager en cas de problème de connexion
  // Sinon utilise l'URL statique pour les performances
  static const String baseUrl = 'http://192.168.1.198:8000/api';

  // Méthode pour basculer vers l'URL dynamique en cas d'échec
  Future<String> _getBaseUrl() async {
    // Essayer l'URL statique d'abord (plus rapide)
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/../admin/'))
          .timeout(const Duration(seconds: 1));
      if (response.statusCode < 500) {
        return baseUrl;
      }
    } catch (e) {
      // Si échec, utiliser la détection automatique
      print('🔄 URL statique inaccessible, détection automatique...');
      return await ApiConfigManager.getBaseUrl();
    }
    return baseUrl;
  }

  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final baseUrl = await _getBaseUrl();
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'username': username, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // Le backend retourne 'token' et 'user'
        if (data['token'] == null || data['user'] == null) {
          return {'success': false, 'error': 'Réponse du serveur invalide'};
        }

        // Sauvegarder le token et les données utilisateur
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', data['token']);
        await prefs.setString('user_data', jsonEncode(data['user']));

        return {
          'success': true,
          'user': User.fromJson(data['user']),
          'token': data['token'],
        };
      } else {
        try {
          final error = jsonDecode(response.body);
          return {
            'success': false,
            'error': error['error'] ?? error['detail'] ?? 'Erreur de connexion',
          };
        } catch (e) {
          return {
            'success': false,
            'error': 'Erreur de connexion (${response.statusCode})',
          };
        }
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> register({
    required String username,
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String university,
    required String program,
    String phoneNumber = '',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'email': email,
          'password': password,
          'first_name': firstName,
          'last_name': lastName,
          'university': university,
          'program': program,
          'phone_number': phoneNumber,
        }),
      );

      if (response.statusCode == 201) {
        return {'success': true};
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'error': error['error'] ?? 'Erreur d\'inscription',
        };
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> registerRbac({
    required String username,
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String phoneNumber = '',
    int? roleId,
    int? universiteId,
    int? faculteId,
    int? departementId,
    String? promotion,
  }) async {
    try {
      final body = <String, dynamic>{
        'username': username,
        'email': email,
        'password': password,
        'password_confirm': password, // Required by backend
        'first_name': firstName,
        'last_name': lastName,
        'phone_number': phoneNumber,
      };

      // Ajouter les données RBAC si disponibles
      if (roleId != null) body['nouveau_role'] = roleId;
      if (universiteId != null) body['universite'] = universiteId;
      if (faculteId != null) body['faculte'] = faculteId;
      if (departementId != null) body['departement'] = departementId;
      if (promotion != null) body['promotion'] = promotion;

      final response = await http.post(
        Uri.parse('$baseUrl/auth/register-extended/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        return {'success': true};
      } else {
        final error = jsonDecode(response.body);
        // Gérer les erreurs de validation
        String errorMessage = 'Erreur d\'inscription';
        if (error is Map) {
          if (error['error'] != null) {
            errorMessage = error['error'];
          } else if (error['detail'] != null) {
            errorMessage = error['detail'];
          } else {
            // Erreurs de validation par champ
            final errors = <String>[];
            error.forEach((key, value) {
              if (value is List && value.isNotEmpty) {
                errors.add('$key: ${value[0]}');
              } else if (value is String) {
                errors.add('$key: $value');
              }
            });
            if (errors.isNotEmpty) {
              errorMessage = errors.join('\n');
            }
          }
        }
        return {'success': false, 'error': errorMessage};
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token') != null;
  }

  Future<User?> getSavedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('user_data');
    if (userData != null) {
      try {
        return User.fromJson(jsonDecode(userData));
      } catch (e) {
        // Si les données utilisateur sont corrompues, on les supprime
        await prefs.remove('user_data');
        return null;
      }
    }
    return null;
  }

  Future<User?> getUserProfile() async {
    try {
      final token = await getAccessToken();
      if (token == null) return null;

      final response = await http.get(
        Uri.parse('$baseUrl/auth/profile/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return User.fromJson(data);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<Map<String, dynamic>> updateProfile({
    String? firstName,
    String? lastName,
    String? email,
    String? university,
    String? program,
    String? phoneNumber,
  }) async {
    try {
      final token = await getAccessToken();
      if (token == null) {
        return {'success': false, 'error': 'Non connecté'};
      }

      final response = await http.put(
        Uri.parse('$baseUrl/auth/profile/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
        body: jsonEncode({
          if (firstName != null) 'first_name': firstName,
          if (lastName != null) 'last_name': lastName,
          if (email != null) 'email': email,
          if (university != null) 'university': university,
          if (program != null) 'program': program,
          if (phoneNumber != null) 'phone_number': phoneNumber,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Mettre à jour les données utilisateur sauvegardées
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user_data', jsonEncode(data));
        return {'success': true, 'user': User.fromJson(data)};
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'error': error['error'] ?? 'Erreur de mise à jour',
        };
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<Map<String, dynamic>> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      final token = await getAccessToken();
      if (token == null) {
        return {'success': false, 'error': 'Non connecté'};
      }

      final response = await http.put(
        Uri.parse('$baseUrl/auth/change-password/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $token',
        },
        body: jsonEncode({
          'current_password': currentPassword,
          'new_password': newPassword,
        }),
      );

      if (response.statusCode == 200) {
        return {'success': true};
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'error': error['error'] ?? 'Erreur de changement de mot de passe',
        };
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur de réseau: $e'};
    }
  }

  Future<String?> getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<String?> getToken() async {
    return await getAccessToken();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('refresh_token');
    await prefs.remove('user_data');
  }
}
