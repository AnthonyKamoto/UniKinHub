import 'package:flutter/material.dart';
import '../models/rbac_models.dart';
import '../services/rbac_service.dart';

class OrganizationSelector extends StatefulWidget {
  final int? selectedUniversiteId;
  final int? selectedFaculteId;
  final int? selectedDepartementId;
  final Function(int?)? onUniversiteChanged;
  final Function(int?)? onFaculteChanged;
  final Function(int?)? onDepartementChanged;
  final String? token;
  final bool required;
  final bool showPromotionField;
  final String? promotion;
  final Function(String?)? onPromotionChanged;

  const OrganizationSelector({
    super.key,
    this.selectedUniversiteId,
    this.selectedFaculteId,
    this.selectedDepartementId,
    this.onUniversiteChanged,
    this.onFaculteChanged,
    this.onDepartementChanged,
    this.token,
    this.required = false,
    this.showPromotionField = false,
    this.promotion,
    this.onPromotionChanged,
  });

  @override
  State<OrganizationSelector> createState() => _OrganizationSelectorState();
}

class _OrganizationSelectorState extends State<OrganizationSelector> {
  List<Universite> _universites = [];
  List<Faculte> _facultes = [];
  List<Departement> _departements = [];

  bool _isLoadingUniversites = false;
  bool _isLoadingFacultes = false;
  bool _isLoadingDepartements = false;

  @override
  void initState() {
    super.initState();
    _loadUniversites();
    if (widget.selectedUniversiteId != null) {
      _loadFacultes(widget.selectedUniversiteId!);
    }
    if (widget.selectedFaculteId != null) {
      _loadDepartements(widget.selectedFaculteId!);
    }
  }

  Future<void> _loadUniversites() async {
    print('🏫 OrganizationSelector: Chargement des universités...');
    setState(() {
      _isLoadingUniversites = true;
    });

    try {
      final universites = await RbacService.getUniversites(token: widget.token);
      print(
        '✅ OrganizationSelector: ${universites.length} universités chargées',
      );
      for (var univ in universites) {
        print('   - ${univ.nom} (ID: ${univ.id})');
      }
      setState(() {
        _universites = universites;
      });
    } catch (e) {
      print('❌ OrganizationSelector: Erreur chargement universités: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors du chargement des universités: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      setState(() {
        _isLoadingUniversites = false;
      });
    }
  }

  Future<void> _loadFacultes(int universiteId) async {
    setState(() {
      _isLoadingFacultes = true;
      _facultes = [];
      _departements = [];
    });

    try {
      final facultes = await RbacService.getFacultesByUniversite(
        universiteId,
        token: widget.token,
      );
      setState(() {
        _facultes = facultes;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors du chargement des facultés: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      setState(() {
        _isLoadingFacultes = false;
      });
    }
  }

  Future<void> _loadDepartements(int faculteId) async {
    setState(() {
      _isLoadingDepartements = true;
      _departements = [];
    });

    try {
      final departements = await RbacService.getDepartementsByFaculte(
        faculteId,
        token: widget.token,
      );
      setState(() {
        _departements = departements;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors du chargement des départements: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      setState(() {
        _isLoadingDepartements = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Sélection de l'université
        _buildUniversiteDropdown(),
        const SizedBox(height: 16),

        // Sélection de la faculté
        _buildFaculteDropdown(),
        const SizedBox(height: 16),

        // Sélection du département
        _buildDepartementDropdown(),

        // Champ promotion (optionnel)
        if (widget.showPromotionField) ...[
          const SizedBox(height: 16),
          _buildPromotionField(),
        ],
      ],
    );
  }

  Widget _buildUniversiteDropdown() {
    return SizedBox(
      width: double.infinity,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Université${widget.required ? ' *' : ''}',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 8),
          _isLoadingUniversites
              ? const LinearProgressIndicator()
              : DropdownButtonFormField<int>(
                  value: widget.selectedUniversiteId,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Sélectionnez une université',
                  ),
                  items: _universites.map((universite) {
                    return DropdownMenuItem<int>(
                      value: universite.id,
                      child: Text(universite.nom),
                    );
                  }).toList(),
                  onChanged: (value) {
                    if (widget.onUniversiteChanged != null) {
                      widget.onUniversiteChanged!(value);
                    }
                    if (value != null) {
                      _loadFacultes(value);
                    } else {
                      setState(() {
                        _facultes = [];
                        _departements = [];
                      });
                    }
                    // Reset selections en cascade
                    if (widget.onFaculteChanged != null) {
                      widget.onFaculteChanged!(null);
                    }
                    if (widget.onDepartementChanged != null) {
                      widget.onDepartementChanged!(null);
                    }
                  },
                  validator: widget.required
                      ? (value) {
                          if (value == null) {
                            return 'Veuillez sélectionner une université';
                          }
                          return null;
                        }
                      : null,
                ),
        ],
      ),
    );
  }

  Widget _buildFaculteDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Faculté${widget.required ? ' *' : ''}',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 8),
        _isLoadingFacultes
            ? const LinearProgressIndicator()
            : DropdownButtonFormField<int>(
                value: widget.selectedFaculteId,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Sélectionnez une faculté',
                ),
                items: _facultes.map((faculte) {
                  return DropdownMenuItem<int>(
                    value: faculte.id,
                    child: Text(faculte.nom),
                  );
                }).toList(),
                onChanged: widget.selectedUniversiteId == null
                    ? null
                    : (value) {
                        if (widget.onFaculteChanged != null) {
                          widget.onFaculteChanged!(value);
                        }
                        if (value != null) {
                          _loadDepartements(value);
                        } else {
                          setState(() {
                            _departements = [];
                          });
                        }
                        // Reset département selection
                        if (widget.onDepartementChanged != null) {
                          widget.onDepartementChanged!(null);
                        }
                      },
                validator: widget.required
                    ? (value) {
                        if (value == null) {
                          return 'Veuillez sélectionner une faculté';
                        }
                        return null;
                      }
                    : null,
              ),
      ],
    );
  }

  Widget _buildDepartementDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Département${widget.required ? ' *' : ''}',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 8),
        _isLoadingDepartements
            ? const LinearProgressIndicator()
            : DropdownButtonFormField<int>(
                value: widget.selectedDepartementId,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Sélectionnez un département',
                ),
                items: _departements.map((departement) {
                  return DropdownMenuItem<int>(
                    value: departement.id,
                    child: Text(departement.nom),
                  );
                }).toList(),
                onChanged: widget.selectedFaculteId == null
                    ? null
                    : (value) {
                        if (widget.onDepartementChanged != null) {
                          widget.onDepartementChanged!(value);
                        }
                      },
                validator: widget.required
                    ? (value) {
                        if (value == null) {
                          return 'Veuillez sélectionner un département';
                        }
                        return null;
                      }
                    : null,
              ),
      ],
    );
  }

  Widget _buildPromotionField() {
    // Liste des promotions disponibles (identique à l'application web)
    final List<String> promotions = [
      'L1 (Licence 1ère année)',
      'L2 (Licence 2ème année)',
      'L3 (Licence 3ème année)',
      'M1 (Master 1ère année)',
      'M2 (Master 2ème année)',
      'Doctorat',
      'Autre',
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Promotion',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value:
              widget.promotion != null && promotions.contains(widget.promotion)
              ? widget.promotion
              : null,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            hintText: 'Sélectionnez votre promotion',
            prefixIcon: Icon(Icons.school),
          ),
          items: promotions.map((promotion) {
            return DropdownMenuItem<String>(
              value: promotion,
              child: Text(promotion),
            );
          }).toList(),
          onChanged: widget.onPromotionChanged,
          validator: widget.required
              ? (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez sélectionner une promotion';
                  }
                  return null;
                }
              : null,
        ),
      ],
    );
  }
}
