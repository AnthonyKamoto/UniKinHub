import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/news_provider.dart';
import '../providers/auth_provider.dart';
import '../models/category.dart' as models;

class CreateNewsScreen extends StatefulWidget {
  const CreateNewsScreen({super.key});

  @override
  State<CreateNewsScreen> createState() => _CreateNewsScreenState();
}

class _CreateNewsScreenState extends State<CreateNewsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  final _imageUrlController = TextEditingController();

  models.Category? _selectedCategory;
  String _selectedImportance = 'normal';
  bool _isLoading = false;

  final List<String> _importanceOptions = ['normal', 'high', 'urgent'];

  final Map<String, String> _importanceLabels = {
    'normal': 'Normal',
    'high': 'Important',
    'urgent': 'Urgent',
  };

  @override
  void initState() {
    super.initState();
    // Charger les catégories si elles ne sont pas déjà chargées
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final newsProvider = Provider.of<NewsProvider>(context, listen: false);
      if (newsProvider.categories.isEmpty) {
        newsProvider.loadCategories();
      }
    });
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    _imageUrlController.dispose();
    super.dispose();
  }

  Future<void> _createNews() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Veuillez sélectionner une catégorie'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    final newsProvider = Provider.of<NewsProvider>(context, listen: false);

    final success = await newsProvider.createNews(
      title: _titleController.text.trim(),
      content: _contentController.text.trim(),
      categoryId: _selectedCategory!.id,
      imageUrl: _imageUrlController.text.trim().isEmpty
          ? null
          : _imageUrlController.text.trim(),
      importance: _selectedImportance,
    );

    setState(() {
      _isLoading = false;
    });

    if (success) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              newsProvider.successMessage ?? 'Actualité créée avec succès',
            ),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.of(context).pop();
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(newsProvider.error ?? 'Erreur lors de la création'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Créer une actualité'),
        actions: [
          if (_isLoading)
            const Center(
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            )
          else
            TextButton(onPressed: _createNews, child: const Text('Publier')),
        ],
      ),
      body: Consumer2<NewsProvider, AuthProvider>(
        builder: (context, newsProvider, authProvider, child) {
          if (newsProvider.isLoading && newsProvider.categories.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Information utilisateur
                  if (authProvider.currentUser != null)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          children: [
                            CircleAvatar(
                              backgroundColor: Theme.of(context).primaryColor,
                              child: Text(
                                authProvider.currentUser!.firstName[0],
                                style: const TextStyle(color: Colors.white),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${authProvider.currentUser!.firstName} ${authProvider.currentUser!.lastName}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  authProvider.currentUser!.university,
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  const SizedBox(height: 16),

                  // Titre
                  TextFormField(
                    controller: _titleController,
                    decoration: const InputDecoration(
                      labelText: 'Titre *',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.title),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Titre requis';
                      }
                      if (value.trim().length < 10) {
                        return 'Le titre doit contenir au moins 10 caractères';
                      }
                      return null;
                    },
                    enabled: !_isLoading,
                    maxLines: 2,
                  ),
                  const SizedBox(height: 16),

                  // Catégorie
                  DropdownButtonFormField<models.Category>(
                    value: _selectedCategory,
                    decoration: const InputDecoration(
                      labelText: 'Catégorie *',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.category),
                    ),
                    items: newsProvider.categories.map((category) {
                      return DropdownMenuItem(
                        value: category,
                        child: Row(
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                color: Color(
                                  int.parse(
                                    '0xFF${category.color.substring(1)}',
                                  ),
                                ),
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(category.name),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: _isLoading
                        ? null
                        : (category) {
                            setState(() {
                              _selectedCategory = category;
                            });
                          },
                    validator: (value) {
                      if (value == null) {
                        return 'Catégorie requise';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Importance
                  DropdownButtonFormField<String>(
                    value: _selectedImportance,
                    decoration: const InputDecoration(
                      labelText: 'Importance',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.priority_high),
                    ),
                    items: _importanceOptions.map((importance) {
                      return DropdownMenuItem(
                        value: importance,
                        child: Row(
                          children: [
                            Icon(
                              importance == 'urgent'
                                  ? Icons.warning
                                  : importance == 'high'
                                  ? Icons.priority_high
                                  : Icons.info,
                              color: importance == 'urgent'
                                  ? Colors.red
                                  : importance == 'high'
                                  ? Colors.orange
                                  : Colors.blue,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(_importanceLabels[importance] ?? importance),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: _isLoading
                        ? null
                        : (importance) {
                            setState(() {
                              _selectedImportance = importance!;
                            });
                          },
                  ),
                  const SizedBox(height: 16),

                  // Contenu
                  TextFormField(
                    controller: _contentController,
                    decoration: const InputDecoration(
                      labelText: 'Contenu *',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.description),
                      alignLabelWithHint: true,
                    ),
                    maxLines: 8,
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Contenu requis';
                      }
                      if (value.trim().length < 50) {
                        return 'Le contenu doit contenir au moins 50 caractères';
                      }
                      return null;
                    },
                    enabled: !_isLoading,
                  ),
                  const SizedBox(height: 16),

                  // Image URL (optionnel)
                  TextFormField(
                    controller: _imageUrlController,
                    decoration: const InputDecoration(
                      labelText: 'URL de l\'image (optionnel)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.image),
                      hintText: 'https://exemple.com/image.jpg',
                    ),
                    validator: (value) {
                      if (value != null && value.trim().isNotEmpty) {
                        final uri = Uri.tryParse(value);
                        if (uri?.hasAbsolutePath != true) {
                          return 'URL invalide';
                        }
                      }
                      return null;
                    },
                    enabled: !_isLoading,
                  ),
                  const SizedBox(height: 24),

                  // Information sur la modération
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.blue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Colors.blue.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.info_outline,
                          color: Colors.blue[700],
                          size: 24,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Processus de modération',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.blue[700],
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Votre actualité sera examinée par notre équipe de modération avant d\'être publiée. Vous recevrez une notification une fois qu\'elle sera approuvée ou si des modifications sont nécessaires.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.blue[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Bouton de création
                  ElevatedButton.icon(
                    onPressed: _isLoading ? null : _createNews,
                    icon: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.publish),
                    label: Text(
                      _isLoading ? 'Publication...' : 'Publier l\'actualité',
                    ),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
