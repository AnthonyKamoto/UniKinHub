// ===== MODÈLES RBAC =====

class Role {
  final int id;
  final String nom;
  final String nomAffichage; // Nom d'affichage en français
  final String description;
  final Map<String, dynamic> permissions;
  final bool estActif;
  final DateTime createdAt;
  final int utilisateursCount;

  Role({
    required this.id,
    required this.nom,
    required this.nomAffichage,
    required this.description,
    required this.permissions,
    required this.estActif,
    required this.createdAt,
    required this.utilisateursCount,
  });

  factory Role.fromJson(Map<String, dynamic> json) {
    return Role(
      id: (json['id'] as num?)?.toInt() ?? 0,
      nom: (json['nom'] as String?) ?? '',
      nomAffichage:
          (json['nom_affichage'] as String?) ?? (json['nom'] as String?) ?? '',
      description: (json['description'] as String?) ?? '',
      permissions: (json['permissions'] as Map<String, dynamic>?) ?? {},
      estActif: (json['est_actif'] as bool?) ?? true,
      createdAt: _parseDateTime(json['created_at']),
      utilisateursCount: (json['utilisateurs_count'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nom': nom,
      'nom_affichage': nomAffichage,
      'description': description,
      'permissions': permissions,
      'est_actif': estActif,
      'created_at': createdAt.toIso8601String(),
      'utilisateurs_count': utilisateursCount,
    };
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
}

class Universite {
  final int id;
  final String nom;
  final String code;
  final String? adresse;
  final String? ville;
  final String? pays;
  final String? siteWeb;
  final bool estActive;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int facultesCount;
  final int utilisateursCount;

  Universite({
    required this.id,
    required this.nom,
    required this.code,
    this.adresse,
    this.ville,
    this.pays,
    this.siteWeb,
    required this.estActive,
    required this.createdAt,
    required this.updatedAt,
    required this.facultesCount,
    required this.utilisateursCount,
  });

  factory Universite.fromJson(Map<String, dynamic> json) {
    return Universite(
      id: (json['id'] as num?)?.toInt() ?? 0,
      nom: (json['nom'] as String?) ?? '',
      code: (json['code'] as String?) ?? '',
      adresse: json['adresse'] as String?,
      ville: json['ville'] as String?,
      pays: json['pays'] as String?,
      siteWeb: json['site_web'] as String?,
      estActive: (json['est_active'] as bool?) ?? true,
      createdAt: _parseDateTime(json['created_at']),
      updatedAt: _parseDateTime(json['updated_at']),
      facultesCount: (json['facultes_count'] as num?)?.toInt() ?? 0,
      utilisateursCount: (json['utilisateurs_count'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nom': nom,
      'code': code,
      'adresse': adresse,
      'ville': ville,
      'pays': pays,
      'site_web': siteWeb,
      'est_active': estActive,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'facultes_count': facultesCount,
      'utilisateurs_count': utilisateursCount,
    };
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
}

class Faculte {
  final int id;
  final String nom;
  final String code;
  final int universite;
  final String universiteNom;
  final String? description;
  final bool estActive;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int departementsCount;
  final int utilisateursCount;

  Faculte({
    required this.id,
    required this.nom,
    required this.code,
    required this.universite,
    required this.universiteNom,
    this.description,
    required this.estActive,
    required this.createdAt,
    required this.updatedAt,
    required this.departementsCount,
    required this.utilisateursCount,
  });

  factory Faculte.fromJson(Map<String, dynamic> json) {
    return Faculte(
      id: (json['id'] as num?)?.toInt() ?? 0,
      nom: (json['nom'] as String?) ?? '',
      code: (json['code'] as String?) ?? '',
      universite: (json['universite'] as num?)?.toInt() ?? 0,
      universiteNom: (json['universite_nom'] as String?) ?? '',
      description: json['description'] as String?,
      estActive: (json['est_active'] as bool?) ?? true,
      createdAt: _parseDateTime(json['created_at']),
      updatedAt: _parseDateTime(json['updated_at']),
      departementsCount: (json['departements_count'] as num?)?.toInt() ?? 0,
      utilisateursCount: (json['utilisateurs_count'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nom': nom,
      'code': code,
      'universite': universite,
      'universite_nom': universiteNom,
      'description': description,
      'est_active': estActive,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'departements_count': departementsCount,
      'utilisateurs_count': utilisateursCount,
    };
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
}

class Departement {
  final int id;
  final String nom;
  final String code;
  final int faculte;
  final String faculteNom;
  final String universiteNom;
  final String? description;
  final bool estActif;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int utilisateursCount;

  Departement({
    required this.id,
    required this.nom,
    required this.code,
    required this.faculte,
    required this.faculteNom,
    required this.universiteNom,
    this.description,
    required this.estActif,
    required this.createdAt,
    required this.updatedAt,
    required this.utilisateursCount,
  });

  factory Departement.fromJson(Map<String, dynamic> json) {
    return Departement(
      id: (json['id'] as num?)?.toInt() ?? 0,
      nom: (json['nom'] as String?) ?? '',
      code: (json['code'] as String?) ?? '',
      faculte: (json['faculte'] as num?)?.toInt() ?? 0,
      faculteNom: (json['faculte_nom'] as String?) ?? '',
      universiteNom: (json['universite_nom'] as String?) ?? '',
      description: json['description'] as String?,
      estActif: (json['est_actif'] as bool?) ?? true,
      createdAt: _parseDateTime(json['created_at']),
      updatedAt: _parseDateTime(json['updated_at']),
      utilisateursCount: (json['utilisateurs_count'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nom': nom,
      'code': code,
      'faculte': faculte,
      'faculte_nom': faculteNom,
      'universite_nom': universiteNom,
      'description': description,
      'est_actif': estActif,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'utilisateurs_count': utilisateursCount,
    };
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
}

// ===== MODÈLES POUR LES STATISTIQUES =====

class OrganisationStats {
  final int universitesCount;
  final int facultesCount;
  final int departementsCount;
  final int rolesCount;
  final Map<String, int> utilisateursParRole;
  final int utilisateursNonVerifies;

  OrganisationStats({
    required this.universitesCount,
    required this.facultesCount,
    required this.departementsCount,
    required this.rolesCount,
    required this.utilisateursParRole,
    required this.utilisateursNonVerifies,
  });

  factory OrganisationStats.fromJson(Map<String, dynamic> json) {
    return OrganisationStats(
      universitesCount: (json['universites_count'] as num?)?.toInt() ?? 0,
      facultesCount: (json['facultes_count'] as num?)?.toInt() ?? 0,
      departementsCount: (json['departements_count'] as num?)?.toInt() ?? 0,
      rolesCount: (json['roles_count'] as num?)?.toInt() ?? 0,
      utilisateursParRole: Map<String, int>.from(
        (json['utilisateurs_par_role'] as Map<String, dynamic>?) ?? {},
      ),
      utilisateursNonVerifies:
          (json['utilisateurs_non_verifies'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'universites_count': universitesCount,
      'facultes_count': facultesCount,
      'departements_count': departementsCount,
      'roles_count': rolesCount,
      'utilisateurs_par_role': utilisateursParRole,
      'utilisateurs_non_verifies': utilisateursNonVerifies,
    };
  }
}

// ===== MODÈLES POUR LA VÉRIFICATION D'UTILISATEURS =====

class UserVerificationData {
  final int id;
  final String username;
  final String email;
  final String firstName;
  final String lastName;
  final String? verificationDocument;
  final String verificationStatus;
  final DateTime? dateSubmission;
  final String? promotion;
  final String? universiteNom;
  final String? faculteNom;
  final String? departementNom;

  UserVerificationData({
    required this.id,
    required this.username,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.verificationDocument,
    required this.verificationStatus,
    this.dateSubmission,
    this.promotion,
    this.universiteNom,
    this.faculteNom,
    this.departementNom,
  });

  factory UserVerificationData.fromJson(Map<String, dynamic> json) {
    return UserVerificationData(
      id: json['id'] as int,
      username: json['username'] as String,
      email: json['email'] as String,
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      verificationDocument: json['verification_document'] as String?,
      verificationStatus: json['verification_status'] ?? 'non_verifie',
      dateSubmission: json['date_submission'] != null
          ? DateTime.tryParse(json['date_submission'])
          : null,
      promotion: json['promotion'] as String?,
      universiteNom: json['universite_nom'] as String?,
      faculteNom: json['faculte_nom'] as String?,
      departementNom: json['departement_nom'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
      'verification_document': verificationDocument,
      'verification_status': verificationStatus,
      'date_submission': dateSubmission?.toIso8601String(),
      'promotion': promotion,
      'universite_nom': universiteNom,
      'faculte_nom': faculteNom,
      'departement_nom': departementNom,
    };
  }
}
