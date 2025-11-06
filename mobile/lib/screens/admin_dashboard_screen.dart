import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/admin_service.dart';
import '../models/user.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final AdminService _adminService = AdminService();

  bool _isLoading = true;
  Map<String, dynamic> _dashboardStats = {};
  List<User> _users = [];
  List<dynamic> _news = [];
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadDashboardData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final stats = await _adminService.getDashboardStats();
      final users = await _adminService.getAllUsers();
      final news = await _adminService.getAllNews();

      if (mounted) {
        setState(() {
          _dashboardStats = stats;
          _users = users;
          _news = news;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Erreur de chargement: $e';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;

    // Vérifier si l'utilisateur est admin
    if (user?.role != 'admin') {
      return Scaffold(
        appBar: AppBar(title: const Text('Administration')),
        body: const Center(
          child: Text('Accès refusé - Réservé aux administrateurs'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tableau de bord Administration'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadDashboardData,
            tooltip: 'Actualiser',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(icon: Icon(Icons.dashboard), text: 'Vue d\'ensemble'),
            Tab(icon: Icon(Icons.people), text: 'Utilisateurs'),
            Tab(icon: Icon(Icons.article), text: 'Actualités'),
            Tab(icon: Icon(Icons.analytics), text: 'Statistiques'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  Text(_errorMessage!),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loadDashboardData,
                    child: const Text('Réessayer'),
                  ),
                ],
              ),
            )
          : TabBarView(
              controller: _tabController,
              children: [
                _buildOverviewTab(),
                _buildUsersTab(),
                _buildNewsTab(),
                _buildStatsTab(),
              ],
            ),
    );
  }

  Widget _buildOverviewTab() {
    return RefreshIndicator(
      onRefresh: _loadDashboardData,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cartes de statistiques
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.6,
              children: [
                _buildStatCard(
                  'Utilisateurs totaux',
                  '${_dashboardStats['total_users'] ?? 0}',
                  Icons.people,
                  Colors.blue,
                ),
                _buildStatCard(
                  'Actualités',
                  '${_dashboardStats['total_news'] ?? 0}',
                  Icons.article,
                  Colors.green,
                ),
                _buildStatCard(
                  'En attente',
                  '${_dashboardStats['pending_news'] ?? 0}',
                  Icons.pending,
                  Colors.orange,
                ),
                _buildStatCard(
                  'Catégories actives',
                  '${_dashboardStats['active_categories'] ?? 0}',
                  Icons.category,
                  Colors.purple,
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Activité récente
            Text(
              'Activité récente',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            _buildRecentActivity(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 24, color: color),
            const SizedBox(height: 4),
            Text(
              value,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              title,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodySmall,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentActivity() {
    final recentNews = _news.take(5).toList();

    if (recentNews.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Text('Aucune activité récente'),
        ),
      );
    }

    return Card(
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: recentNews.length,
        separatorBuilder: (context, index) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final news = recentNews[index];
          return ListTile(
            leading: CircleAvatar(
              backgroundColor: _getStatusColor(news['status']),
              child: Icon(
                _getStatusIcon(news['status']),
                color: Colors.white,
                size: 20,
              ),
            ),
            title: Text(
              news['title'] ?? 'Sans titre',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            subtitle: Text(
              'Par ${news['author_name'] ?? 'Inconnu'} - ${news['status'] ?? ''}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: Text(
              news['time_since'] ?? '',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          );
        },
      ),
    );
  }

  Widget _buildUsersTab() {
    return RefreshIndicator(
      onRefresh: _loadDashboardData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _users.length,
        itemBuilder: (context, index) {
          final user = _users[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: _getUserRoleColor(user.role),
                child: Text(
                  user.username[0].toUpperCase(),
                  style: const TextStyle(color: Colors.white),
                ),
              ),
              title: Text('${user.firstName} ${user.lastName}'),
              subtitle: Text('${user.email}\n${_getRoleLabel(user.role)}'),
              isThreeLine: true,
              trailing: PopupMenuButton(
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'edit',
                    child: Row(
                      children: [
                        Icon(Icons.edit, size: 20),
                        SizedBox(width: 8),
                        Text('Modifier'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'deactivate',
                    child: Row(
                      children: [
                        Icon(Icons.block, size: 20),
                        SizedBox(width: 8),
                        Text('Désactiver'),
                      ],
                    ),
                  ),
                ],
                onSelected: (value) {
                  if (value == 'edit') {
                    _showEditUserDialog(user);
                  } else if (value == 'deactivate') {
                    _showDeactivateUserDialog(user);
                  }
                },
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildNewsTab() {
    return RefreshIndicator(
      onRefresh: _loadDashboardData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _news.length,
        itemBuilder: (context, index) {
          final news = _news[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: _getStatusColor(news['status']),
                child: Icon(
                  _getStatusIcon(news['status']),
                  color: Colors.white,
                  size: 20,
                ),
              ),
              title: Text(
                news['title'] ?? 'Sans titre',
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Par ${news['author_name'] ?? 'Inconnu'}'),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Chip(
                        label: Text(
                          _getStatusLabel(news['status']),
                          style: const TextStyle(fontSize: 11),
                        ),
                        backgroundColor: _getStatusColor(news['status']),
                        padding: EdgeInsets.zero,
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        news['time_since'] ?? '',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ],
              ),
              isThreeLine: true,
              trailing: PopupMenuButton(
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'view',
                    child: Row(
                      children: [
                        Icon(Icons.visibility, size: 20),
                        SizedBox(width: 8),
                        Text('Voir'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(Icons.delete, color: Colors.red, size: 20),
                        SizedBox(width: 8),
                        Text('Supprimer', style: TextStyle(color: Colors.red)),
                      ],
                    ),
                  ),
                ],
                onSelected: (value) {
                  if (value == 'view') {
                    // Navigation vers détail
                  } else if (value == 'delete') {
                    _showDeleteNewsDialog(news);
                  }
                },
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatsTab() {
    return RefreshIndicator(
      onRefresh: _loadDashboardData,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Catégories populaires',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            _buildPopularCategories(),
            const SizedBox(height: 24),

            Text('Tendances', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            _buildTrendsChart(),
          ],
        ),
      ),
    );
  }

  Widget _buildPopularCategories() {
    final categories = _dashboardStats['popular_categories'] as List? ?? [];

    if (categories.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Text('Aucune donnée disponible'),
        ),
      );
    }

    return Card(
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: categories.length,
        separatorBuilder: (context, index) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final category = categories[index];
          final colorString = category['color'] as String?;
          final color = colorString != null && colorString.isNotEmpty
              ? Color(int.parse(colorString.replaceAll('#', '0xff')))
              : Colors.grey;

          return ListTile(
            leading: CircleAvatar(backgroundColor: color, radius: 16),
            title: Text(category['name'] ?? 'Sans nom'),
            trailing: Text(
              '${category['news_count'] ?? 0} actualités',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          );
        },
      ),
    );
  }

  Widget _buildTrendsChart() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildTrendItem(
                  'Vues',
                  _dashboardStats['total_views'] ?? 0,
                  Colors.blue,
                ),
                _buildTrendItem(
                  'Likes',
                  _dashboardStats['total_likes'] ?? 0,
                  Colors.red,
                ),
                _buildTrendItem(
                  'Commentaires',
                  _dashboardStats['total_comments'] ?? 0,
                  Colors.green,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrendItem(String label, int value, Color color) {
    return Column(
      children: [
        Icon(
          label == 'Vues'
              ? Icons.visibility
              : label == 'Likes'
              ? Icons.favorite
              : Icons.comment,
          color: color,
          size: 32,
        ),
        const SizedBox(height: 8),
        Text(
          value.toString(),
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }

  // Helpers
  Color _getStatusColor(String? status) {
    switch (status) {
      case 'published':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'rejected':
        return Colors.red;
      case 'draft':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String? status) {
    switch (status) {
      case 'published':
        return Icons.check_circle;
      case 'pending':
        return Icons.pending;
      case 'rejected':
        return Icons.cancel;
      case 'draft':
        return Icons.edit;
      default:
        return Icons.help;
    }
  }

  String _getStatusLabel(String? status) {
    switch (status) {
      case 'published':
        return 'Publié';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      case 'draft':
        return 'Brouillon';
      default:
        return status ?? 'Inconnu';
    }
  }

  Color _getUserRoleColor(String? role) {
    switch (role) {
      case 'admin':
        return Colors.red;
      case 'moderator':
        return Colors.orange;
      case 'publisher':
        return Colors.blue;
      case 'student':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  String _getRoleLabel(String? role) {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'moderator':
        return 'Modérateur';
      case 'publisher':
        return 'Enseignant';
      case 'student':
        return 'Étudiant';
      default:
        return role ?? 'Inconnu';
    }
  }

  // Dialogs
  void _showEditUserDialog(User user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Modifier l\'utilisateur'),
        content: const Text('Fonctionnalité à venir'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  void _showDeactivateUserDialog(User user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Désactiver l\'utilisateur'),
        content: Text('Voulez-vous désactiver ${user.username} ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Implémenter la désactivation
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Fonctionnalité à venir')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Désactiver'),
          ),
        ],
      ),
    );
  }

  void _showDeleteNewsDialog(dynamic news) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Supprimer l\'actualité'),
        content: Text('Voulez-vous supprimer "${news['title']}" ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Implémenter la suppression
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Fonctionnalité à venir')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Supprimer'),
          ),
        ],
      ),
    );
  }
}
