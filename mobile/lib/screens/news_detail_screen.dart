import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/news_provider.dart';
import '../models/news.dart';

class NewsDetailScreen extends StatefulWidget {
  final int newsId;

  const NewsDetailScreen({super.key, required this.newsId});

  @override
  State<NewsDetailScreen> createState() => _NewsDetailScreenState();
}

class _NewsDetailScreenState extends State<NewsDetailScreen> {
  News? _news;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadNewsDetail();
  }

  Future<void> _loadNewsDetail() async {
    try {
      final newsProvider = Provider.of<NewsProvider>(context, listen: false);
      final news = await newsProvider.getNewsById(widget.newsId);

      if (mounted) {
        setState(() {
          _news = news;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Détail de l\'actualité'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          if (_news != null)
            IconButton(
              icon: Icon(
                _news!.isLiked ? Icons.favorite : Icons.favorite_border,
                color: _news!.isLiked ? Colors.red : Colors.white,
              ),
              onPressed: () => _toggleLike(),
            ),
        ],
      ),
      body: _buildBody(),
      floatingActionButton: _news != null
          ? FloatingActionButton(
              onPressed: () => _shareNews(),
              child: const Icon(Icons.share),
            )
          : null,
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
            const SizedBox(height: 16),
            Text('Erreur: $_error'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadNewsDetail,
              child: const Text('Réessayer'),
            ),
          ],
        ),
      );
    }

    if (_news == null) {
      return const Center(child: Text('Actualité non trouvée'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(),
          const SizedBox(height: 16),
          _buildContent(),
          const SizedBox(height: 16),
          _buildStats(),
          const SizedBox(height: 16),
          _buildMetadata(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _parseColor(_news!.categoryColor),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                _news!.categoryName,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const Spacer(),
            _buildImportanceBadge(_news!.importance),
          ],
        ),
        const SizedBox(height: 16),
        Text(
          _news!.title,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Icon(Icons.person, size: 16, color: Colors.grey[600]),
            const SizedBox(width: 4),
            Text(_news!.authorName, style: TextStyle(color: Colors.grey[600])),
            const SizedBox(width: 16),
            Icon(Icons.schedule, size: 16, color: Colors.grey[600]),
            const SizedBox(width: 4),
            Text(_news!.timeSince, style: TextStyle(color: Colors.grey[600])),
          ],
        ),
      ],
    );
  }

  Widget _buildContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_news!.image != null) ...[
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.network(
              _news!.image!,
              width: double.infinity,
              height: 200,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  width: double.infinity,
                  height: 200,
                  color: Colors.grey[300],
                  child: const Icon(Icons.image_not_supported, size: 64),
                );
              },
            ),
          ),
          const SizedBox(height: 16),
        ],
        Text(_news!.content, style: const TextStyle(fontSize: 16, height: 1.6)),
        if (_news!.attachment != null) ...[
          const SizedBox(height: 16),
          Card(
            child: ListTile(
              leading: const Icon(Icons.attach_file),
              title: const Text('Pièce jointe'),
              subtitle: Text(_news!.attachment!.split('/').last),
              trailing: const Icon(Icons.download),
              onTap: () {
                // Implémenter le téléchargement
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Téléchargement non implémenté'),
                  ),
                );
              },
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildStats() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildStatItem(
              Icons.visibility,
              'Vues',
              _news!.viewsCount.toString(),
            ),
            _buildStatItem(
              Icons.favorite,
              'Likes',
              _news!.likesCount.toString(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(IconData icon, String label, String value) {
    return Column(
      children: [
        Icon(icon, color: Colors.blue),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
      ],
    );
  }

  Widget _buildMetadata() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Informations',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            if (_news!.targetUniversities.isNotEmpty) ...[
              _buildMetadataItem(
                'Universités ciblées',
                _news!.targetUniversities.join(', '),
              ),
              const SizedBox(height: 8),
            ],
            if (_news!.targetPrograms.isNotEmpty) ...[
              _buildMetadataItem(
                'Programmes ciblés',
                _news!.targetPrograms.join(', '),
              ),
              const SizedBox(height: 8),
            ],
            _buildMetadataItem(
              'Publié le',
              _formatDate(_news!.publishDate ?? _news!.createdAt),
            ),
            if (_news!.expiryDate != null) ...[
              const SizedBox(height: 8),
              _buildMetadataItem('Expire le', _formatDate(_news!.expiryDate!)),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildMetadataItem(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Text(
            '$label:',
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
        ),
        Expanded(child: Text(value)),
      ],
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
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        border: Border.all(color: color),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        _getImportanceText(importance),
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
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

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} à ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }

  void _toggleLike() {
    if (_news != null) {
      Provider.of<NewsProvider>(context, listen: false).toggleLike(_news!.id);
      setState(() {
        // Créer une nouvelle instance avec les valeurs mises à jour
        _news = News.fromJson({
          ..._news!.toJson(),
          'is_liked': !_news!.isLiked,
          'likes_count': _news!.isLiked
              ? _news!.likesCount - 1
              : _news!.likesCount + 1,
        });
      });
    }
  }

  void _shareNews() {
    if (_news != null) {
      // Implémenter le partage
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Partage non implémenté')));
    }
  }
}
