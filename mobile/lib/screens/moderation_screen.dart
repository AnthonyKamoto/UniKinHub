import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/news_provider.dart';
import '../models/news.dart';
import '../services/news_service.dart';

class ModerationScreen extends StatefulWidget {
  const ModerationScreen({super.key});

  @override
  State<ModerationScreen> createState() => _ModerationScreenState();
}

class _ModerationScreenState extends State<ModerationScreen> {
  final NewsService _newsService = NewsService();
  List<News> _pendingNews = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPendingNews();
  }

  Future<void> _loadPendingNews() async {
    setState(() => _isLoading = true);

    try {
      final result = await _newsService.getPendingNews();
      if (result['success']) {
        setState(() {
          _pendingNews = result['news'] as List<News>;
        });
      } else {
        _showError(result['error']);
      }
    } catch (e) {
      _showError('Erreur de chargement: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.green),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;

    // Vérifier si l'utilisateur est modérateur ou admin
    if (user == null || (user.role != 'moderator' && user.role != 'admin')) {
      return Scaffold(
        appBar: AppBar(title: const Text('Modération')),
        body: const Center(
          child: Text(
            'Accès refusé\nVous devez être modérateur ou administrateur',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Modération des actualités'),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadPendingNews,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _pendingNews.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle, size: 64, color: Colors.green),
                  SizedBox(height: 16),
                  Text(
                    'Aucune actualité en attente',
                    style: TextStyle(fontSize: 18),
                  ),
                  Text(
                    'Toutes les actualités ont été modérées',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            )
          : RefreshIndicator(
              onRefresh: _loadPendingNews,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _pendingNews.length,
                itemBuilder: (context, index) {
                  final news = _pendingNews[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // En-tête avec informations de base
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.surfaceVariant,
                            borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(12),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      news.title,
                                      style: Theme.of(
                                        context,
                                      ).textTheme.titleLarge,
                                    ),
                                  ),
                                  _buildImportanceBadge(news.importance),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Icon(
                                    Icons.person,
                                    size: 16,
                                    color: Colors.grey[600],
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    news.authorName,
                                    style: TextStyle(color: Colors.grey[600]),
                                  ),
                                  const SizedBox(width: 16),
                                  Icon(
                                    Icons.access_time,
                                    size: 16,
                                    color: Colors.grey[600],
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    _formatDate(news.createdAt),
                                    style: TextStyle(color: Colors.grey[600]),
                                  ),
                                ],
                              ),
                              if (news.categoryName.isNotEmpty) ...[
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.secondary,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    news.categoryName,
                                    style: TextStyle(
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.onSecondary,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),

                        // Contenu de l'actualité
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Contenu:',
                                style: Theme.of(context).textTheme.titleMedium,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                news.content,
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),

                              if (news.image?.isNotEmpty == true) ...[
                                const SizedBox(height: 12),
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Image.network(
                                    news.image!,
                                    height: 200,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                    errorBuilder:
                                        (context, error, stackTrace) =>
                                            Container(
                                              height: 200,
                                              color: Colors.grey[300],
                                              child: const Icon(
                                                Icons.broken_image,
                                              ),
                                            ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),

                        // Boutons d'action
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: () =>
                                      _showModerationDialog(news, 'reject'),
                                  icon: const Icon(Icons.close),
                                  label: const Text('Rejeter'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red,
                                    foregroundColor: Colors.white,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: () =>
                                      _showModerationDialog(news, 'approve'),
                                  icon: const Icon(Icons.check),
                                  label: const Text('Approuver'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.green,
                                    foregroundColor: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
    );
  }

  Widget _buildImportanceBadge(String importance) {
    Color color;
    IconData icon;

    switch (importance.toLowerCase()) {
      case 'urgent':
        color = Colors.red;
        icon = Icons.priority_high;
        break;
      case 'high':
        color = Colors.orange;
        icon = Icons.arrow_upward;
        break;
      case 'normal':
        color = Colors.blue;
        icon = Icons.info;
        break;
      case 'low':
        color = Colors.grey;
        icon = Icons.arrow_downward;
        break;
      default:
        color = Colors.blue;
        icon = Icons.info;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: Colors.white),
          const SizedBox(width: 4),
          Text(
            importance.toUpperCase(),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }

  void _showModerationDialog(News news, String action) {
    final TextEditingController reasonController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          action == 'approve'
              ? 'Approuver l\'actualité'
              : 'Rejeter l\'actualité',
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Actualité: "${news.title}"',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            if (action == 'reject') ...[
              const Text('Raison du rejet (optionnel):'),
              const SizedBox(height: 8),
              TextField(
                controller: reasonController,
                decoration: const InputDecoration(
                  hintText: 'Expliquez pourquoi cette actualité est rejetée...',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
            ] else ...[
              const Text('Confirmez-vous l\'approbation de cette actualité ?'),
              const SizedBox(height: 8),
              TextField(
                controller: reasonController,
                decoration: const InputDecoration(
                  hintText: 'Commentaire d\'approbation (optionnel)...',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () => _moderateNews(news, action, reasonController.text),
            style: ElevatedButton.styleFrom(
              backgroundColor: action == 'approve' ? Colors.green : Colors.red,
              foregroundColor: Colors.white,
            ),
            child: Text(action == 'approve' ? 'Approuver' : 'Rejeter'),
          ),
        ],
      ),
    );
  }

  Future<void> _moderateNews(News news, String action, String reason) async {
    Navigator.of(context).pop(); // Fermer le dialog

    try {
      final result = await _newsService.moderateNews(
        newsId: news.id,
        action: action,
        reason: reason.isEmpty ? null : reason,
      );

      if (result['success']) {
        _showSuccess(result['message']);
        // Recharger la liste
        _loadPendingNews();

        // Mettre à jour le provider global si nécessaire
        if (mounted) {
          Provider.of<NewsProvider>(context, listen: false).loadNews();
        }
      } else {
        _showError(result['error']);
      }
    } catch (e) {
      _showError('Erreur lors de la modération: $e');
    }
  }
}
