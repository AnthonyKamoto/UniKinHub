# 🎓 UniKinHub - Système de Gestion d'Actualités Universitaires

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Django](https://img.shields.io/badge/Django-5.2.7-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.35.6-blue.svg)](https://flutter.dev/)
[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)

> Plateforme centralisée de diffusion d'informations pour les étudiants des universités de Kinshasa avec modération complète et notifications en temps réel.

---

## ✨ Fonctionnalités Principales

### 📱 Pour les Étudiants

- 📰 **Fil d'actualités personnalisé** selon le programme d'études
- 🔔 **Notifications push** pour les nouvelles importantes
- ❤️ **Interactions** - Likes et commentaires
- 🔍 **Recherche avancée** avec filtres multiples
- 📅 **Événements** avec rappels automatiques

### ✍️ Pour les Enseignants/Publiants

- ✏️ **Création d'actualités** avec éditeur riche
- 📸 **Upload d'images** et fichiers joints
- 📊 **Statistiques** de lecture et engagement
- 🎯 **Ciblage** par programme et université

### 🛡️ Pour les Modérateurs/Admins

- ✅ **Système de modération** complet
- 📋 **Tableau de bord** avec statistiques
- 👥 **Gestion des utilisateurs** et rôles
- 🔒 **Invalidation** de contenu publié
- 📈 **Rapports** d'activité

---

## 🏗️ Architecture

```
UniKinHub/
├── 🐍 backend/          # API Django REST Framework
├── ⚛️  frontend/         # Application Web React + TypeScript
├── 📱 mobile/           # Application Mobile Flutter
└── 📚 docs/             # Documentation complète
```

**Stack Technique:**

- **Backend:** Django 5.2.7 + Django REST Framework + Token Authentication
- **Frontend:** React 18 + TypeScript + Material-UI + Vite
- **Mobile:** Flutter 3.35.6 + Provider + Material Design 3
- **Base de données:** SQLite (développement)
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Tâches asynchrones:** Celery + Redis (optionnel)
- **Authentification:** Django Token Authentication
- **State Management:** React Context API (web) + Provider (mobile)

---

## 🚀 Démarrage Rapide

### Prérequis

- Python 3.12+
- Node.js 18+ & pnpm
- Flutter 3.35+
- Git

### Installation Automatique

**Windows PowerShell:**

```powershell
# 1. Cloner le repository
git clone https://github.com/AnthonyKamoto/UniKinHub.git
cd UniKinHub

# 2. Setup complet (installation + configuration)
.\setup.ps1
```

Le script `setup.ps1` effectue automatiquement :

- ✅ Vérification des prérequis (Python, Node.js, Flutter)
- ✅ Création des environnements virtuels
- ✅ Installation de toutes les dépendances
- ✅ Configuration de la base de données
- ✅ Création des données de test et comptes utilisateurs
- ✅ Configuration Firebase (optionnel)

### Démarrage des Serveurs

```powershell
# Démarrer tous les serveurs (backend, frontend, mobile)
.\start-all.ps1
```

**Arrêter tous les serveurs:**

```powershell
.\stop-all.ps1
```

> **Accès:**
>
> - 🌐 Application Web: <http://localhost:3001>
> - 🔧 API Backend: <http://localhost:8000/api>
> - 📱 Mobile: Via émulateur Android (<http://10.0.2.2:8000>)
> - 📊 Admin Django: <http://localhost:8000/admin>

---

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| [📘 Installation](docs/INSTALLATION.md) | Guide d'installation détaillé |
| [🚀 Démarrage Rapide](DEMARRAGE_RAPIDE.md) | Lancement et configuration rapide |
| [� Configuration SMTP](docs/SMTP_CONFIGURATION.md) | Configuration des emails |
| [� Comptes Utilisateurs](COMPTES_UTILISATEURS.txt) | Liste complète des comptes de test |
| [🔄 Changelog](CHANGELOG.md) | Historique des modifications |

---

## 👤 Comptes de Test

| Utilisateur | Username | Mot de passe | Rôle | Permissions |
|-------------|----------|--------------|------|-------------|
| Admin | `admin` | `admin123` | Administrateur | Gestion complète |
| Modérateur 1 | `moderateur1` | `password123` | Modérateur | Modération de contenu |
| Modérateur 2 | `moderateur2` | `password123` | Modérateur | Modération de contenu |
| Enseignant | `enseignant1` | `password123` | Publiant | Création actualités |
| Étudiant 1 | `etudiant1` | `password123` | Étudiant | Lecture + Interactions |
| Étudiant 2 | `etudiant2` | `password123` | Étudiant | Lecture + Interactions |

> **Détails complets:** Voir [COMPTES_UTILISATEURS.txt](COMPTES_UTILISATEURS.txt)

---

## 🧪 Test du Workflow

### Workflow de Modération

1. **Connexion en tant que publiant:**

   ```
   Username: enseignant1
   Password: password123
   ```

2. **Créer une actualité:**
   - Titre, contenu, catégorie, importance
   - Upload image (optionnel)
   - Soumettre → Status: `pending`

3. **Connexion en tant que modérateur:**

   ```
   Username: moderateur1
   Password: password123
   ```

4. **Modérer l'actualité:**
   - Voir liste des news en attente
   - Approuver ✅ ou Rejeter ❌
   - Status après approbation: `published`

### Test via API

```bash
# 1. Login pour obtenir un token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "enseignant1", "password": "password123"}'

# Réponse: {"token": "abc123...", "user": {...}}

# 2. Création d'actualité (enseignant1)
curl -X POST http://localhost:8000/api/news-api/ \
  -H "Authorization: Token {votre-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "draft_title": "Nouvelle actualité test",
    "draft_content": "Contenu de test",
    "category": 1,
    "importance": "medium"
  }'

# 3. Liste des catégories
curl http://localhost:8000/api/categories/ \
  -H "Authorization: Token {votre-token}"

# 4. Liste news en attente (admin/moderateur uniquement)
curl http://localhost:8000/api/news-api/pending/ \
  -H "Authorization: Token {token-moderateur}"

# 5. Approbation d'actualité (admin/moderateur)
curl -X POST http://localhost:8000/api/news-api/{id}/approve/ \
  -H "Authorization: Token {token-moderateur}" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Approuvé sans modification"}'

# 6. Rejet d'actualité
curl -X POST http://localhost:8000/api/news-api/{id}/reject/ \
  -H "Authorization: Token {token-moderateur}" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Contenu inapproprié"}'
```

---

## 📦 Structure du Projet

```
UniKinHub/
│
├── backend/                    # Backend Django
│   ├── news/                   # App principale
│   │   ├── models.py          # Modèles de données
│   │   ├── serializers.py     # Serializers DRF
│   │   ├── views.py           # Vues API
│   │   ├── views_moderation.py # Endpoints modération
│   │   ├── permissions.py     # Permissions RBAC
│   │   └── tasks.py           # Tâches Celery
│   ├── news_system/           # Configuration Django
│   └── manage.py
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── pages/            # Pages principales
│   │   ├── services/         # Services API
│   │   ├── contexts/         # Contextes React
│   │   └── theme/            # Configuration MUI
│   └── package.json
│
├── mobile/                     # Application Flutter
│   ├── lib/
│   │   ├── models/           # Modèles de données
│   │   ├── screens/          # Écrans
│   │   ├── services/         # Services API
│   │   ├── providers/        # State management
│   │   └── widgets/          # Widgets réutilisables
│   └── pubspec.yaml
│
├── docs/                       # Documentation
│   ├── INSTALLATION.md        # Guide installation
│   ├── API.md                # Documentation API
│   └── ...
│
├── setup.ps1                  # Script installation
├── start-all.ps1             # Démarrage serveurs
├── stop-all.ps1              # Arrêt serveurs
└── README.md                 # Ce fichier
```

---

## 🔧 Configuration

### Variables d'Environnement (Optionnel)

Pour personnaliser la configuration, créer un fichier `.env` à la racine du backend :

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,10.0.2.2

# Base de données (SQLite par défaut)
DATABASE_URL=sqlite:///db.sqlite3

# Email (Backend fichier par défaut)
EMAIL_BACKEND=django.core.mail.backends.filebased.EmailBackend
EMAIL_FILE_PATH=emails

# Pour utiliser un vrai serveur SMTP (optionnel)
# EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=votre-email@gmail.com
# EMAIL_HOST_PASSWORD=votre-mot-de-passe-app

# Firebase Cloud Messaging (optionnel)
FCM_SERVER_KEY=your-firebase-server-key
FCM_PROJECT_ID=your-project-id

# Redis (optionnel - pour Celery)
REDIS_URL=redis://localhost:6379/0
```

> **Note:** Le projet fonctionne sans configuration `.env`. Les valeurs par défaut sont dans `settings.py`.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📝 Changelog

### Version 1.0.0 (Novembre 2025) - Version Finale

- ✅ Système de modération complet (approve/reject)
- ✅ Applications web et mobile fonctionnelles
- ✅ Notifications email avec template HTML
- ✅ Firebase Cloud Messaging pour notifications push
- ✅ RBAC avec 4 rôles (Admin, Modérateur, Publiant, Étudiant)
- ✅ Workflow de validation à 3 étapes
- ✅ Dashboard d'administration (web + mobile)
- ✅ Écran paramètres mobile avec préférences
- ✅ API REST complète avec endpoints de modération
- ✅ Tests complets avec données de démonstration
- ✅ Scripts PowerShell d'automatisation (setup, start, stop)
- ✅ Documentation complète en français

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique complet des modifications.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Anthony Kamoto**  
📧 Email: <aanthonykamoto1@gmail.com>  
🔗 GitHub: [@AnthonyKamoto](https://github.com/AnthonyKamoto)  
🏢 Organisation: Fondation Children Coding Club  
📅 Projet N°3 - Mini Projet - Novembre 2025  
🎓 Formation: Développement Full-Stack (Django + React + Flutter)

---

## 🙏 Remerciements

- Fondation Children Coding Club
- Universités de Kinshasa (UNIKIN, UPN)
- Communauté Django, React et Flutter

---

## 📞 Support

Pour toute question ou problème :

- 📧 Email: <aanthonykamoto1@gmail.com>
- 📚 Documentation: [docs/](docs/) et [DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)
- 🐛 Issues: [GitHub Issues](https://github.com/AnthonyKamoto/UniKinHub/issues)
- 💬 Repository: [github.com/AnthonyKamoto/UniKinHub](https://github.com/AnthonyKamoto/UniKinHub)

---

<div align="center">
  <p>Fait avec ❤️ pour les étudiants de Kinshasa</p>
  <p>© 2025 Anthony Kamoto - Tous droits réservés</p>
</div>
