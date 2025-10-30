import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/notification_service.dart';
import 'login_screen.dart';

// Fonction pour calculer l'année académique en cours
String getCurrentAcademicYear() {
  final now = DateTime.now();
  final currentYear = now.year;
  final currentMonth = now.month;

  // Si on est entre janvier et août, l'année académique a commencé l'année précédente
  // Si on est entre septembre et décembre, l'année académique commence cette année
  if (currentMonth >= 1 && currentMonth <= 8) {
    return '${currentYear - 1}-$currentYear';
  } else {
    return '$currentYear-${currentYear + 1}';
  }
}

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final NotificationService _notificationService = NotificationService();
  Map<String, bool> _notificationPreferences = {};
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadNotificationPreferences();
  }

  Future<void> _loadNotificationPreferences() async {
    final preferences = await _notificationService.getNotificationPreferences();
    setState(() {
      _notificationPreferences = preferences;
    });
  }

  Future<void> _updateNotificationPreference(String key, bool value) async {
    setState(() {
      _notificationPreferences[key] = value;
    });

    await _notificationService.updateNotificationPreferences(
      _notificationPreferences,
    );

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Préférences mises à jour'),
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  Future<void> _logout() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    setState(() {
      _isLoading = true;
    });

    await authProvider.logout();

    setState(() {
      _isLoading = false;
    });

    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  void _showEditProfileDialog() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final user = authProvider.currentUser;

    if (user == null) return;

    final firstNameController = TextEditingController(text: user.firstName);
    final lastNameController = TextEditingController(text: user.lastName);
    final emailController = TextEditingController(text: user.email);
    final universityController = TextEditingController(text: user.university);
    final programController = TextEditingController(text: user.program);
    final phoneController = TextEditingController(text: user.phoneNumber);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Modifier le profil'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: firstNameController,
                decoration: const InputDecoration(labelText: 'Prénom'),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: lastNameController,
                decoration: const InputDecoration(labelText: 'Nom'),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'Email'),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 8),
              TextField(
                controller: universityController,
                decoration: const InputDecoration(labelText: 'Université'),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: programController,
                decoration: const InputDecoration(labelText: 'Programme'),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: phoneController,
                decoration: const InputDecoration(labelText: 'Téléphone'),
                keyboardType: TextInputType.phone,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () async {
              final success = await authProvider.updateProfile(
                firstName: firstNameController.text.trim(),
                lastName: lastNameController.text.trim(),
                email: emailController.text.trim(),
                university: universityController.text.trim(),
                program: programController.text.trim(),
                phoneNumber: phoneController.text.trim(),
              );

              if (context.mounted) {
                Navigator.of(context).pop();

                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      success
                          ? 'Profil mis à jour avec succès'
                          : authProvider.errorMessage ??
                                'Erreur de mise à jour',
                    ),
                    backgroundColor: success ? Colors.green : Colors.red,
                  ),
                );
              }
            },
            child: const Text('Enregistrer'),
          ),
        ],
      ),
    );
  }

  void _showChangePasswordDialog() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Changer le mot de passe'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: currentPasswordController,
              decoration: const InputDecoration(
                labelText: 'Mot de passe actuel',
              ),
              obscureText: true,
            ),
            const SizedBox(height: 8),
            TextField(
              controller: newPasswordController,
              decoration: const InputDecoration(
                labelText: 'Nouveau mot de passe',
              ),
              obscureText: true,
            ),
            const SizedBox(height: 8),
            TextField(
              controller: confirmPasswordController,
              decoration: const InputDecoration(
                labelText: 'Confirmer le nouveau mot de passe',
              ),
              obscureText: true,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (newPasswordController.text !=
                  confirmPasswordController.text) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Les mots de passe ne correspondent pas'),
                    backgroundColor: Colors.red,
                  ),
                );
                return;
              }

              final success = await authProvider.changePassword(
                currentPassword: currentPasswordController.text,
                newPassword: newPasswordController.text,
              );

              if (context.mounted) {
                Navigator.of(context).pop();

                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      success
                          ? 'Mot de passe modifié avec succès'
                          : authProvider.errorMessage ??
                                'Erreur de modification',
                    ),
                    backgroundColor: success ? Colors.green : Colors.red,
                  ),
                );
              }
            },
            child: const Text('Modifier'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _isLoading ? null : _logout,
          ),
        ],
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final user = authProvider.currentUser;

          if (user == null) {
            return const Center(child: Text('Aucun utilisateur connecté'));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Carte profil utilisateur
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 40,
                          backgroundColor: Theme.of(context).primaryColor,
                          child: Text(
                            '${user.firstName[0]}${user.lastName[0]}',
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          '${user.firstName} ${user.lastName}',
                          style: Theme.of(context).textTheme.headlineSmall
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          user.email,
                          style: Theme.of(context).textTheme.bodyMedium
                              ?.copyWith(color: Colors.grey[600]),
                        ),
                        const SizedBox(height: 8),
                        Chip(
                          label: Text(user.role.toUpperCase()),
                          backgroundColor: user.role == 'admin'
                              ? Colors.red.withOpacity(0.2)
                              : user.role == 'moderator'
                              ? Colors.orange.withOpacity(0.2)
                              : Colors.blue.withOpacity(0.2),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            ElevatedButton.icon(
                              onPressed: _showEditProfileDialog,
                              icon: const Icon(Icons.edit),
                              label: const Text('Modifier'),
                            ),
                            OutlinedButton.icon(
                              onPressed: _showChangePasswordDialog,
                              icon: const Icon(Icons.lock),
                              label: const Text('Mot de passe'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Informations détaillées
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Informations',
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        _buildInfoRow(
                          Icons.school,
                          'Université',
                          user.universiteDetail?.nom ?? user.university,
                        ),
                        if (user.faculteDetail != null)
                          _buildInfoRow(
                            Icons.account_balance,
                            'Faculté',
                            user.faculteDetail!.nom,
                          ),
                        if (user.departementDetail != null)
                          _buildInfoRow(
                            Icons.business,
                            'Département',
                            user.departementDetail!.nom,
                          ),
                        if (user.promotion != null &&
                            user.promotion!.isNotEmpty)
                          _buildInfoRow(
                            Icons.stars,
                            'Promotion',
                            user.promotion!,
                          ),
                        _buildInfoRow(
                          Icons.calendar_month,
                          'Année académique',
                          getCurrentAcademicYear(),
                        ),
                        _buildInfoRow(Icons.book, 'Programme', user.program),
                        if (user.phoneNumber.isNotEmpty)
                          _buildInfoRow(
                            Icons.phone,
                            'Téléphone',
                            user.phoneNumber,
                          ),
                        _buildInfoRow(
                          Icons.calendar_today,
                          'Membre depuis',
                          '${user.dateJoined.day}/${user.dateJoined.month}/${user.dateJoined.year}',
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Préférences de notification
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Notifications',
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        _buildNotificationSwitch(
                          'news_notifications',
                          'Nouvelles actualités',
                          'Recevoir des notifications pour les nouvelles actualités',
                        ),
                        _buildNotificationSwitch(
                          'digest_notifications',
                          'Digest quotidien',
                          'Recevoir le résumé quotidien des actualités',
                        ),
                        if (authProvider.isModerator)
                          _buildNotificationSwitch(
                            'moderation_notifications',
                            'Modération',
                            'Recevoir des notifications de modération',
                          ),
                        _buildNotificationSwitch(
                          'sound_enabled',
                          'Son',
                          'Activer le son pour les notifications',
                        ),
                        _buildNotificationSwitch(
                          'vibration_enabled',
                          'Vibration',
                          'Activer la vibration pour les notifications',
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Bouton de déconnexion
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _isLoading ? null : _logout,
                    icon: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.logout),
                    label: const Text('Se déconnecter'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationSwitch(String key, String title, String subtitle) {
    return SwitchListTile(
      title: Text(title),
      subtitle: Text(subtitle),
      value: _notificationPreferences[key] ?? true,
      onChanged: (value) => _updateNotificationPreference(key, value),
      contentPadding: EdgeInsets.zero,
    );
  }
}
