# Système de Notifications Email

## Vue d'ensemble

Le système de notifications email permet d'informer automatiquement les utilisateurs des événements importants sur la plateforme. Il inclut des notifications immédiates et des digest périodiques.

## Types de Notifications

### 1. Notifications Immédiates

#### Confirmation de Soumission

- **Déclencheur** : Création d'un nouvel article
- **Destinataire** : Auteur de l'article
- **Template** : `email/submission_confirmation.html`
- **Fonction** : `NotificationService.send_submission_confirmation()`

#### Article Approuvé

- **Déclencheur** : Approbation d'un article par un modérateur
- **Destinataire** : Auteur de l'article
- **Template** : `email/news_approved.html`
- **Fonction** : `NotificationService.send_moderation_notification(news, 'approved', moderator, reason)`

#### Article Rejeté

- **Déclencheur** : Rejet d'un article par un modérateur
- **Destinataire** : Auteur de l'article
- **Template** : `email/news_rejected.html`
- **Fonction** : `NotificationService.send_moderation_notification(news, 'rejected', moderator, reason)`

### 2. Digest Périodiques

#### Digest Quotidien

- **Fréquence** : Quotidienne (recommandé à 9h)
- **Contenu** : Actualités publiées dans les dernières 24h
- **Template** : `email/daily_digest.html`
- **Commande** : `python manage.py send_daily_digest`

#### Digest Hebdomadaire

- **Fréquence** : Hebdomadaire (recommandé le lundi matin)
- **Contenu** : Actualités publiées dans les 7 derniers jours
- **Template** : `email/weekly_digest.html`
- **Commande** : `python manage.py send_weekly_digest`

## Configuration

### Paramètres Email (settings.py)

```python
# Configuration pour le développement
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Configuration pour la production (exemple Gmail)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'votre-email@gmail.com'
EMAIL_HOST_PASSWORD = 'votre-mot-de-passe-app'
DEFAULT_FROM_EMAIL = 'Actualités Étudiantes Kinshasa <noreply@etudiantskinshasa.com>'
```

### Préférences Utilisateur

Chaque utilisateur peut configurer :

- `email_notifications` : Activer/désactiver les emails
- `push_notifications` : Activer/désactiver les notifications push
- `notification_frequency` : 'immediate', 'daily', 'weekly'

## Commandes de Gestion

### Tester les Notifications

```bash
# Tester différents types de notifications
python manage.py test_email_notifications --type=submission --user=username
python manage.py test_email_notifications --type=approval --user=username
python manage.py test_email_notifications --type=rejection --user=username
python manage.py test_email_notifications --type=daily
python manage.py test_email_notifications --type=weekly
```

### Configurer les Tests

```bash
# Configurer les utilisateurs pour tester les digest
python manage.py setup_notification_test --frequency=daily
python manage.py setup_notification_test --frequency=weekly
```

### Envoi Manuel des Digest

```bash
# Envoyer les digest manuellement
python manage.py send_daily_digest
python manage.py send_weekly_digest
```

## Automatisation

### Windows (Planificateur de Tâches)

Utiliser le script PowerShell `digest_scheduler.ps1` :

1. Ouvrir le Planificateur de tâches
2. Créer une nouvelle tâche
3. Déclencheur : Quotidien à 9h00
4. Action : Démarrer un programme
5. Programme : `powershell.exe`
6. Arguments : `-File "C:\chemin\vers\digest_scheduler.ps1"`

### Linux/macOS (Cron)

Ajouter à crontab :

```bash
# Digest quotidien à 9h00
0 9 * * * cd /path/to/project && ./venv/bin/python manage.py send_daily_digest

# Digest hebdomadaire le lundi à 9h00
0 9 * * 1 cd /path/to/project && ./venv/bin/python manage.py send_weekly_digest
```

## Templates HTML

Les templates utilisent un design responsive avec :

- Styles CSS intégrés pour compatibilité email
- Design moderne avec dégradés et cartes
- Structure adaptée aux différents clients email
- Boutons d'action (CTA) pour rediriger vers la plateforme

### Structure des Templates

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Meta tags et styles CSS -->
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- En-tête avec icône et titre -->
        </div>
        <div class="content">
            <!-- Contenu principal -->
        </div>
        <div class="footer">
            <!-- Pied de page -->
        </div>
    </div>
</body>
</html>
```

## Interface Utilisateur

### Page de Préférences

Accessible via `/notifications`, permet aux utilisateurs de :

- Activer/désactiver les notifications email
- Activer/désactiver les notifications push
- Choisir la fréquence des digest
- Voir la description des différents types d'emails

## Intégration avec la Modération

Le système est automatiquement intégré avec le workflow de modération :

1. **Soumission** → Email de confirmation automatique
2. **Approbation** → Email de félicitation avec lien vers l'article
3. **Rejet** → Email avec commentaires et conseils pour améliorer

## Monitoring et Logs

- Logs automatiques dans `notifications.log`
- Enregistrement des notifications en base de données
- Statut d'envoi (sent/failed) pour chaque notification
- Possibilité de suivre les statistiques d'ouverture (future amélioration)

## Sécurité

- Validation des destinataires
- Protection contre le spam avec rate limiting (à implémenter)
- Templates sécurisés contre les injections XSS
- Liens sécurisés vers la plateforme

## Performance

- Envoi asynchrone recommandé pour la production (Celery)
- Pagination pour les gros volumes de destinataires
- Cache des templates pour optimiser les performances
- Gestion des erreurs SMTP avec retry automatique

## Extensions Futures

1. **Notifications Push** : Intégration Firebase Cloud Messaging
2. **Personnalisation** : Templates personnalisables par utilisateur
3. **Analytics** : Taux d'ouverture et de clic
4. **Segmentation** : Notifications ciblées par catégorie/université
5. **A/B Testing** : Test de différents templates
6. **SMS** : Notifications par SMS pour les urgences
7. **Webhooks** : Intégration avec des services tiers

## Dépannage

### Problèmes Courants

1. **Emails non reçus**
   - Vérifier la configuration SMTP
   - Contrôler les dossiers spam
   - Valider l'adresse email du destinataire

2. **Templates cassés**
   - Vérifier la syntaxe Django dans les templates
   - Contrôler l'encodage des caractères (UTF-8)

3. **Performances lentes**
   - Implémenter l'envoi asynchrone
   - Optimiser les requêtes de base de données

### Commandes de Debug

```bash
# Vérifier la configuration email
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Message test', 'from@example.com', ['to@example.com'])

# Vérifier les templates
python manage.py check --deploy

# Analyser les logs
tail -f notifications.log
```
