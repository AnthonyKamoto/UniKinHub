import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();

  User? _currentUser;
  bool _isLoading = false;
  bool _isLoggedIn = false;
  String? _errorMessage;

  // Getters
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _isLoggedIn;
  String? get errorMessage => _errorMessage;
  bool get isAdmin => _currentUser?.role == 'admin';
  bool get isModerator =>
      _currentUser?.role == 'admin' || _currentUser?.role == 'moderator';

  /// Récupérer le token d'authentification
  Future<String?> getToken() async {
    return await _authService.getToken();
  }

  /// Rafraîchir le profil utilisateur (méthode publique)
  Future<void> refreshUserProfile() async {
    await _refreshUserProfile();
  }

  /// Initialiser le provider et vérifier l'état de connexion
  Future<void> initialize() async {
    _setLoading(true);

    try {
      // Vérifier si l'utilisateur est déjà connecté
      final isLoggedIn = await _authService.isLoggedIn();

      if (isLoggedIn) {
        // Récupérer les données utilisateur sauvegardées
        _currentUser = await _authService.getSavedUser();

        if (_currentUser != null) {
          _isLoggedIn = true;
          // Optionnellement, rafraîchir le profil depuis le serveur
          await _refreshUserProfile();
        }
      }
    } catch (e) {
      _setError('Erreur lors de l\'initialisation: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Connecter un utilisateur
  Future<bool> login(String username, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _authService.login(username, password);

      if (result['success']) {
        _currentUser = result['user'];
        _isLoggedIn = true;
        notifyListeners();
        return true;
      } else {
        _setError(result['error']);
        return false;
      }
    } catch (e) {
      _setError('Erreur de connexion: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Enregistrer un nouvel utilisateur
  Future<bool> register({
    required String username,
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String university,
    required String program,
    String phoneNumber = '',
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _authService.register(
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        university: university,
        program: program,
        phoneNumber: phoneNumber,
      );

      if (result['success']) {
        // L'inscription réussie ne connecte pas automatiquement l'utilisateur
        return true;
      } else {
        _setError(result['error']);
        return false;
      }
    } catch (e) {
      _setError('Erreur lors de l\'inscription: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Enregistrer un nouvel utilisateur avec le système RBAC
  Future<bool> registerRbac({
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
    _setLoading(true);
    _clearError();

    try {
      final result = await _authService.registerRbac(
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        roleId: roleId,
        universiteId: universiteId,
        faculteId: faculteId,
        departementId: departementId,
        promotion: promotion,
      );

      if (result['success']) {
        // L'inscription réussie ne connecte pas automatiquement l'utilisateur
        return true;
      } else {
        _setError(result['error']);
        return false;
      }
    } catch (e) {
      _setError('Erreur lors de l\'inscription: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Déconnecter l'utilisateur
  Future<void> logout() async {
    _setLoading(true);

    try {
      await _authService.logout();
    } catch (e) {
      print('Erreur lors de la déconnexion: $e');
    } finally {
      _currentUser = null;
      _isLoggedIn = false;
      _clearError();
      _setLoading(false);
    }
  }

  /// Rafraîchir le profil utilisateur
  Future<void> _refreshUserProfile() async {
    try {
      final user = await _authService.getUserProfile();
      if (user != null) {
        _currentUser = user;
        notifyListeners();
      }
    } catch (e) {
      print('Erreur lors de la mise à jour du profil: $e');
    }
  }

  /// Mettre à jour le profil utilisateur
  Future<bool> updateProfile({
    required String firstName,
    required String lastName,
    required String email,
    required String university,
    required String program,
    String phoneNumber = '',
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _authService.updateProfile(
        firstName: firstName,
        lastName: lastName,
        email: email,
        university: university,
        program: program,
        phoneNumber: phoneNumber,
      );

      if (result['success']) {
        _currentUser = result['user'];
        notifyListeners();
        return true;
      } else {
        _setError(result['error']);
        return false;
      }
    } catch (e) {
      _setError('Erreur lors de la mise à jour: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Changer le mot de passe
  Future<bool> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _authService.changePassword(
        currentPassword: currentPassword,
        newPassword: newPassword,
      );

      if (result['success']) {
        return true;
      } else {
        _setError(result['error']);
        return false;
      }
    } catch (e) {
      _setError('Erreur lors du changement de mot de passe: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Vérifier si l'utilisateur peut modérer
  bool canModerate() {
    return _currentUser?.role == 'admin' || _currentUser?.role == 'moderator';
  }

  /// Vérifier si l'utilisateur peut administrer
  bool canAdmin() {
    return _currentUser?.role == 'admin';
  }

  /// Récupérer le token d'authentification
  Future<String?> getAuthToken() async {
    return await _authService.getToken();
  }

  /// Méthodes privées pour gérer l'état
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  /// Vérifier la validité de la session
  Future<bool> checkSessionValidity() async {
    try {
      if (!_isLoggedIn) return false;

      final isValid = await _authService.isLoggedIn();
      if (!isValid) {
        await logout();
        return false;
      }

      return true;
    } catch (e) {
      await logout();
      return false;
    }
  }

  /// Rafraîchir les données utilisateur depuis le serveur
  Future<void> refreshUserData() async {
    if (!_isLoggedIn) return;

    _setLoading(true);
    try {
      await _refreshUserProfile();
    } finally {
      _setLoading(false);
    }
  }

  /// Obtenir les informations de base de l'utilisateur pour l'affichage
  Map<String, String> getUserDisplayInfo() {
    if (_currentUser == null) {
      return {
        'name': 'Utilisateur',
        'email': '',
        'university': '',
        'program': '',
      };
    }

    return {
      'name': '${_currentUser!.firstName} ${_currentUser!.lastName}',
      'email': _currentUser!.email,
      'university': _currentUser!.university,
      'program': _currentUser!.program,
    };
  }
}
