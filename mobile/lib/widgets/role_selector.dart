import 'package:flutter/material.dart';
import '../models/rbac_models.dart';
import '../services/rbac_service.dart';

class RoleSelector extends StatefulWidget {
  final int? selectedRoleId;
  final Function(int?)? onRoleChanged;
  final String? token;
  final bool required;
  final List<String>? allowedRoles; // Filtrer les rôles disponibles

  const RoleSelector({
    super.key,
    this.selectedRoleId,
    this.onRoleChanged,
    this.token,
    this.required = false,
    this.allowedRoles,
  });

  @override
  State<RoleSelector> createState() => _RoleSelectorState();
}

class _RoleSelectorState extends State<RoleSelector> {
  List<Role> _roles = [];
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadRoles();
  }

  Future<void> _loadRoles() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final roles = await RbacService.getRoles(token: widget.token);

      print('🔍 RoleSelector: ${roles.length} rôles chargés depuis l\'API');

      // Filtrer les rôles si nécessaire - DÉSACTIVÉ POUR DÉBOGAGE
      List<Role> filteredRoles = roles;
      // NE PAS filtrer pour l'instant, montrer TOUS les rôles
      /* 
      if (widget.allowedRoles != null && widget.allowedRoles!.isNotEmpty) {
        filteredRoles = roles.where((role) {
          final roleName = role.nom.toLowerCase();
          return !roleName.contains('admin') && 
                 !roleName.contains('modérateur') &&
                 !roleName.contains('moderateur');
        }).toList();
      }
      */

      print('📋 RoleSelector: ${filteredRoles.length} rôles après filtrage');
      for (var role in filteredRoles) {
        print('  - ${role.nom} (ID: ${role.id})');
      }

      setState(() {
        _roles = filteredRoles;
      });
    } catch (e) {
      print('❌ RoleSelector ERROR: $e');
      setState(() {
        _error = e.toString();
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors du chargement des rôles: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Color _getRoleColor(String roleName) {
    switch (roleName) {
      case 'admin_global':
        return Colors.red;
      case 'moderateur':
        return Colors.orange;
      case 'enseignant':
        return Colors.blue;
      case 'publiant':
        return Colors.green;
      case 'etudiant':
        return Colors.grey;
      default:
        return Colors.black87;
    }
  }

  IconData _getRoleIcon(String roleName) {
    switch (roleName) {
      case 'admin_global':
        return Icons.admin_panel_settings;
      case 'moderateur':
        return Icons.gavel;
      case 'enseignant':
        return Icons.school;
      case 'publiant':
        return Icons.create;
      case 'etudiant':
        return Icons.person;
      default:
        return Icons.account_circle;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Rôle${widget.required ? ' *' : ''}',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 8),

        if (_isLoading)
          const LinearProgressIndicator()
        else if (_error != null)
          _buildErrorWidget()
        else
          _buildRoleDropdown(),
      ],
    );
  }

  Widget _buildErrorWidget() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        border: Border.all(color: Colors.red.shade200),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(Icons.error, color: Colors.red),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'Erreur de chargement',
              style: TextStyle(color: Colors.red.shade700),
            ),
          ),
          TextButton(onPressed: _loadRoles, child: const Text('Réessayer')),
        ],
      ),
    );
  }

  Widget _buildRoleDropdown() {
    return DropdownButtonFormField<int>(
      value: widget.selectedRoleId,
      decoration: const InputDecoration(
        border: OutlineInputBorder(),
        hintText: 'Sélectionnez un rôle',
        prefixIcon: Icon(Icons.account_circle),
      ),
      items: _roles.map((role) {
        return DropdownMenuItem<int>(
          value: role.id,
          child: _buildRoleItem(role),
        );
      }).toList(),
      onChanged: widget.onRoleChanged,
      validator: widget.required
          ? (value) {
              if (value == null) {
                return 'Veuillez sélectionner un rôle';
              }
              return null;
            }
          : null,
    );
  }

  Widget _buildRoleItem(Role role) {
    final color = _getRoleColor(role.nom);
    final icon = _getRoleIcon(role.nom);

    return Row(
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                role.nom,
                style: TextStyle(fontWeight: FontWeight.w500, color: color),
              ),
              if (role.description.isNotEmpty)
                Text(
                  role.description,
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
            ],
          ),
        ),
      ],
    );
  }
}

// Widget pour afficher les permissions d'un rôle (pour information)
class RolePermissionsDisplay extends StatelessWidget {
  final Role role;

  const RolePermissionsDisplay({super.key, required this.role});

  @override
  Widget build(BuildContext context) {
    if (role.permissions.isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      margin: const EdgeInsets.only(top: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Permissions du rôle ${role.nom}:',
              style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 4,
              runSpacing: 4,
              children: role.permissions.entries
                  .where((entry) => entry.value == true)
                  .map((entry) {
                    return Chip(
                      label: Text(
                        _getPermissionDisplayName(entry.key),
                        style: const TextStyle(fontSize: 12),
                      ),
                      backgroundColor: Colors.blue.shade50,
                      side: BorderSide(color: Colors.blue.shade200),
                    );
                  })
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }

  String _getPermissionDisplayName(String permission) {
    switch (permission) {
      case 'can_manage_all':
        return 'Gestion totale';
      case 'can_verify_users':
        return 'Vérifier utilisateurs';
      case 'can_moderate_news':
        return 'Modérer actualités';
      case 'can_create_content':
        return 'Créer contenu';
      case 'can_view_content':
        return 'Voir contenu';
      default:
        return permission.replaceAll('_', ' ').replaceAll('can ', '');
    }
  }
}
