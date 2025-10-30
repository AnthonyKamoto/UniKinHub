import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/news_filter.dart';
import '../providers/news_provider.dart';

class AdvancedFilterScreen extends StatefulWidget {
  final NewsFilter currentFilter;

  const AdvancedFilterScreen({super.key, required this.currentFilter});

  @override
  State<AdvancedFilterScreen> createState() => _AdvancedFilterScreenState();
}

class _AdvancedFilterScreenState extends State<AdvancedFilterScreen> {
  late NewsFilter _filter;
  final TextEditingController _searchController = TextEditingController();
  DateTime? _startDate;
  DateTime? _endDate;

  // Listes des options
  final List<String> _importanceOptions = ['urgent', 'high', 'normal', 'low'];

  final List<String> _universityOptions = [
    'UNIKIN',
    'UPN',
    'ISTA',
    'ULC',
    'AUTRES',
  ];

  final List<String> _statusOptions = ['published', 'pending', 'rejected'];

  @override
  void initState() {
    super.initState();
    _filter = widget.currentFilter;
    _searchController.text = _filter.search ?? '';
    _startDate = _filter.startDate;
    _endDate = _filter.endDate;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Filtres avancés'),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
        actions: [
          TextButton(
            onPressed: _clearAllFilters,
            child: const Text('Tout effacer'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle('Recherche'),
            _buildSearchField(),
            const SizedBox(height: 24),

            _buildSectionTitle('Catégorie'),
            _buildCategoryFilter(),
            const SizedBox(height: 24),

            _buildSectionTitle('Importance'),
            _buildImportanceFilter(),
            const SizedBox(height: 24),

            _buildSectionTitle('Université'),
            _buildUniversityFilter(),
            const SizedBox(height: 24),

            _buildSectionTitle('Statut'),
            _buildStatusFilter(),
            const SizedBox(height: 24),

            _buildSectionTitle('Période'),
            _buildDateRangeFilter(),
            const SizedBox(height: 24),

            _buildFilterSummary(),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Annuler'),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ElevatedButton(
                onPressed: _applyFilters,
                child: const Text('Appliquer'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.bold,
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }

  Widget _buildSearchField() {
    return TextField(
      controller: _searchController,
      decoration: const InputDecoration(
        hintText: 'Rechercher dans le titre ou le contenu...',
        prefixIcon: Icon(Icons.search),
        border: OutlineInputBorder(),
      ),
      onChanged: (value) {
        setState(() {
          _filter = _filter.copyWith(search: value.isEmpty ? null : value);
        });
      },
    );
  }

  Widget _buildCategoryFilter() {
    return Consumer<NewsProvider>(
      builder: (context, newsProvider, child) {
        final categories = newsProvider.categories;

        return Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilterChip(
              label: const Text('Toutes'),
              selected: _filter.category == null,
              onSelected: (selected) {
                setState(() {
                  _filter = _filter.copyWith(category: null);
                });
              },
            ),
            ...categories.map(
              (category) => FilterChip(
                label: Text(category.name),
                selected: _filter.category == category.id.toString(),
                onSelected: (selected) {
                  setState(() {
                    _filter = _filter.copyWith(
                      category: selected ? category.id.toString() : null,
                    );
                  });
                },
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildImportanceFilter() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilterChip(
          label: const Text('Toutes'),
          selected: _filter.importance == null,
          onSelected: (selected) {
            setState(() {
              _filter = _filter.copyWith(importance: null);
            });
          },
        ),
        ..._importanceOptions.map(
          (importance) => FilterChip(
            label: Text(_getImportanceLabel(importance)),
            selected: _filter.importance == importance,
            backgroundColor: _getImportanceColor(importance).withOpacity(0.1),
            selectedColor: _getImportanceColor(importance),
            checkmarkColor: Colors.white,
            labelStyle: TextStyle(
              color: _filter.importance == importance ? Colors.white : null,
            ),
            onSelected: (selected) {
              setState(() {
                _filter = _filter.copyWith(
                  importance: selected ? importance : null,
                );
              });
            },
          ),
        ),
      ],
    );
  }

  Widget _buildUniversityFilter() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilterChip(
          label: const Text('Toutes'),
          selected: _filter.university == null,
          onSelected: (selected) {
            setState(() {
              _filter = _filter.copyWith(university: null);
            });
          },
        ),
        ..._universityOptions.map(
          (university) => FilterChip(
            label: Text(university),
            selected: _filter.university == university,
            onSelected: (selected) {
              setState(() {
                _filter = _filter.copyWith(
                  university: selected ? university : null,
                );
              });
            },
          ),
        ),
      ],
    );
  }

  Widget _buildStatusFilter() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilterChip(
          label: const Text('Tous'),
          selected: _filter.status == null,
          onSelected: (selected) {
            setState(() {
              _filter = _filter.copyWith(status: null);
            });
          },
        ),
        ..._statusOptions.map(
          (status) => FilterChip(
            label: Text(_getStatusLabel(status)),
            selected: _filter.status == status,
            backgroundColor: _getStatusColor(status).withOpacity(0.1),
            selectedColor: _getStatusColor(status),
            checkmarkColor: Colors.white,
            labelStyle: TextStyle(
              color: _filter.status == status ? Colors.white : null,
            ),
            onSelected: (selected) {
              setState(() {
                _filter = _filter.copyWith(status: selected ? status : null);
              });
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDateRangeFilter() {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: InkWell(
                onTap: () => _selectStartDate(),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    vertical: 16,
                    horizontal: 12,
                  ),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        _startDate != null
                            ? _formatDate(_startDate!)
                            : 'Date de début',
                        style: TextStyle(
                          color: _startDate != null ? null : Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: InkWell(
                onTap: () => _selectEndDate(),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    vertical: 16,
                    horizontal: 12,
                  ),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        _endDate != null
                            ? _formatDate(_endDate!)
                            : 'Date de fin',
                        style: TextStyle(
                          color: _endDate != null ? null : Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        if (_startDate != null || _endDate != null) ...[
          const SizedBox(height: 8),
          Row(
            children: [
              if (_startDate != null)
                TextButton(
                  onPressed: () {
                    setState(() {
                      _startDate = null;
                      _filter = _filter.copyWith(startDate: null);
                    });
                  },
                  child: const Text('Effacer début'),
                ),
              if (_endDate != null)
                TextButton(
                  onPressed: () {
                    setState(() {
                      _endDate = null;
                      _filter = _filter.copyWith(endDate: null);
                    });
                  },
                  child: const Text('Effacer fin'),
                ),
            ],
          ),
        ],
      ],
    );
  }

  Widget _buildFilterSummary() {
    if (_filter.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Row(
          children: [
            Icon(Icons.info_outline, color: Colors.grey),
            SizedBox(width: 8),
            Text('Aucun filtre actif'),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primaryContainer.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Theme.of(context).colorScheme.primary.withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.filter_list,
                color: Theme.of(context).colorScheme.primary,
              ),
              const SizedBox(width: 8),
              Text(
                '${_filter.activeFiltersCount} filtre(s) actif(s)',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ..._buildActiveSummary(),
        ],
      ),
    );
  }

  List<Widget> _buildActiveSummary() {
    final List<Widget> summaryItems = [];

    if (_filter.search != null && _filter.search!.isNotEmpty) {
      summaryItems.add(Text('• Recherche: "${_filter.search}"'));
    }
    if (_filter.category != null) {
      final category = Provider.of<NewsProvider>(
        context,
        listen: false,
      ).categories.firstWhere((c) => c.id.toString() == _filter.category);
      summaryItems.add(Text('• Catégorie: ${category.name}'));
    }
    if (_filter.importance != null) {
      summaryItems.add(
        Text('• Importance: ${_getImportanceLabel(_filter.importance!)}'),
      );
    }
    if (_filter.university != null) {
      summaryItems.add(Text('• Université: ${_filter.university}'));
    }
    if (_filter.status != null) {
      summaryItems.add(Text('• Statut: ${_getStatusLabel(_filter.status!)}'));
    }
    if (_startDate != null || _endDate != null) {
      String dateRange = 'Période: ';
      if (_startDate != null && _endDate != null) {
        dateRange += '${_formatDate(_startDate!)} - ${_formatDate(_endDate!)}';
      } else if (_startDate != null) {
        dateRange += 'À partir du ${_formatDate(_startDate!)}';
      } else {
        dateRange += 'Jusqu\'au ${_formatDate(_endDate!)}';
      }
      summaryItems.add(Text('• $dateRange'));
    }

    return summaryItems;
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

  Color _getImportanceColor(String importance) {
    switch (importance) {
      case 'urgent':
        return Colors.red;
      case 'high':
        return Colors.orange;
      case 'normal':
        return Colors.blue;
      case 'low':
        return Colors.grey;
      default:
        return Colors.blue;
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

  Color _getStatusColor(String status) {
    switch (status) {
      case 'published':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.blue;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  Future<void> _selectStartDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _startDate ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (picked != null) {
      setState(() {
        _startDate = picked;
        _filter = _filter.copyWith(startDate: picked);
      });
    }
  }

  Future<void> _selectEndDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _endDate ?? DateTime.now(),
      firstDate: _startDate ?? DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (picked != null) {
      setState(() {
        _endDate = picked;
        _filter = _filter.copyWith(endDate: picked);
      });
    }
  }

  void _clearAllFilters() {
    setState(() {
      _filter = NewsFilter();
      _searchController.clear();
      _startDate = null;
      _endDate = null;
    });
  }

  void _applyFilters() {
    Navigator.pop(context, _filter);
  }
}
