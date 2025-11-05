import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

/// Configuration de l'API pour l'application mobile
///
/// Choisissez l'URL appropriée selon votre environnement :
/// - Émulateur Android : http://10.0.2.2:8000
/// - Appareil physique (même réseau) : http://192.168.X.X:8000
/// - iOS Simulator : http://127.0.0.1:8000 ou http://localhost:8000

class ApiConfig {
  // URL de base de l'API
  // Utilise l'adresse IP réelle du PC pour fonctionner sur émulateur ET appareil physique

  /// Adresse IP du PC (fonctionne pour émulateur Android et appareil physique)
  static const String baseUrl = 'http://192.168.1.198:8000/api';

  /// Alternatives (commentées) :
  // static const String baseUrl = 'http://10.0.2.2:8000/api';      // Émulateur Android uniquement
  // static const String baseUrl = 'http://127.0.0.1:8000/api';     // iOS Simulator

  // Timeout des requêtes HTTP (en secondes)
  static const Duration timeout = Duration(seconds: 30);

  // Headers par défaut
  static Map<String, String> get defaultHeaders => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Obtenir les headers avec le token d'authentification
  static Future<Map<String, String>> getAuthHeaders() async {
    final headers = Map<String, String>.from(defaultHeaders);

    // Ajouter le token si disponible
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    } catch (e) {
      print('❌ Erreur lors de la récupération du token: $e');
    }

    return headers;
  }

  // Méthode pour tester la connexion au serveur
  static Future<bool> testConnection() async {
    try {
      final response = await http
          .get(Uri.parse(baseUrl.replaceAll('/api', '/admin/login/')))
          .timeout(timeout);

      return response.statusCode == 200 || response.statusCode == 302;
    } catch (e) {
      print('❌ Impossible de se connecter au serveur: $e');
      return false;
    }
  }

  // Obtenir le token d'authentification
  static Future<String?> getAuthToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString('auth_token');
    } catch (e) {
      print('❌ Erreur lors de la récupération du token: $e');
      return null;
    }
  }

  // Afficher les informations de configuration
  static void printConfig() {
    print('📡 Configuration API:');
    print('   URL: $baseUrl');
    print('   Timeout: ${timeout.inSeconds}s');
  }
}
