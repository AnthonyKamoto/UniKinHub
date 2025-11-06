class News {
  final int id;
  final String title;
  final String content;
  final int author;
  final String authorName;
  final int category;
  final String categoryName;
  final String categoryColor;
  final String status;
  final String importance;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? publishDate;
  final DateTime? expiryDate;
  final List<String> targetUniversities;
  final List<String> targetPrograms;
  final int viewsCount;
  final int likesCount;
  final String? image;
  final String? attachment;
  final bool isLiked;
  final String timeSince;

  News({
    required this.id,
    required this.title,
    required this.content,
    required this.author,
    required this.authorName,
    required this.category,
    required this.categoryName,
    required this.categoryColor,
    required this.status,
    required this.importance,
    required this.createdAt,
    required this.updatedAt,
    this.publishDate,
    this.expiryDate,
    this.targetUniversities = const [],
    this.targetPrograms = const [],
    this.viewsCount = 0,
    this.likesCount = 0,
    this.image,
    this.attachment,
    this.isLiked = false,
    this.timeSince = '',
  });

  factory News.fromJson(Map<String, dynamic> json) {
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

    return News(
      id: json['id'] ?? 0,
      title: (json['title'] as String?) ?? '',
      content: (json['content'] as String?) ?? '',
      author: authorId,
      authorName:
          (json['author_name'] as String?) ??
          (json['author'] is Map<String, dynamic>
              ? '${json['author']['first_name'] ?? ''} ${json['author']['last_name'] ?? ''}'
                    .trim()
              : ''),
      category: categoryId,
      categoryName:
          (json['category_name'] as String?) ??
          (json['category'] is Map<String, dynamic>
              ? json['category']['name'] ?? ''
              : ''),
      categoryColor:
          (json['category_color'] as String?) ??
          (json['category'] is Map<String, dynamic>
              ? json['category']['color'] ?? '#007bff'
              : '#007bff'),
      status: (json['status'] as String?) ?? '',
      importance: (json['importance'] as String?) ?? 'medium',
      createdAt: DateTime.parse(
        json['created_at'] ?? DateTime.now().toIso8601String(),
      ),
      updatedAt: DateTime.parse(
        json['updated_at'] ?? DateTime.now().toIso8601String(),
      ),
      publishDate: json['publish_date'] != null
          ? DateTime.parse(json['publish_date'])
          : null,
      expiryDate: json['expiry_date'] != null
          ? DateTime.parse(json['expiry_date'])
          : null,
      targetUniversities: List<String>.from(json['target_universities'] ?? []),
      targetPrograms: List<String>.from(json['target_programs'] ?? []),
      viewsCount: json['views_count'] ?? 0,
      likesCount: json['likes_count'] ?? 0,
      image: (json['image'] as String?),
      attachment: (json['attachment'] as String?),
      isLiked: json['is_liked'] ?? false,
      timeSince: (json['time_since'] as String?) ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'author': author,
      'author_name': authorName,
      'category': category,
      'category_name': categoryName,
      'category_color': categoryColor,
      'status': status,
      'importance': importance,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'publish_date': publishDate?.toIso8601String(),
      'expiry_date': expiryDate?.toIso8601String(),
      'target_universities': targetUniversities,
      'target_programs': targetPrograms,
      'views_count': viewsCount,
      'likes_count': likesCount,
      'image': image,
      'attachment': attachment,
      'is_liked': isLiked,
      'time_since': timeSince,
    };
  }

  String get importanceDisplay {
    switch (importance) {
      case 'low':
        return 'Faible';
      case 'medium':
        return 'Moyenne';
      case 'high':
        return 'Élevée';
      case 'urgent':
        return 'Urgent';
      default:
        return importance;
    }
  }

  String get statusDisplay {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'pending':
        return 'En attente';
      case 'published':
        return 'Publié';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  }

  /// Créer une copie avec des valeurs modifiées
  News copyWith({
    int? id,
    String? title,
    String? content,
    int? author,
    String? authorName,
    int? category,
    String? categoryName,
    String? categoryColor,
    String? status,
    String? importance,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? publishDate,
    DateTime? expiryDate,
    List<String>? targetUniversities,
    List<String>? targetPrograms,
    int? viewsCount,
    int? likesCount,
    String? image,
    String? attachment,
    bool? isLiked,
    String? timeSince,
  }) {
    return News(
      id: id ?? this.id,
      title: title ?? this.title,
      content: content ?? this.content,
      author: author ?? this.author,
      authorName: authorName ?? this.authorName,
      category: category ?? this.category,
      categoryName: categoryName ?? this.categoryName,
      categoryColor: categoryColor ?? this.categoryColor,
      status: status ?? this.status,
      importance: importance ?? this.importance,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      publishDate: publishDate ?? this.publishDate,
      expiryDate: expiryDate ?? this.expiryDate,
      targetUniversities: targetUniversities ?? this.targetUniversities,
      targetPrograms: targetPrograms ?? this.targetPrograms,
      viewsCount: viewsCount ?? this.viewsCount,
      likesCount: likesCount ?? this.likesCount,
      image: image ?? this.image,
      attachment: attachment ?? this.attachment,
      isLiked: isLiked ?? this.isLiked,
      timeSince: timeSince ?? this.timeSince,
    );
  }
}
