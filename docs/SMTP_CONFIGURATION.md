# Configuration SMTP

## 📧 Configuration Rapide

### Option 1 : Gmail (Recommandé)

Créez un fichier `.env` dans le dossier `backend` :

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-app
DEFAULT_FROM_EMAIL=Actualités Kinshasa <votre-email@gmail.com>
```

**Obtenir un mot de passe d'application Gmail** :

1. Allez sur [myaccount.google.com/security](https://myaccount.google.com/security)
2. Activez la validation en 2 étapes
3. Générez un mot de passe d'application
4. Utilisez ce mot de passe dans `.env`

### Option 2 : Outlook

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre-email@outlook.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe
```

### Option 3 : Mode Test (Sans SMTP)

Pour tester sans serveur SMTP, les emails seront enregistrés dans `backend/emails/` :

```env
EMAIL_BACKEND=django.core.mail.backends.filebased.EmailBackend
EMAIL_FILE_PATH=emails
```

## 🧪 Tester la Configuration

Exécutez depuis le dossier `backend` :

```bash
.\.venv\Scripts\python.exe setup_smtp.py
```

Le script vous guidera pour tester l'envoi d'emails.

## ⚠️ Problèmes Courants

**Email non reçu** :

- Vérifiez le dossier spam
- Vérifiez les identifiants SMTP

**Erreur d'authentification Gmail** :

- Utilisez un mot de passe d'application (pas votre mot de passe normal)
- Activez la validation en 2 étapes d'abord

**Timeout de connexion** :

- Vérifiez votre pare-feu
- Essayez le port 465 avec `EMAIL_USE_SSL=True` au lieu de TLS

---

✅ **Configuration terminée ! Le système enverra des notifications par email.**
