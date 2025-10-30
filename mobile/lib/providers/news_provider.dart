import 'package:flutter/foundation.dart';
import '../models/news.dart';
import '../models/category.dart' as models;
import '../models/news_filter.dart';
import '../services/news_service.dart';

class NewsProvider with ChangeNotifier {
  final NewsService _newsService = NewsService();

  List<News> _news = [];
  List<models.Category> _categories = [];
  List<News> _myNews = [];
  List<News> _pendingNews = [];
  bool _isLoading = false;
  bool _isLoadingMore = false;
  String? _error;
  String? _successMessage;
  int _currentPage = 1;
  bool _hasMorePages = true;
  int _totalCount = 0;

  // Filtres
  int? _selectedCategoryId;
  String? _selectedImportance;
  String? _selectedUniversity;
  String? _searchQuery;
  String? _selectedStatus;

  // Getters
  List<News> get news => _news;
  List<models.Category> get categories => _categories;
  List<News> get myNews => _myNews;
  List<News> get pendingNews => _pendingNews;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  String? get error => _error;
  String? get successMessage => _successMessage;
  bool get hasMorePages => _hasMorePages;
  int get totalCount => _totalCount;
  int? get selectedCategoryId => _selectedCategoryId;
  String? get selectedImportance => _selectedImportance;
  String? get selectedUniversity => _selectedUniversity;
  String? get searchQuery => _searchQuery;
  String? get selectedStatus => _selectedStatus;

  /// Charger les catégories
  Future<void> loadCategories() async {
    _setLoading(true);
    _clearMessages();

    try {
      final result = await _newsService.getCategories();

      if (result['success']) {
        _categories = result['categories'];
      } else {
        _setError(result['error']);
      }
    } catch (e) {
      _setError('Erreur lors du chargement des catégories: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Charger les actualités avec pagination
  Future<void> loadNews({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _news = [];
      _hasMorePages = true;
      _totalCount = 0;
    }

    if (!_hasMorePages || _isLoading) return;

    _setLoading(true);
    _clearMessages();

    try {
      final result = await _newsService.getNews(
        categoryId: _selectedCategoryId,
        importance: _selectedImportance,
        university: _selectedUniversity,
        search: _searchQuery,
        status: _selectedStatus,
        page: _currentPage,
        limit: 20,
      );

      if (result['success']) {
        final newNews = result['news'] as List<News>;
        _totalCount = result['count'] ?? 0;

        if (_currentPage == 1) {
          _news = newNews;
        } else {
          _news.addAll(newNews);
        }

        _currentPage++;
        _hasMorePages = result['next'] != null;
      } else {
        _setError(result['error']);
      }
    } catch (e) {
      _setError('Erreur lors du chargement: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Charger plus d'actualités (pagination)
  Future<void> loadMoreNews() async {
    if (!_hasMorePages || _isLoadingMore) return;

    _isLoadingMore = true;
    notifyListeners();

    try {
      final result = await _newsService.getNews(
        categoryId: _selectedCategoryId,
        importance: _selectedImportance,
        university: _selectedUniversity,
        search: _searchQuery,
        status: _selectedStatus,
        page: _currentPage,
        limit: 20,
      );

      if (result['success']) {
        final newNews = result['news'] as List<News>;
        _news.addAll(newNews);
        _currentPage++;
        _hasMorePages = result['next'] != null;
      } else {
        _setError(result['error']);
      }
    } catch (e) {
      _setError('Erreur lors du chargement: $e');
    } finally {
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  /// Récupérer une actualité par ID
  Future<News?> getNewsById(int id) async {
    try {
      final result = await _newsService.getNewsById(id);
      if (result['success']) {
        return result['news'] as News;
      } else {
        _setError(result['error']);
        return null;
      }
    } catch (e) {
      _setError('Erreur lors du chargement de l\'actualité: $e');
      return null;
    }
  }

  /// Créer une nouvelle actualité
  Future<bool> createNews({
    required String title,
    required String content,
    required int categoryId,
    String? imageUrl,
    String? importance,
  }) async {
    _setLoading(true);
    _clearMessages();

    try {
      final result = await _newsService.createNews(
        title: title,
        content: content,
        categoryId: categoryId,
        imageUrl: imageUrl,
        importance: importance,
      );

      if (result['success']) {
        _setSuccess(result['message']);
        // Rafraîchir la liste des actualités personnelles
        await loadMyNews();
        return true;
      } else {
        _setError(result['error']);
        return false;
      }
    } catch (e) {
      _setError('Erreur lors de la création: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Liker/Disliker une actualité
  Future<void> toggleLike(int newsId) async {
    try {
      final newsIndex = _news.indexWhere((n) => n.id == newsId);
      if (newsIndex == -1) return;

      final news = _news[newsIndex];
      final result = await _newsService.toggleLike(newsId, news.isLiked);

      if (result['success']) {
        // Mettre à jour localement avec la valeur retournée par l'API
        _news[newsIndex] = news.copyWith(
          isLiked: result['liked'],
          likesCount: result['likes_count'] ?? news.likesCount,
        );
        notifyListeners();
      } else {
        _setError(result['error']);
      }
    } catch (e) {
      _setError('Erreur lors du like: $e');
    }
  }

  /// Charger mes actualités
  Future<void> loadMyNews() async {
    _setLoading(true);
    _clearMessages();

    try {
      final result = await _newsService.getMyNews();

      if (result['success']) {
        _myNews = result['news'];
      } else {
        _setError(result['error']);
      }
    } catch (e) {
      _setError('Erreur lors du chargement de vos actualités: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Charger les actualités en attente (admin/modérateur)
  Future<void> loadPendingNews() async {
    _setLoading(true);
    _clearMessages();

    try {
      final result = await _newsService.getPendingNews();

      if (result['success']) {
        _pendingNews = result['news'];
      } else {
        _setError(result['error']);
      }
    } catch (e) {
      _setError('Erreur lors du chargement des actualités en attente: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Modérer une actualité (admin/modérateur)
  Future<bool> moderateNews({
    required int newsId,
    required String action,
    String? reason,
  }) async {
    _setLoading(true);
    _clearMessages();

    try {
      final result = await _newsService.moderateNews(
        newsId: newsId,
        action: action,
        reason: reason,
      );

      if (result['success']) {
        _setSuccess(result['message']);
        // Retirer de la liste des actualités en attente
        _pendingNews.removeWhere((news) => news.id == newsId);

        // Si approuvée, rafraîchir la liste principale
        if (action == 'approve') {
          await loadNews(refresh: true);
        }

        notifyListeners();
        return true;
      } else {
        _setError(result['error']);
        return false;
      }
    } catch (e) {
      _setError('Erreur lors de la modération: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Supprimer une actualité
  Future<bool> deleteNews(int newsId) async {
    _setLoading(true);
    _clearMessages();

    try {
      final result = await _newsService.deleteNews(newsId);

      if (result['success']) {
        _setSuccess(result['message']);
        // Retirer de toutes les listes locales
        _news.removeWhere((news) => news.id == newsId);
        _myNews.removeWhere((news) => news.id == newsId);
        _pendingNews.removeWhere((news) => news.id == newsId);

        notifyListeners();
        return true;
      } else {
        _setError(result['error']);
        return false;
      }
    } catch (e) {
      _setError('Erreur lors de la suppression: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Appliquer les filtres
  void applyFilters({
    int? categoryId,
    String? importance,
    String? university,
    String? search,
    String? status,
  }) {
    _selectedCategoryId = categoryId;
    _selectedImportance = importance;
    _selectedUniversity = university;
    _searchQuery = search;
    _selectedStatus = status;

    loadNews(refresh: true);
  }

  /// Réinitialiser les filtres
  void resetFilters() {
    _selectedCategoryId = null;
    _selectedImportance = null;
    _selectedUniversity = null;
    _searchQuery = null;
    _selectedStatus = null;

    loadNews(refresh: true);
  }

  /// Rechercher des actualités
  Future<void> searchNews(String query) async {
    _searchQuery = query;
    await loadNews(refresh: true);
  }

  /// Récupérer les statistiques du dashboard
  Future<Map<String, dynamic>?> getDashboardStats() async {
    try {
      final result = await _newsService.getDashboardStats();
      if (result['success']) {
        return result['stats'];
      } else {
        _setError(result['error']);
        return null;
      }
    } catch (e) {
      _setError('Erreur lors du chargement des statistiques: $e');
      return null;
    }
  }

  // Méthodes helper pour l'interface
  List<News> getNewsByCategory(int categoryId) {
    return _news.where((news) => news.category == categoryId).toList();
  }

  List<News> getImportantNews() {
    return _news.where((news) => news.importance == 'high').toList();
  }

  List<News> getRecentNews({int limit = 5}) {
    final sortedNews = List<News>.from(_news);
    sortedNews.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return sortedNews.take(limit).toList();
  }

  /// Méthodes privées pour gérer l'état
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    _successMessage = null;
    notifyListeners();
  }

  void _setSuccess(String message) {
    _successMessage = message;
    _error = null;
    notifyListeners();
  }

  void _clearMessages() {
    _error = null;
    _successMessage = null;
    notifyListeners();
  }

  /// Nettoyer les messages
  void clearMessages() {
    _clearMessages();
  }

  // Méthodes de compatibilité pour l'ancien code existant
  Future<void> loadNews_old({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _news = [];
      _hasMorePages = true;
    }

    if (!_hasMorePages || _isLoading) return;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final newNews = await _newsService.fetchNews(
        categoryId: _selectedCategoryId,
        importance: _selectedImportance,
        university: _selectedUniversity,
        search: _searchQuery,
        page: _currentPage,
      );

      if (_currentPage == 1) {
        _news = newNews;
      } else {
        _news.addAll(newNews);
      }

      _currentPage++;
      _hasMorePages = newNews.isNotEmpty && newNews.length >= 20;

      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadCategories_old() async {
    try {
      _categories = await _newsService.fetchCategories();
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Méthodes pour compatibilité avec l'interface existante
  void filterByCategory(int? categoryId) {
    applyFilters(categoryId: categoryId);
  }

  void filterByImportance(String? importance) {
    applyFilters(importance: importance);
  }

  void clearFilters() {
    resetFilters();
  }

  // Nouvelles méthodes pour les filtres avancés

  /// Appliquer un filtre avancé complet
  Future<void> applyAdvancedFilter(NewsFilter filter) async {
    _selectedCategoryId = filter.category != null
        ? int.tryParse(filter.category!)
        : null;
    _selectedImportance = filter.importance;
    _selectedUniversity = filter.university;
    _selectedStatus = filter.status;
    _searchQuery = filter.search;

    // Pour les dates, on les convertit en paramètres de requête dans le service
    await loadNews(refresh: true);
  }

  /// Obtenir le filtre actuel
  NewsFilter getCurrentFilter() {
    return NewsFilter(
      category: _selectedCategoryId?.toString(),
      importance: _selectedImportance,
      university: _selectedUniversity,
      status: _selectedStatus,
      search: _searchQuery,
      // Les dates seront gérées plus tard si nécessaire
    );
  }

  /// Vérifier si des filtres sont actifs
  bool get hasActiveFilters {
    return _selectedCategoryId != null ||
        _selectedImportance != null ||
        _selectedUniversity != null ||
        _selectedStatus != null ||
        (_searchQuery != null && _searchQuery!.isNotEmpty);
  }

  /// Nombre de filtres actifs
  int get activeFiltersCount {
    int count = 0;
    if (_selectedCategoryId != null) count++;
    if (_selectedImportance != null) count++;
    if (_selectedUniversity != null) count++;
    if (_selectedStatus != null) count++;
    if (_searchQuery != null && _searchQuery!.isNotEmpty) count++;
    return count;
  }

  /// Obtenir un résumé textuel des filtres actifs
  List<String> get activeFiltersSummary {
    final List<String> summary = [];

    if (_selectedCategoryId != null) {
      final category = _categories.firstWhere(
        (c) => c.id == _selectedCategoryId,
        orElse: () => models.Category(
          id: _selectedCategoryId!,
          name: 'Catégorie #$_selectedCategoryId',
          color: '#0000FF',
          description: '',
          isActive: true,
        ),
      );
      summary.add('Catégorie: ${category.name}');
    }

    if (_selectedImportance != null) {
      summary.add('Importance: ${_getImportanceLabel(_selectedImportance!)}');
    }

    if (_selectedUniversity != null) {
      summary.add('Université: $_selectedUniversity');
    }

    if (_selectedStatus != null) {
      summary.add('Statut: ${_getStatusLabel(_selectedStatus!)}');
    }

    if (_searchQuery != null && _searchQuery!.isNotEmpty) {
      summary.add('Recherche: "$_searchQuery"');
    }

    return summary;
  }

  String _getImportanceLabel(String importance) {
    switch (importance) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'Élevée';
      case 'normal':
        return 'Normale';
      case 'low':
        return 'Faible';
      default:
        return importance;
    }
  }

  String _getStatusLabel(String status) {
    switch (status) {
      case 'published':
        return 'Publié';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  }
}
