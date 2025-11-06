import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/auth_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _emailNotifications = true;
  bool _pushNotifications = true;
  bool _darkMode = false;
  String _language = 'fr';
  bool _autoPlayVideos = false;
  bool _showImages = true;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _notificationsEnabled = prefs.getBool('notifications_enabled') ?? true;
      _emailNotifications = prefs.getBool('email_notifications') ?? true;
      _pushNotifications = prefs.getBool('push_notifications') ?? true;
      _darkMode = prefs.getBool('dark_mode') ?? false;
      _language = prefs.getString('language') ?? 'fr';
      _autoPlayVideos = prefs.getBool('auto_play_videos') ?? false;
      _showImages = prefs.getBool('show_images') ?? true;
    });
  }

  Future<void> _saveSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notifications_enabled', _notificationsEnabled);
    await prefs.setBool('email_notifications', _emailNotifications);
    await prefs.setBool('push_notifications', _pushNotifications);
    await prefs.setBool('dark_mode', _darkMode);
    await prefs.setString('language', _language);
    await prefs.setBool('auto_play_videos', _autoPlayVideos);
    await prefs.setBool('show_images', _showImages);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Paramètres sauvegardés'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Paramètres'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _saveSettings,
            tooltip: 'Sauvegarder',
          ),
        ],
      ),
      body: ListView(
        children: [
          // Section Compte
          _buildSectionHeader('Compte'),
          ListTile(
            leading: CircleAvatar(
              backgroundColor: Theme.of(context).primaryColor,
              child: Text(
                user?.username[0].toUpperCase() ?? '?',
                style: const TextStyle(color: Colors.white),
              ),
            ),
            title: Text(user?.username ?? 'Utilisateur'),
            subtitle: Text(user?.email ?? ''),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // Navigation vers profil
            },
          ),
          const Divider(),

          // Section Notifications
          _buildSectionHeader('Notifications'),
          SwitchListTile(
            secondary: const Icon(Icons.notifications),
            title: const Text('Activer les notifications'),
            subtitle: const Text('Recevoir des notifications'),
            value: _notificationsEnabled,
            onChanged: (value) {
              setState(() {
                _notificationsEnabled = value;
              });
            },
          ),
          SwitchListTile(
            secondary: const Icon(Icons.email),
            title: const Text('Notifications par email'),
            subtitle: const Text('Recevoir des emails'),
            value: _emailNotifications,
            onChanged: _notificationsEnabled
                ? (value) {
                    setState(() {
                      _emailNotifications = value;
                    });
                  }
                : null,
          ),
          SwitchListTile(
            secondary: const Icon(Icons.phone_android),
            title: const Text('Notifications push'),
            subtitle: const Text('Recevoir des notifications push'),
            value: _pushNotifications,
            onChanged: _notificationsEnabled
                ? (value) {
                    setState(() {
                      _pushNotifications = value;
                    });
                  }
                : null,
          ),
          const Divider(),

          // Section Apparence
          _buildSectionHeader('Apparence'),
          SwitchListTile(
            secondary: Icon(_darkMode ? Icons.dark_mode : Icons.light_mode),
            title: const Text('Mode sombre'),
            subtitle: const Text('Activer le thème sombre'),
            value: _darkMode,
            onChanged: (value) {
              setState(() {
                _darkMode = value;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Redémarrez l\'app pour appliquer le thème'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.language),
            title: const Text('Langue'),
            subtitle: Text(_language == 'fr' ? 'Français' : 'English'),
            trailing: DropdownButton<String>(
              value: _language,
              underline: const SizedBox(),
              items: const [
                DropdownMenuItem(value: 'fr', child: Text('Français')),
                DropdownMenuItem(value: 'en', child: Text('English')),
              ],
              onChanged: (value) {
                if (value != null) {
                  setState(() {
                    _language = value;
                  });
                }
              },
            ),
          ),
          const Divider(),

          // Section Contenu
          _buildSectionHeader('Contenu'),
          SwitchListTile(
            secondary: const Icon(Icons.image),
            title: const Text('Afficher les images'),
            subtitle: const Text('Charger automatiquement les images'),
            value: _showImages,
            onChanged: (value) {
              setState(() {
                _showImages = value;
              });
            },
          ),
          SwitchListTile(
            secondary: const Icon(Icons.video_library),
            title: const Text('Lecture automatique des vidéos'),
            subtitle: const Text('Lire les vidéos automatiquement'),
            value: _autoPlayVideos,
            onChanged: (value) {
              setState(() {
                _autoPlayVideos = value;
              });
            },
          ),
          const Divider(),

          // Section Confidentialité
          _buildSectionHeader('Confidentialité et sécurité'),
          ListTile(
            leading: const Icon(Icons.lock),
            title: const Text('Changer le mot de passe'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // Déjà géré dans ProfileScreen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Allez dans Profil pour changer le mot de passe',
                  ),
                ),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.privacy_tip),
            title: const Text('Politique de confidentialité'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              _showPrivacyPolicy();
            },
          ),
          ListTile(
            leading: const Icon(Icons.description),
            title: const Text('Conditions d\'utilisation'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              _showTermsOfService();
            },
          ),
          const Divider(),

          // Section Stockage
          _buildSectionHeader('Stockage'),
          ListTile(
            leading: const Icon(Icons.delete_sweep),
            title: const Text('Vider le cache'),
            subtitle: const Text('Supprimer les données temporaires'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              _showClearCacheDialog();
            },
          ),
          const Divider(),

          // Section À propos
          _buildSectionHeader('À propos'),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text('Version de l\'application'),
            subtitle: const Text('1.0.0'),
          ),
          ListTile(
            leading: const Icon(Icons.code),
            title: const Text('Développé par'),
            subtitle: const Text('UniKinHub Team'),
          ),
          ListTile(
            leading: const Icon(Icons.bug_report),
            title: const Text('Signaler un bug'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              _showReportBugDialog();
            },
          ),
          const SizedBox(height: 32),

          // Bouton de déconnexion
          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton.icon(
              onPressed: () {
                _showLogoutDialog();
              },
              icon: const Icon(Icons.logout),
              label: const Text('Se déconnecter'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: Theme.of(context).primaryColor,
        ),
      ),
    );
  }

  void _showPrivacyPolicy() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Politique de confidentialité'),
        content: const SingleChildScrollView(
          child: Text(
            'UniKinHub respecte votre vie privée. '
            'Nous collectons uniquement les données nécessaires '
            'au fonctionnement de l\'application.\n\n'
            'Vos données personnelles ne sont jamais partagées '
            'avec des tiers sans votre consentement.',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  void _showTermsOfService() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Conditions d\'utilisation'),
        content: const SingleChildScrollView(
          child: Text(
            'En utilisant UniKinHub, vous acceptez de :\n\n'
            '• Respecter les règles de la communauté\n'
            '• Ne pas publier de contenu inapproprié\n'
            '• Utiliser l\'application de manière responsable\n'
            '• Respecter les droits d\'auteur',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  void _showClearCacheDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Vider le cache'),
        content: const Text(
          'Êtes-vous sûr de vouloir supprimer toutes les données en cache ?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              // Vider le cache
              final prefs = await SharedPreferences.getInstance();
              // Garder seulement le token
              final token = prefs.getString('auth_token');
              await prefs.clear();
              if (token != null) {
                await prefs.setString('auth_token', token);
              }

              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Cache vidé avec succès'),
                    backgroundColor: Colors.green,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Vider'),
          ),
        ],
      ),
    );
  }

  void _showReportBugDialog() {
    final controller = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Signaler un bug'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Décrivez le problème rencontré :'),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: 'Description du bug...',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Rapport envoyé. Merci !'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: const Text('Envoyer'),
          ),
        ],
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
              Navigator.pop(context);
              final authProvider = Provider.of<AuthProvider>(
                context,
                listen: false,
              );
              await authProvider.logout();

              if (mounted) {
                Navigator.of(
                  context,
                ).pushNamedAndRemoveUntil('/login', (route) => false);
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Déconnecter'),
          ),
        ],
      ),
    );
  }
}
