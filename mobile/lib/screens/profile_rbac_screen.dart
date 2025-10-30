import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/organization_selector.dart';
import '../widgets/role_selector.dart';
import '../services/rbac_service.dart';

class ProfileRbacScreen extends StatefulWidget {
  const ProfileRbacScreen({super.key});

  @override
  State<ProfileRbacScreen> createState() => _ProfileRbacScreenState();
}

class _ProfileRbacScreenState extends State<ProfileRbacScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  bool _isEditing = false;

  // Form controllers
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();

  // RBAC data
  int? _selectedRoleId;
  int? _selectedUniversiteId;
  int? _selectedFaculteId;
  int? _selectedDepartementId;
  String? _promotion;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadUserData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _loadUserData() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final user = authProvider.currentUser;

    if (user != null) {
      _firstNameController.text = user.firstName;
      _lastNameController.text = user.lastName;
      _phoneController.text = user.phoneNumber;
      _selectedRoleId = user.nouveauRole;
      _selectedUniversiteId = user.universite;
      _selectedFaculteId = user.faculte;
      _selectedDepartementId = user.departement;
      _promotion = user.promotion;
    }
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.getToken();

      final success = await RbacService.updateUserRbacProfile(
        token: token ?? '',
        roleId: _selectedRoleId,
        universiteId: _selectedUniversiteId,
        faculteId: _selectedFaculteId,
        departementId: _selectedDepartementId,
        promotion: _promotion,
      );

      if (success) {
        // Actualiser les données utilisateur
        await authProvider.refreshUserProfile();

        setState(() {
          _isEditing = false;
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Profil mis à jour avec succès'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } else {
        throw Exception('Échec de la mise à jour');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              expandedHeight: 200,
              floating: false,
              pinned: true,
              backgroundColor: Theme.of(context).colorScheme.primary,
              flexibleSpace: FlexibleSpaceBar(
                title: const Text(
                  'Mon Profil',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                background: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Theme.of(context).colorScheme.primary,
                        Theme.of(context).colorScheme.primary.withOpacity(0.8),
                      ],
                    ),
                  ),
                  child: _buildHeaderContent(),
                ),
              ),
            ),
            SliverPersistentHeader(
              delegate: _SliverAppBarDelegate(
                TabBar(
                  controller: _tabController,
                  labelColor: Theme.of(context).colorScheme.primary,
                  unselectedLabelColor: Colors.grey,
                  indicatorColor: Theme.of(context).colorScheme.primary,
                  tabs: const [
                    Tab(icon: Icon(Icons.person), text: 'Informations'),
                    Tab(icon: Icon(Icons.school), text: 'Organisation'),
                    Tab(icon: Icon(Icons.security), text: 'Permissions'),
                  ],
                ),
              ),
              pinned: true,
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildPersonalInfoTab(),
            _buildOrganizationTab(),
            _buildPermissionsTab(),
          ],
        ),
      ),
      floatingActionButton: _isEditing
          ? Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FloatingActionButton.extended(
                  onPressed: () {
                    setState(() {
                      _isEditing = false;
                    });
                    _loadUserData(); // Reset data
                  },
                  label: const Text('Annuler'),
                  icon: const Icon(Icons.cancel),
                  backgroundColor: Colors.grey,
                ),
                const SizedBox(width: 16),
                FloatingActionButton.extended(
                  onPressed: _isLoading ? null : _updateProfile,
                  label: _isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : const Text('Sauvegarder'),
                  icon: _isLoading ? null : const Icon(Icons.save),
                ),
              ],
            )
          : FloatingActionButton.extended(
              onPressed: () {
                setState(() {
                  _isEditing = true;
                });
              },
              label: const Text('Modifier'),
              icon: const Icon(Icons.edit),
            ),
    );
  }

  Widget _buildHeaderContent() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final user = authProvider.currentUser;
        if (user == null) return const SizedBox.shrink();

        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              CircleAvatar(
                radius: 40,
                backgroundColor: Colors.white,
                child: Text(
                  '${user.firstName.isNotEmpty ? user.firstName[0] : ''}${user.lastName.isNotEmpty ? user.lastName[0] : ''}',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${user.firstName} ${user.lastName}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                user.email,
                style: const TextStyle(color: Colors.white70, fontSize: 14),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPersonalInfoTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoCard(
              title: 'Informations personnelles',
              icon: Icons.person,
              children: [
                TextFormField(
                  controller: _firstNameController,
                  enabled: _isEditing,
                  decoration: const InputDecoration(
                    labelText: 'Prénom',
                    prefixIcon: Icon(Icons.badge),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Prénom requis';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _lastNameController,
                  enabled: _isEditing,
                  decoration: const InputDecoration(
                    labelText: 'Nom',
                    prefixIcon: Icon(Icons.badge),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Nom requis';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _phoneController,
                  enabled: _isEditing,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Téléphone',
                    prefixIcon: Icon(Icons.phone),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildStatusCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildOrganizationTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildInfoCard(
            title: 'Rôle et Organisation',
            icon: Icons.school,
            children: [
              if (_isEditing) ...[
                RoleSelector(
                  selectedRoleId: _selectedRoleId,
                  onRoleChanged: (roleId) {
                    setState(() {
                      _selectedRoleId = roleId;
                    });
                  },
                  required: true,
                ),
                const SizedBox(height: 16),
                OrganizationSelector(
                  selectedUniversiteId: _selectedUniversiteId,
                  selectedFaculteId: _selectedFaculteId,
                  selectedDepartementId: _selectedDepartementId,
                  onUniversiteChanged: (universiteId) {
                    setState(() {
                      _selectedUniversiteId = universiteId;
                    });
                  },
                  onFaculteChanged: (faculteId) {
                    setState(() {
                      _selectedFaculteId = faculteId;
                    });
                  },
                  onDepartementChanged: (departementId) {
                    setState(() {
                      _selectedDepartementId = departementId;
                    });
                  },
                  onPromotionChanged: (promotion) {
                    setState(() {
                      _promotion = promotion;
                    });
                  },
                  required: true,
                  showPromotionField: true,
                  promotion: _promotion,
                ),
              ] else
                _buildOrganizationDisplay(),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPermissionsTab() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final user = authProvider.currentUser;
        if (user == null) return const SizedBox.shrink();

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: _buildInfoCard(
            title: 'Permissions et Accès',
            icon: Icons.security,
            children: [
              _buildPermissionTile(
                'Voir le contenu',
                user.hasPermission('can_view_content'),
                Icons.visibility,
              ),
              _buildPermissionTile(
                'Créer du contenu',
                user.hasPermission('can_create_content'),
                Icons.create,
              ),
              _buildPermissionTile(
                'Modérer les actualités',
                user.hasPermission('can_moderate_news'),
                Icons.gavel,
              ),
              _buildPermissionTile(
                'Vérifier les utilisateurs',
                user.hasPermission('can_verify_users'),
                Icons.verified_user,
              ),
              _buildPermissionTile(
                'Gestion complète',
                user.hasPermission('can_manage_all'),
                Icons.admin_panel_settings,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildInfoCard({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: Theme.of(context).colorScheme.primary),
                const SizedBox(width: 8),
                Text(title, style: Theme.of(context).textTheme.titleLarge),
              ],
            ),
            const SizedBox(height: 16),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final user = authProvider.currentUser;
        if (user == null) return const SizedBox.shrink();

        return _buildInfoCard(
          title: 'Statut du compte',
          icon: Icons.info,
          children: [
            _buildStatusTile(
              'Statut de vérification',
              user.isVerified ? 'Vérifié' : 'Non vérifié',
              user.isVerified ? Colors.green : Colors.orange,
            ),
            _buildStatusTile(
              'Membre depuis',
              '${user.dateJoined.day}/${user.dateJoined.month}/${user.dateJoined.year}',
              Colors.blue,
            ),
            _buildStatusTile(
              'Rôle actuel',
              user.currentRoleDisplay,
              Theme.of(context).colorScheme.primary,
            ),
          ],
        );
      },
    );
  }

  Widget _buildOrganizationDisplay() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final user = authProvider.currentUser;
        if (user == null) return const SizedBox.shrink();

        return Column(
          children: [
            _buildInfoTile(
              'Université',
              user.universiteDetail?.nom ?? 'Non définie',
            ),
            _buildInfoTile('Faculté', user.faculteDetail?.nom ?? 'Non définie'),
            _buildInfoTile(
              'Département',
              user.departementDetail?.nom ?? 'Non défini',
            ),
            if (user.promotion != null)
              _buildInfoTile('Promotion', user.promotion!),
          ],
        );
      },
    );
  }

  Widget _buildInfoTile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusTile(String label, String value, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 12),
          Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
          const Spacer(),
          Text(
            value,
            style: TextStyle(color: color, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildPermissionTile(
    String permission,
    bool hasPermission,
    IconData icon,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(
            icon,
            color: hasPermission ? Colors.green : Colors.grey,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              permission,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Icon(
            hasPermission ? Icons.check_circle : Icons.cancel,
            color: hasPermission ? Colors.green : Colors.red,
            size: 20,
          ),
        ],
      ),
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverAppBarDelegate(this._tabBar);

  final TabBar _tabBar;

  @override
  double get minExtent => _tabBar.preferredSize.height;
  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: _tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}
