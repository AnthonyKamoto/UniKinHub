/// Modèle étendu pour les actualités avec tous les champs de modération
/// Supporte les spécifications complètes du système
class NewsExtended {
  final int id;

  // Programme ou formation destinataire
  final String programmeOuFormation;

  // Contenu avant modération
  final String draftTitle;
  final String draftContent;

  // Contenu après modération
  final String finalTitle;
  final String finalContent;

  // Titre et contenu à afficher (final ou draft selon le statut)
  final String title;
  final String content;

  // Auteur (publiant)
  final int author;
  final String authorName;

  // Catégorie
  final int category;
  final String categoryName;
  final String categoryColor;

  // Statut et importance
  final String status; // draft, pending, published, rejected, invalidated
  final String importance; // low, medium, high, urgent

  // Dates
  final DateTime writtenAt; // Date de rédaction
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? moderatedAt; // Date de modération
  final DateTime desiredPublishStart; // Date de publication souhaitée
  final DateTime? desiredPublishEnd;
  final DateTime? publishDate; // Date effective de publication
  final DateTime? expiryDate;

  // Informations de modération
  final int? moderator;
  final bool moderatorApproved; // Accord du modérateur
  final String moderationComment;

  // Administrateur ayant invalidé
  final int? adminInvalidatedBy;
  final String adminInvalidationReason; // Motivation de l'invalidation
  final DateTime? invalidatedAt;

  // Métadonnées
  final List<String> targetUniversities;
  final List<String> targetPrograms;
  final int viewsCount;
  final int likesCount;

  // Fichiers
  final String? image;
  final String? attachment;

  // Interaction
  final bool isLiked;

  NewsExtended({
    required this.id,
    required this.programmeOuFormation,
    required this.draftTitle,
    required this.draftContent,
    this.finalTitle = '',
    this.finalContent = '',
    required this.title,
    required this.content,
    required this.author,
    required this.authorName,
    required this.category,
    required this.categoryName,
    required this.categoryColor,
    required this.status,
    required this.importance,
    required this.writtenAt,
    required this.createdAt,
    required this.updatedAt,
    this.moderatedAt,
    required this.desiredPublishStart,
    this.desiredPublishEnd,
    this.publishDate,
    this.expiryDate,
    this.moderator,
    this.moderatorApproved = false,
    this.moderationComment = '',
    this.adminInvalidatedBy,
    this.adminInvalidationReason = '',
    this.invalidatedAt,
    this.targetUniversities = const [],
    this.targetPrograms = const [],
    this.viewsCount = 0,
    this.likesCount = 0,
    this.image,
    this.attachment,
    this.isLiked = false,
  });

  factory NewsExtended.fromJson(Map<String, dynamic> json) {
    // Gérer author qui peut être un int ou un objet
    int authorId;
    if (json['author'] is int) {
      authorId = json['author'];
    } else if (json['author'] is Map<String, dynamic>) {
      authorId = json['author']['id'] ?? 0;
    } else {
      authorId = 0;
    }

    // Gérer category qui peut être un int ou un objet
    int categoryId;
    if (json['category'] is int) {
      categoryId = json['category'];
    } else if (json['category'] is Map<String, dynamic>) {
      categoryId = json['category']['id'] ?? 0;
    } else {
      categoryId = 0;
    }

    return NewsExtended(
      id: json['id'] ?? 0,
      programmeOuFormation: json['programme_ou_formation'] ?? '',
      draftTitle: json['draft_title'] ?? '',
      draftContent: json['draft_content'] ?? '',
      finalTitle: json['final_title'] ?? '',
      finalContent: json['final_content'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      author: authorId,
      authorName: json['author_name'] ?? '',
      category: categoryId,
      categoryName:
          json['category_name'] ??
          (json['category'] is Map<String, dynamic>
              ? json['category']['name'] ?? ''
              : ''),
      categoryColor:
          json['category_color'] ??
          (json['category'] is Map<String, dynamic>
              ? json['category']['color'] ?? '#007bff'
              : '#007bff'),
      status: json['status'] ?? 'draft',
      importance: json['importance'] ?? 'medium',
      writtenAt: DateTime.parse(
        json['written_at'] ?? DateTime.now().toIso8601String(),
      ),
      createdAt: DateTime.parse(
        json['created_at'] ?? DateTime.now().toIso8601String(),
      ),
      updatedAt: DateTime.parse(
        json['updated_at'] ?? DateTime.now().toIso8601String(),
      ),
      moderatedAt: json['moderated_at'] != null
          ? DateTime.parse(json['moderated_at'])
          : null,
      desiredPublishStart: DateTime.parse(
        json['desired_publish_start'] ?? DateTime.now().toIso8601String(),
      ),
      desiredPublishEnd: json['desired_publish_end'] != null
          ? DateTime.parse(json['desired_publish_end'])
          : null,
      publishDate: json['publish_date'] != null
          ? DateTime.parse(json['publish_date'])
          : null,
      expiryDate: json['expiry_date'] != null
          ? DateTime.parse(json['expiry_date'])
          : null,
      moderator: json['moderator'],
      moderatorApproved: json['moderator_approved'] ?? false,
      moderationComment: json['moderation_comment'] ?? '',
      adminInvalidatedBy: json['admin_invalidated_by'],
      adminInvalidationReason: json['admin_invalidation_reason'] ?? '',
      invalidatedAt: json['invalidated_at'] != null
          ? DateTime.parse(json['invalidated_at'])
          : null,
      targetUniversities: List<String>.from(json['target_universities'] ?? []),
      targetPrograms: List<String>.from(json['target_programs'] ?? []),
      viewsCount: json['views_count'] ?? 0,
      likesCount: json['likes_count'] ?? 0,
      image: json['image'],
      attachment: json['attachment'],
      isLiked: json['is_liked'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'programme_ou_formation': programmeOuFormation,
      'draft_title': draftTitle,
      'draft_content': draftContent,
      'final_title': finalTitle,
      'final_content': finalContent,
      'title': title,
      'content': content,
      'author': author,
      'author_name': authorName,
      'category': category,
      'category_name': categoryName,
      'category_color': categoryColor,
      'status': status,
      'importance': importance,
      'written_at': writtenAt.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'moderated_at': moderatedAt?.toIso8601String(),
      'desired_publish_start': desiredPublishStart.toIso8601String(),
      'desired_publish_end': desiredPublishEnd?.toIso8601String(),
      'publish_date': publishDate?.toIso8601String(),
      'expiry_date': expiryDate?.toIso8601String(),
      'moderator': moderator,
      'moderator_approved': moderatorApproved,
      'moderation_comment': moderationComment,
      'admin_invalidated_by': adminInvalidatedBy,
      'admin_invalidation_reason': adminInvalidationReason,
      'invalidated_at': invalidatedAt?.toIso8601String(),
      'target_universities': targetUniversities,
      'target_programs': targetPrograms,
      'views_count': viewsCount,
      'likes_count': likesCount,
      'image': image,
      'attachment': attachment,
      'is_liked': isLiked,
    };
  }

  /// Helper pour obtenir la couleur selon le statut
  String getStatusColor() {
    switch (status) {
      case 'published':
        return '4CAF50'; // Vert
      case 'pending':
        return 'FF9800'; // Orange
      case 'rejected':
      case 'invalidated':
        return 'F44336'; // Rouge
      case 'draft':
        return '9E9E9E'; // Gris
      default:
        return '757575';
    }
  }

  /// Helper pour obtenir la couleur selon l'importance
  String getImportanceColor() {
    switch (importance) {
      case 'urgent':
        return 'F44336'; // Rouge
      case 'high':
        return 'FF9800'; // Orange
      case 'medium':
        return '2196F3'; // Bleu
      case 'low':
        return '9E9E9E'; // Gris
      default:
        return '757575';
    }
  }

  /// Helper pour obtenir le libellé de l'importance
  String getImportanceLabel() {
    switch (importance) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Importante';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Faible';
      default:
        return importance;
    }
  }

  /// Helper pour obtenir le libellé du statut
  String getStatusLabel() {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'pending':
        return 'En attente';
      case 'published':
        return 'Publié';
      case 'rejected':
        return 'Rejeté';
      case 'invalidated':
        return 'Invalidé';
      default:
        return status;
    }
  }

  /// Copie avec modifications
  NewsExtended copyWith({
    int? id,
    String? programmeOuFormation,
    String? draftTitle,
    String? draftContent,
    String? finalTitle,
    String? finalContent,
    String? title,
    String? content,
    int? author,
    String? authorName,
    int? category,
    String? categoryName,
    String? categoryColor,
    String? status,
    String? importance,
    DateTime? writtenAt,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? moderatedAt,
    DateTime? desiredPublishStart,
    DateTime? desiredPublishEnd,
    DateTime? publishDate,
    DateTime? expiryDate,
    int? moderator,
    bool? moderatorApproved,
    String? moderationComment,
    int? adminInvalidatedBy,
    String? adminInvalidationReason,
    DateTime? invalidatedAt,
    List<String>? targetUniversities,
    List<String>? targetPrograms,
    int? viewsCount,
    int? likesCount,
    String? image,
    String? attachment,
    bool? isLiked,
  }) {
    return NewsExtended(
      id: id ?? this.id,
      programmeOuFormation: programmeOuFormation ?? this.programmeOuFormation,
      draftTitle: draftTitle ?? this.draftTitle,
      draftContent: draftContent ?? this.draftContent,
      finalTitle: finalTitle ?? this.finalTitle,
      finalContent: finalContent ?? this.finalContent,
      title: title ?? this.title,
      content: content ?? this.content,
      author: author ?? this.author,
      authorName: authorName ?? this.authorName,
      category: category ?? this.category,
      categoryName: categoryName ?? this.categoryName,
      categoryColor: categoryColor ?? this.categoryColor,
      status: status ?? this.status,
      importance: importance ?? this.importance,
      writtenAt: writtenAt ?? this.writtenAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      moderatedAt: moderatedAt ?? this.moderatedAt,
      desiredPublishStart: desiredPublishStart ?? this.desiredPublishStart,
      desiredPublishEnd: desiredPublishEnd ?? this.desiredPublishEnd,
      publishDate: publishDate ?? this.publishDate,
      expiryDate: expiryDate ?? this.expiryDate,
      moderator: moderator ?? this.moderator,
      moderatorApproved: moderatorApproved ?? this.moderatorApproved,
      moderationComment: moderationComment ?? this.moderationComment,
      adminInvalidatedBy: adminInvalidatedBy ?? this.adminInvalidatedBy,
      adminInvalidationReason:
          adminInvalidationReason ?? this.adminInvalidationReason,
      invalidatedAt: invalidatedAt ?? this.invalidatedAt,
      targetUniversities: targetUniversities ?? this.targetUniversities,
      targetPrograms: targetPrograms ?? this.targetPrograms,
      viewsCount: viewsCount ?? this.viewsCount,
      likesCount: likesCount ?? this.likesCount,
      image: image ?? this.image,
      attachment: attachment ?? this.attachment,
      isLiked: isLiked ?? this.isLiked,
    );
  }
}
