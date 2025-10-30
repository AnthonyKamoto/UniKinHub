class NewsFilter {
  final String? category;
  final String? importance;
  final String? university;
  final String? status;
  final DateTime? startDate;
  final DateTime? endDate;
  final String? search;

  NewsFilter({
    this.category,
    this.importance,
    this.university,
    this.status,
    this.startDate,
    this.endDate,
    this.search,
  });

  NewsFilter copyWith({
    String? category,
    String? importance,
    String? university,
    String? status,
    DateTime? startDate,
    DateTime? endDate,
    String? search,
  }) {
    return NewsFilter(
      category: category ?? this.category,
      importance: importance ?? this.importance,
      university: university ?? this.university,
      status: status ?? this.status,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      search: search ?? this.search,
    );
  }

  Map<String, dynamic> toMap() {
    final map = <String, dynamic>{};

    if (category != null) map['category'] = category;
    if (importance != null) map['importance'] = importance;
    if (university != null) map['university'] = university;
    if (status != null) map['status'] = status;
    if (startDate != null) {
      map['start_date'] = startDate!.toIso8601String().split('T')[0];
    }
    if (endDate != null) {
      map['end_date'] = endDate!.toIso8601String().split('T')[0];
    }
    if (search != null && search!.isNotEmpty) map['search'] = search;

    return map;
  }

  bool get isEmpty {
    return category == null &&
        importance == null &&
        university == null &&
        status == null &&
        startDate == null &&
        endDate == null &&
        (search == null || search!.isEmpty);
  }

  int get activeFiltersCount {
    int count = 0;
    if (category != null) count++;
    if (importance != null) count++;
    if (university != null) count++;
    if (status != null) count++;
    if (startDate != null || endDate != null) count++;
    if (search != null && search!.isNotEmpty) count++;
    return count;
  }

  @override
  String toString() {
    return 'NewsFilter{category: $category, importance: $importance, university: $university, status: $status, startDate: $startDate, endDate: $endDate, search: $search}';
  }
}
