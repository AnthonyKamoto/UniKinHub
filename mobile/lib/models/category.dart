class Category {
  final int id;
  final String name;
  final String description;
  final String color;
  final bool isActive;
  final int newsCount;

  Category({
    required this.id,
    required this.name,
    required this.description,
    required this.color,
    required this.isActive,
    this.newsCount = 0,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      color: json['color'] ?? '#007bff',
      isActive: json['is_active'] ?? true,
      newsCount: json['news_count'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'color': color,
      'is_active': isActive,
      'news_count': newsCount,
    };
  }
}
