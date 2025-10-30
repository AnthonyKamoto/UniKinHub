import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import '../providers/news_provider.dart';
import '../providers/auth_provider.dart';
import '../models/news.dart';
import '../models/news_filter.dart';
import 'news_detail_screen.dart';
import 'moderation_screen.dart';
import 'create_news_screen.dart';
import 'profile_screen.dart';
import 'advanced_filter_screen.dart';
import 'notification_preferences_screen.dart';
import 'login_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadInitialData();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _loadInitialData() {
    final newsProvider = Provider.of<NewsProvider>(context, listen: false);
    newsProvider.loadCategories();
    newsProvider.loadNews(refresh: true);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.8) {
      Provider.of<NewsProvider>(context, listen: false).loadNews();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('UniKinHub'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      drawer: _buildDrawer(),
      body: Column(
        children: [
          _buildSearchBar(),
          _buildCategoriesFilter(),
          Expanded(child: _buildNewsList()),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _refreshNews,
        child: const Icon(Icons.refresh),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Rechercher des actualités...',
          prefixIcon: const Icon(Icons.search),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    Provider.of<NewsProvider>(
                      context,
                      listen: false,
                    ).searchNews('');
                  },
                )
              : null,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(25)),
        ),
        onSubmitted: (value) {
          Provider.of<NewsProvider>(context, listen: false).searchNews(value);
        },
      ),
    );
  }

  Widget _buildCategoriesFilter() {
    return Consumer<NewsProvider>(
      builder: (context, newsProvider, child) {
        if (newsProvider.categories.isEmpty) {
          return const SizedBox.shrink();
        }

        return SizedBox(
          height: 50,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: newsProvider.categories.length + 1,
            itemBuilder: (context, index) {
              if (index == 0) {
                return _buildCategoryChip(
                  'Toutes',
                  newsProvider.selectedCategoryId == null,
                  () => newsProvider.filterByCategory(null),
                );
              }

              final category = newsProvider.categories[index - 1];
              return _buildCategoryChip(
                category.name,
                newsProvider.selectedCategoryId == category.id,
                () => newsProvider.filterByCategory(category.id),
                color: _parseColor(category.color),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildCategoryChip(
    String label,
    bool isSelected,
    VoidCallback onTap, {
    Color? color,
  }) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (_) => onTap(),
        backgroundColor: color?.withOpacity(0.1),
        selectedColor: color ?? Colors.blue,
        checkmarkColor: Colors.white,
        labelStyle: TextStyle(color: isSelected ? Colors.white : null),
      ),
    );
  }

  Widget _buildNewsList() {
    return Consumer<NewsProvider>(
      builder: (context, newsProvider, child) {
        if (newsProvider.isLoading && newsProvider.news.isEmpty) {
          return _buildShimmerLoading();
        }

        if (newsProvider.error != null && newsProvider.news.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
                const SizedBox(height: 16),
                Text('Erreur: ${newsProvider.error}'),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: _refreshNews,
                  child: const Text('Réessayer'),
                ),
              ],
            ),
          );
        }

        if (newsProvider.news.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.article_outlined, size: 80, color: Colors.grey[300]),
                const SizedBox(height: 24),
                Text(
                  'Aucune actualité trouvée',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[700],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Revenez plus tard pour voir les nouveautés',
                  style: TextStyle(fontSize: 14, color: Colors.grey[500]),
                ),
                const SizedBox(height: 32),
                ElevatedButton.icon(
                  onPressed: _refreshNews,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Actualiser'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _refreshNews,
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.all(16),
            itemCount:
                newsProvider.news.length + (newsProvider.hasMorePages ? 1 : 0),
            itemBuilder: (context, index) {
              if (index >= newsProvider.news.length) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: CircularProgressIndicator(),
                  ),
                );
              }

              final news = newsProvider.news[index];
              return _buildNewsCard(news);
            },
          ),
        );
      },
    );
  }

  Widget _buildShimmerLoading() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 80,
                        height: 24,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      const Spacer(),
                      Container(
                        width: 60,
                        height: 20,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    height: 20,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    height: 16,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 4),
                  Container(
                    width: double.infinity * 0.8,
                    height: 16,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Container(width: 100, height: 14, color: Colors.white),
                      const Spacer(),
                      Container(width: 60, height: 14, color: Colors.white),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildNewsCard(News news) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () => _navigateToDetail(news),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (news.image != null && news.image!.isNotEmpty)
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(12),
                ),
                child: Image.network(
                  'http://10.0.2.2:8000${news.image}',
                  width: double.infinity,
                  height: 200,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      height: 200,
                      color: Colors.grey[300],
                      child: const Icon(Icons.broken_image, size: 50),
                    );
                  },
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return Container(
                      height: 200,
                      color: Colors.grey[200],
                      child: Center(
                        child: CircularProgressIndicator(
                          value: loadingProgress.expectedTotalBytes != null
                              ? loadingProgress.cumulativeBytesLoaded /
                                    loadingProgress.expectedTotalBytes!
                              : null,
                        ),
                      ),
                    );
                  },
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: _parseColor(news.categoryColor),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          news.categoryName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const Spacer(),
                      _buildImportanceBadge(news.importance),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    news.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    news.content,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.person, size: 16, color: Colors.grey[600]),
                      const SizedBox(width: 4),
                      Text(
                        news.authorName,
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                      const Spacer(),
                      Text(
                        news.timeSince,
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildStatChip(
                        Icons.visibility,
                        news.viewsCount.toString(),
                      ),
                      const SizedBox(width: 8),
                      _buildStatChip(
                        Icons.favorite,
                        news.likesCount.toString(),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: Icon(
                          news.isLiked ? Icons.favorite : Icons.favorite_border,
                          color: news.isLiked ? Colors.red : null,
                        ),
                        onPressed: () => _toggleLike(news.id),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImportanceBadge(String importance) {
    Color color;
    switch (importance) {
      case 'urgent':
        color = Colors.red;
        break;
      case 'high':
        color = Colors.orange;
        break;
      case 'medium':
        color = Colors.blue;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        border: Border.all(color: color),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        _getImportanceText(importance),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildStatChip(IconData icon, String count) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: Colors.grey[600]),
        const SizedBox(width: 2),
        Text(count, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
      ],
    );
  }

  Color _parseColor(String colorStr) {
    try {
      return Color(int.parse(colorStr.substring(1, 7), radix: 16) + 0xFF000000);
    } catch (e) {
      return Colors.blue;
    }
  }

  String _getImportanceText(String importance) {
    switch (importance) {
      case 'urgent':
        return 'URGENT';
      case 'high':
        return 'ÉLEVÉE';
      case 'medium':
        return 'MOYENNE';
      case 'low':
        return 'FAIBLE';
      default:
        return importance.toUpperCase();
    }
  }

  void _navigateToDetail(News news) {
    HapticFeedback.lightImpact();
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => NewsDetailScreen(newsId: news.id),
      ),
    );
  }

  Future<void> _refreshNews() async {
    await Provider.of<NewsProvider>(
      context,
      listen: false,
    ).loadNews(refresh: true);
  }

  void _toggleLike(int newsId) {
    HapticFeedback.mediumImpact();
    Provider.of<NewsProvider>(context, listen: false).toggleLike(newsId);
  }

  void _showFilterDialog() async {
    final newsProvider = Provider.of<NewsProvider>(context, listen: false);
    final currentFilter = newsProvider.getCurrentFilter();

    final NewsFilter? result = await Navigator.push<NewsFilter>(
      context,
      MaterialPageRoute(
        builder: (context) =>
            AdvancedFilterScreen(currentFilter: currentFilter),
      ),
    );

    if (result != null) {
      await newsProvider.applyAdvancedFilter(result);
    }
  }

  Widget _buildDrawer() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final user = authProvider.currentUser;

        return Drawer(
          child: Column(
            children: [
              UserAccountsDrawerHeader(
                accountName: Text(user?.username ?? 'Utilisateur'),
                accountEmail: Text(user?.email ?? ''),
                currentAccountPicture: CircleAvatar(
                  backgroundColor: Colors.white,
                  child: Text(
                    (user?.username ?? 'U')[0].toUpperCase(),
                    style: const TextStyle(fontSize: 24, color: Colors.blue),
                  ),
                ),
                decoration: const BoxDecoration(color: Colors.blue),
              ),
              Expanded(
                child: ListView(
                  padding: EdgeInsets.zero,
                  children: [
                    ListTile(
                      leading: const Icon(Icons.home),
                      title: const Text('Accueil'),
                      onTap: () => Navigator.pop(context),
                    ),
                    ListTile(
                      leading: const Icon(Icons.add),
                      title: const Text('Créer une actualité'),
                      onTap: () {
                        HapticFeedback.mediumImpact();
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const CreateNewsScreen(),
                          ),
                        );
                      },
                    ),
                    if (user != null &&
                        (user.role == 'moderator' || user.role == 'admin'))
                      ListTile(
                        leading: const Icon(Icons.verified_user),
                        title: const Text('Modération'),
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ModerationScreen(),
                            ),
                          );
                        },
                      ),
                    if (user != null && user.role == 'admin')
                      ListTile(
                        leading: const Icon(Icons.admin_panel_settings),
                        title: const Text('Administration'),
                        onTap: () {
                          Navigator.pop(context);
                          _showComingSoon('Administration');
                        },
                      ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.person),
                      title: const Text('Profil'),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ProfileScreen(),
                          ),
                        );
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.notifications),
                      title: const Text('Préférences notifications'),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                const NotificationPreferencesScreen(),
                          ),
                        );
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.settings),
                      title: const Text('Paramètres'),
                      onTap: () {
                        Navigator.pop(context);
                        _showComingSoon('Paramètres');
                      },
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.logout, color: Colors.red),
                      title: const Text(
                        'Déconnexion',
                        style: TextStyle(color: Colors.red),
                      ),
                      onTap: () {
                        Navigator.pop(context);
                        _showLogoutDialog();
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature - Fonctionnalité à venir'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Déconnexion'),
        content: const Text('Êtes-vous sûr de vouloir vous déconnecter ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context); // Fermer le dialog
              await Provider.of<AuthProvider>(context, listen: false).logout();

              // Rediriger vers l'écran de login
              if (mounted) {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text(
              'Déconnexion',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
