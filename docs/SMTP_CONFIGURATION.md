# Guide de Configuration SMTP

## Vue d'ensemble

Ce guide vous explique comment configurer le système de notifications email avec un vrai serveur SMTP pour envoyer des emails.

## 🔧 Configuration SMTP

### Méthode 1 : Configuration Automatique (Recommandé)

Utilisez le script interactif pour configurer facilement SMTP :

```bash
cd backend
.\.venv\Scripts\python.exe setup_smtp.py
```

Le script vous guidera pour :

- Choisir votre fournisseur email (Gmail, Outlook, Yahoo, etc.)
- Configurer automatiquement les paramètres
- Tester la configuration

### Méthode 2 : Configuration Manuelle

Créez un fichier `.env` dans le dossier `backend` avec :

```env
# Configuration SMTP
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-app
DEFAULT_FROM_EMAIL=Actualités Étudiantes Kinshasa <votre-email@gmail.com>
```

## 📧 Fournisseurs SMTP Supportés

### Gmail (Recommandé)

**Avantages** : Fiable, gratuit, excellente délivrabilité
**Limites** : 500 emails/jour pour comptes gratuits

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-app
```

**Configuration Gmail** :

1. Allez sur [Google Account Security](https://myaccount.google.com/security)
2. Activez l'authentification à 2 facteurs
3. Générez un "mot de passe d'application" :
   - Sélectionnez "Autre (nom personnalisé)"
   - Nommez-le "Actualités Étudiantes"
   - Utilisez le mot de passe de 16 caractères généré

### Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre-email@outlook.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe
```

### Yahoo

```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre-email@yahoo.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-app
```

**Configuration Yahoo** :

1. Activez l'authentification à 2 facteurs
2. Générez un mot de passe d'application

### Serveur SMTP Personnalisé

```env
EMAIL_HOST=mail.votre-domaine.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@votre-domaine.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe
```

## 🧪 Configuration de Test

### Backend Fichier (Développement)

Pour les tests locaux sans serveur SMTP :

```env
EMAIL_BACKEND=django.core.mail.backends.filebased.EmailBackend
EMAIL_FILE_PATH=emails
```

Les emails seront sauvegardés dans le dossier `backend/emails/`

### Backend Console (Debug)

Pour voir les emails dans la console :

```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### MailHog (Serveur de Test Local)

Pour un serveur SMTP de test complet :

1. Téléchargez [MailHog](https://github.com/mailhog/MailHog)
2. Lancez `mailhog.exe`
3. Configurez :

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_USE_TLS=False
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
```

4. Interface web : <http://localhost:8025>

## 🔍 Test de Configuration

### Commande de Test

```bash
# Tester la configuration actuelle
python manage.py setup_smtp --test-email votre-email@example.com

# Voir la configuration actuelle
python manage.py setup_smtp
```

### Test des Notifications

```bash
# Tester les différents types de notifications
python manage.py test_email_notifications --type=submission --user=publisher
python manage.py test_email_notifications --type=approval --user=publisher
python manage.py test_email_notifications --type=rejection --user=publisher
python manage.py test_email_notifications --type=daily
```

## 🚀 Mise en Production

### Recommandations

1. **Utilisez un vrai serveur SMTP** : Gmail pour les tests, serveur dédié pour la production
2. **Configurez SPF/DKIM** : Pour améliorer la délivrabilité
3. **Surveillez les quotas** : Respectez les limites de votre fournisseur
4. **Gérez les bounces** : Implémentez la gestion des emails non-délivrés

### Variables d'Environnement de Production

```env
# Production SMTP
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.votre-domaine.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@votre-domaine.com
EMAIL_HOST_PASSWORD=mot-de-passe-sécurisé
DEFAULT_FROM_EMAIL=Actualités Étudiantes Kinshasa <noreply@votre-domaine.com>
SERVER_EMAIL=admin@votre-domaine.com
```

### Configuration Avancée

```env
# Timeout des emails (secondes)
EMAIL_TIMEOUT=30

# SSL au lieu de TLS (port 465)
EMAIL_USE_SSL=True
EMAIL_USE_TLS=False
EMAIL_PORT=465

# URL du site (pour les liens dans les emails)
SITE_URL=https://votre-domaine.com
```

## 📊 Monitoring

### Logs

Les emails sont automatiquement loggés dans `notifications.log` :

```bash
# Voir les logs d'envoi
tail -f notifications.log

# Filtrer les erreurs
grep ERROR notifications.log
```

### Statistiques

Surveillez dans l'interface d'administration :

- Notifications envoyées avec succès
- Notifications échouées
- Utilisateurs inscrits aux digest

## 🔧 Dépannage

### Problèmes Courants

**Email non reçu** :

- Vérifiez le dossier spam
- Validez l'adresse email du destinataire
- Contrôlez les quotas du serveur SMTP

**Erreur d'authentification** :

- Vérifiez les identifiants
- Pour Gmail, utilisez un mot de passe d'application
- Vérifiez que l'authentification 2FA est activée

**Timeout de connexion** :

- Vérifiez le pare-feu
- Testez la connectivité réseau
- Essayez un autre port (25, 465, 587)

### Commandes de Debug

```bash
# Vérifier la configuration Django
python manage.py check

# Tester la connexion SMTP manuellement
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Message', 'from@example.com', ['to@example.com'])

# Vérifier les variables d'environnement
python manage.py shell
>>> from django.conf import settings
>>> print(settings.EMAIL_BACKEND)
>>> print(settings.EMAIL_HOST)
```

## 📈 Optimisation

### Performance

- **Envoi asynchrone** : Utilisez Celery pour les gros volumes
- **Limitation de débit** : Respectez les limites de votre fournisseur
- **Mise en cache** : Cachez les templates d'emails

### Sécurité

- **Variables d'environnement** : Ne jamais commiter les mots de passe
- **HTTPS** : Utilisez SSL/TLS pour la sécurité
- **Validation** : Validez les adresses email avant envoi

## 📞 Support

En cas de problème :

1. Consultez les logs : `notifications.log`
2. Testez avec la commande : `python manage.py setup_smtp --test-email`
3. Vérifiez la configuration de votre fournisseur email
4. Consultez la documentation de votre serveur SMTP

---

✅ **Le système de notifications SMTP est maintenant configuré et prêt à l'emploi !**
