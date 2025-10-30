import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/notification_service.dart';

class NotificationPreferencesScreen extends StatefulWidget {
  const NotificationPreferencesScreen({super.key});

  @override
  State<NotificationPreferencesScreen> createState() =>
      _NotificationPreferencesScreenState();
}

class _NotificationPreferencesScreenState
    extends State<NotificationPreferencesScreen> {
  final NotificationService _notificationService = NotificationService();

  // État des préférences
  bool _emailNotifications = true;
  bool _pushNotifications = true;
  String _frequency = 'immediate'; // immediate, daily, weekly

  // Types de notifications
  bool _newsNotifications = true;
  bool _moderationNotifications = true;
  bool _systemNotifications = true;
  bool _urgentOnly = false;

  // Universités d'intérêt
  final Set<String> _interestedUniversities = {'UNIKIN'};
  final List<String> _availableUniversities = [
    'UNIKIN',
    'UPN',
    'ISTA',
    'ULC',
    'AUTRES',
  ];

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    setState(() => _isLoading = true);

    try {
      // Charger les préférences depuis le serveur ou le stockage local
      // Pour l'instant, on utilise des valeurs par défaut
      await Future.delayed(const Duration(milliseconds: 500));
    } catch (e) {
      _showError('Erreur lors du chargement des préférences: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _savePreferences() async {
    setState(() => _isLoading = true);

    try {
      // Sauvegarder les préférences sur le serveur
      await Future.delayed(const Duration(milliseconds: 1000));

      // Mettre à jour les notifications locales
      if (_pushNotifications) {
        await _notificationService.schedulePeriodicNotifications();
      } else {
        await _notificationService.cancelAllNotifications();
      }

      _showSuccess('Préférences sauvegardées avec succès');
    } catch (e) {
      _showError('Erreur lors de la sauvegarde: $e');
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Préférences de notifications'),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
        actions: [
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(16),
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            )
          else
            IconButton(
              icon: const Icon(Icons.save),
              onPressed: _savePreferences,
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildGeneralSection(),
                  const SizedBox(height: 24),
                  _buildFrequencySection(),
                  const SizedBox(height: 24),
                  _buildTypesSection(),
                  const SizedBox(height: 24),
                  _buildUniversitiesSection(),
                  const SizedBox(height: 24),
                  _buildTestSection(),
                  const SizedBox(height: 32),
                  _buildSaveButton(),
                ],
              ),
            ),
    );
  }

  Widget _buildSectionTitle(String title, {String? subtitle}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: Colors.grey[600]),
          ),
        ],
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildGeneralSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle(
              'Général',
              subtitle: 'Activez ou désactivez les types de notifications',
            ),
            SwitchListTile(
              title: const Text('Notifications email'),
              subtitle: const Text('Recevoir des notifications par email'),
              value: _emailNotifications,
              onChanged: (value) {
                setState(() => _emailNotifications = value);
              },
            ),
            SwitchListTile(
              title: const Text('Notifications push'),
              subtitle: const Text(
                'Recevoir des notifications sur votre appareil',
              ),
              value: _pushNotifications,
              onChanged: (value) {
                setState(() => _pushNotifications = value);
              },
            ),
            SwitchListTile(
              title: const Text('Actualités urgentes uniquement'),
              subtitle: const Text(
                'Ne recevoir que les actualités marquées comme urgentes',
              ),
              value: _urgentOnly,
              onChanged: (value) {
                setState(() => _urgentOnly = value);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFrequencySection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle(
              'Fréquence des notifications',
              subtitle:
                  'Choisissez à quelle fréquence recevoir les notifications',
            ),
            RadioListTile<String>(
              title: const Text('Immédiat'),
              subtitle: const Text(
                'Recevoir une notification dès qu\'une actualité est publiée',
              ),
              value: 'immediate',
              groupValue: _frequency,
              onChanged: (value) {
                setState(() => _frequency = value!);
              },
            ),
            RadioListTile<String>(
              title: const Text('Quotidien'),
              subtitle: const Text(
                'Recevoir un résumé quotidien des actualités',
              ),
              value: 'daily',
              groupValue: _frequency,
              onChanged: (value) {
                setState(() => _frequency = value!);
              },
            ),
            RadioListTile<String>(
              title: const Text('Hebdomadaire'),
              subtitle: const Text(
                'Recevoir un résumé hebdomadaire des actualités',
              ),
              value: 'weekly',
              groupValue: _frequency,
              onChanged: (value) {
                setState(() => _frequency = value!);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypesSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle(
              'Types de notifications',
              subtitle: 'Choisissez quels types de notifications recevoir',
            ),
            SwitchListTile(
              title: const Text('Nouvelles actualités'),
              subtitle: const Text(
                'Notifications pour les nouvelles actualités publiées',
              ),
              value: _newsNotifications,
              onChanged: (value) {
                setState(() => _newsNotifications = value);
              },
            ),
            Consumer<AuthProvider>(
              builder: (context, authProvider, child) {
                final user = authProvider.currentUser;
                if (user != null &&
                    (user.role == 'moderator' || user.role == 'admin')) {
                  return SwitchListTile(
                    title: const Text('Modération'),
                    subtitle: const Text(
                      'Notifications pour les actualités à modérer',
                    ),
                    value: _moderationNotifications,
                    onChanged: (value) {
                      setState(() => _moderationNotifications = value);
                    },
                  );
                }
                return const SizedBox.shrink();
              },
            ),
            SwitchListTile(
              title: const Text('Notifications système'),
              subtitle: const Text('Notifications importantes du système'),
              value: _systemNotifications,
              onChanged: (value) {
                setState(() => _systemNotifications = value);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUniversitiesSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle(
              'Universités d\'intérêt',
              subtitle:
                  'Sélectionnez les universités pour lesquelles vous voulez recevoir des notifications',
            ),
            ..._availableUniversities.map(
              (university) => CheckboxListTile(
                title: Text(university),
                value: _interestedUniversities.contains(university),
                onChanged: (value) {
                  setState(() {
                    if (value == true) {
                      _interestedUniversities.add(university);
                    } else {
                      _interestedUniversities.remove(university);
                    }
                  });
                },
              ),
            ),
            if (_interestedUniversities.isEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.orange[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.orange[200]!),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.warning, color: Colors.orange),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Veuillez sélectionner au moins une université pour recevoir des notifications.',
                        style: TextStyle(color: Colors.orange),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTestSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle(
              'Test des notifications',
              subtitle:
                  'Envoyez-vous une notification de test pour vérifier vos paramètres',
            ),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _sendTestNotification,
                    icon: const Icon(Icons.send),
                    label: const Text('Envoyer un test'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _clearAllNotifications,
                    icon: const Icon(Icons.clear_all),
                    label: const Text('Effacer toutes'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSaveButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: _isLoading ? null : _savePreferences,
        icon: _isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : const Icon(Icons.save),
        label: Text(
          _isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences',
        ),
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
    );
  }

  Future<void> _sendTestNotification() async {
    try {
      await _notificationService.showNotification(
        'Test de notification',
        'Ceci est une notification de test. Vos paramètres fonctionnent correctement !',
      );
      _showSuccess('Notification de test envoyée');
    } catch (e) {
      _showError('Erreur lors de l\'envoi du test: $e');
    }
  }

  Future<void> _clearAllNotifications() async {
    try {
      await _notificationService.cancelAllNotifications();
      _showSuccess('Toutes les notifications ont été effacées');
    } catch (e) {
      _showError('Erreur lors de l\'effacement: $e');
    }
  }
}
