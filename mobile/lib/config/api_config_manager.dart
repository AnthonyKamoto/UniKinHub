import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';

/// Gestionnaire dynamique de configuration API
/// Détecte automatiquement l'adresse IP du backend
class ApiConfigManager {
  static const String _preferenceKey = 'backend_url';
  static const int _port = 8000;

  // Liste des adresses à tester (par ordre de priorité)
  static final List<String> _candidateAddresses = [
    '127.0.0.1', // Localhost (développement)
    '10.0.2.2', // Émulateur Android
    '192.168.1.198', // Réseau local (appareil physique)
    'localhost', // Alternative locale
  ];

  // Cache de l'URL détectée
  static String? _cachedBaseUrl;

  /// Obtenir l'URL de base de l'API (avec détection automatique si nécessaire)
  static Future<String> getBaseUrl() async {
    // Si déjà en cache, retourner directement
    if (_cachedBaseUrl != null) {
      return _cachedBaseUrl!;
    }

    // Vérifier si une URL est sauvegardée
    final prefs = await SharedPreferences.getInstance();
    final savedUrl = prefs.getString(_preferenceKey);

    if (savedUrl != null) {
      // Vérifier que l'URL sauvegardée fonctionne toujours
      if (await _testConnection(savedUrl)) {
        _cachedBaseUrl = savedUrl;
        return savedUrl;
      }
    }

    // Détecter automatiquement l'URL
    final detectedUrl = await _detectBackendUrl();

    if (detectedUrl != null) {
      // Sauvegarder pour utilisation future
      await prefs.setString(_preferenceKey, detectedUrl);
      _cachedBaseUrl = detectedUrl;
      return detectedUrl;
    }

    // Fallback sur l'adresse par défaut
    final fallbackUrl = 'http://127.0.0.1:$_port/api';
    _cachedBaseUrl = fallbackUrl;
    return fallbackUrl;
  }

  /// Détecter automatiquement l'URL du backend
  static Future<String?> _detectBackendUrl() async {
    print('🔍 Détection automatique du backend...');

    for (String address in _candidateAddresses) {
      final url = 'http://$address:$_port/api';
      print('   Test de $url...');

      if (await _testConnection(url)) {
        print('   ✅ Backend trouvé sur $url');
        return url;
      }
    }

    print('   ❌ Aucun backend détecté automatiquement');
    return null;
  }

  /// Tester la connexion à une URL
  static Future<bool> _testConnection(String baseUrl) async {
    try {
      // Tester l'endpoint admin (pas besoin d'auth)
      final testUrl = baseUrl.replaceAll('/api', '/admin/login/');

      final response = await http
          .get(Uri.parse(testUrl))
          .timeout(const Duration(seconds: 2));

      // Si on obtient une réponse (200, 302, etc.), c'est que le serveur répond
      return response.statusCode < 500;
    } catch (e) {
      return false;
    }
  }

  /// Forcer la re-détection du backend (utile après changement de réseau)
  static Future<String> forceRedetect() async {
    print('🔄 Re-détection forcée du backend...');

    // Effacer le cache
    _cachedBaseUrl = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_preferenceKey);

    // Relancer la détection
    return await getBaseUrl();
  }

  /// Définir manuellement l'URL du backend
  static Future<void> setManualUrl(String url) async {
    _cachedBaseUrl = url;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_preferenceKey, url);
    print('✅ URL manuelle définie : $url');
  }

  /// Obtenir l'URL actuellement utilisée (sans re-détection)
  static Future<String?> getCurrentUrl() async {
    if (_cachedBaseUrl != null) {
      return _cachedBaseUrl;
    }

    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_preferenceKey);
  }

  /// Vérifier si le backend est accessible
  static Future<bool> isBackendAccessible() async {
    final url = await getBaseUrl();
    return await _testConnection(url);
  }

  /// Obtenir le statut de la connexion avec détails
  static Future<Map<String, dynamic>> getConnectionStatus() async {
    final url = await getBaseUrl();
    final isAccessible = await _testConnection(url);

    return {
      'url': url,
      'accessible': isAccessible,
      'timestamp': DateTime.now().toIso8601String(),
    };
  }
}
