import 'rbac_models.dart';

class User {
  final int id;
  final String username;
  final String email;
  final String firstName;
  final String lastName;

  // Ancien système (compatibilité)
  final String role;
  final String university;
  final String roleDisplay;

  // Nouveau système RBAC
  final int? nouveauRole;
  final Role? nouveauRoleDetail;
  final int? universite;
  final Universite? universiteDetail;
  final int? faculte;
  final Faculte? faculteDetail;
  final int? departement;
  final Departement? departementDetail;
  final String? promotion;

  // Informations communes
  final String program;
  final String phoneNumber;
  final bool isVerified;
  final DateTime dateJoined;
  final String organisationComplete;
  final int? verifiePar;
  final String? verifieParNom;
  final DateTime? dateVerification;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.firstName,
    required this.lastName,
    // Ancien système
    required this.role,
    required this.university,
    required this.roleDisplay,
    // Nouveau système RBAC
    this.nouveauRole,
    this.nouveauRoleDetail,
    this.universite,
    this.universiteDetail,
    this.faculte,
    this.faculteDetail,
    this.departement,
    this.departementDetail,
    this.promotion,
    // Informations communes
    required this.program,
    required this.phoneNumber,
    required this.isVerified,
    required this.dateJoined,
    required this.organisationComplete,
    this.verifiePar,
    this.verifieParNom,
    this.dateVerification,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: (json['id'] as num?)?.toInt() ?? 0,
      username: (json['username'] as String?) ?? '',
      email: (json['email'] as String?) ?? '',
      firstName: (json['first_name'] as String?) ?? '',
      lastName: (json['last_name'] as String?) ?? '',
      // Ancien système
      role: (json['role'] as String?) ?? 'student',
      university: (json['university'] as String?) ?? '',
      roleDisplay: (json['role_display'] as String?) ?? '',
      // Nouveau système RBAC - accepte String ou num
      nouveauRole: _parseIntField(json['nouveau_role']),
      nouveauRoleDetail: json['nouveau_role_detail'] != null
          ? Role.fromJson(json['nouveau_role_detail'])
          : null,
      universite: _parseIntField(json['universite']),
      universiteDetail: json['universite_detail'] != null
          ? Universite.fromJson(json['universite_detail'])
          : null,
      faculte: _parseIntField(json['faculte']),
      faculteDetail: json['faculte_detail'] != null
          ? Faculte.fromJson(json['faculte_detail'])
          : null,
      departement: _parseIntField(json['departement']),
      departementDetail: json['departement_detail'] != null
          ? Departement.fromJson(json['departement_detail'])
          : null,
      promotion: json['promotion'] as String?,
      // Informations communes
      program: (json['program'] as String?) ?? '',
      phoneNumber: (json['phone_number'] as String?) ?? '',
      isVerified: (json['is_verified'] as bool?) ?? false,
      dateJoined: _parseDateTime(json['date_joined']),
      organisationComplete: (json['organisation_complete'] as String?) ?? '',
      verifiePar: _parseIntField(json['verifie_par']),
      verifieParNom: json['verifie_par_nom'] as String?,
      dateVerification: json['date_verification'] != null
          ? _parseDateTime(json['date_verification'])
          : null,
    );
  }

  static int? _parseIntField(dynamic value) {
    if (value == null) return null;
    if (value is int) return value;
    if (value is num) return value.toInt();
    if (value is String) {
      final parsed = int.tryParse(value);
      return parsed;
    }
    return null;
  }

  static DateTime _parseDateTime(dynamic dateValue) {
    if (dateValue == null) return DateTime.now();
    if (dateValue is String) {
      try {
        return DateTime.parse(dateValue);
      } catch (e) {
        return DateTime.now();
      }
    }
    return DateTime.now();
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
      'role': role,
      'university': university,
      'program': program,
      'phone_number': phoneNumber,
      'is_verified': isVerified,
      'date_joined': dateJoined.toIso8601String(),
      // Nouveau système RBAC
      'nouveau_role': nouveauRole,
      'universite': universite,
      'faculte': faculte,
      'departement': departement,
      'promotion': promotion,
      'organisation_complete': organisationComplete,
      'verifie_par': verifiePar,
      'verifie_par_nom': verifieParNom,
      'date_verification': dateVerification?.toIso8601String(),
    };
  }

  String get fullName => '$firstName $lastName'.trim();

  // Helpers pour le système RBAC
  bool hasPermission(String permission) {
    // Nouveau système RBAC
    if (nouveauRoleDetail?.permissions != null) {
      return nouveauRoleDetail!.permissions[permission] == true;
    }

    // Fallback sur l'ancien système
    switch (role) {
      case 'admin':
        return [
          'can_manage_all',
          'can_verify_users',
          'can_moderate_news',
          'can_create_content',
          'can_view_content',
        ].contains(permission);
      case 'moderator':
        return [
          'can_moderate_news',
          'can_verify_users',
          'can_create_content',
          'can_view_content',
        ].contains(permission);
      case 'publisher':
        return ['can_create_content', 'can_view_content'].contains(permission);
      case 'teacher':
        return ['can_create_content', 'can_view_content'].contains(permission);
      case 'student':
        return ['can_view_content'].contains(permission);
      default:
        return false;
    }
  }

  bool get isAdmin {
    // Nouveau système
    if (nouveauRoleDetail != null) {
      return nouveauRoleDetail!.nom == 'admin_global' ||
          hasPermission('can_manage_all');
    }
    // Ancien système
    return role == 'admin';
  }

  bool get isModerator {
    // Nouveau système
    if (nouveauRoleDetail != null) {
      return nouveauRoleDetail!.nom == 'moderateur' ||
          hasPermission('can_moderate_news');
    }
    // Ancien système
    return role == 'admin' || role == 'moderator';
  }

  bool get canVerifyUsers {
    // Nouveau système
    if (nouveauRoleDetail != null) {
      return hasPermission('can_verify_users');
    }
    // Ancien système
    return role == 'admin';
  }

  String get currentRoleDisplay {
    // Utiliser le nouveau système en priorité
    if (nouveauRoleDetail != null) {
      return nouveauRoleDetail!.nom;
    }
    // Fallback sur l'ancien système
    return roleDisplay.isNotEmpty ? roleDisplay : _getLegacyRoleDisplay();
  }

  String _getLegacyRoleDisplay() {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'moderator':
        return 'Modérateur';
      case 'publisher':
        return 'Publiant';
      case 'teacher':
        return 'Enseignant';
      case 'student':
        return 'Étudiant';
      default:
        return role;
    }
  }
}
