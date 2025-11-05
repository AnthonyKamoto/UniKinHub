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
- **Backend:** Django 5.2.7 + DRF + Token Auth + Celery
- **Frontend:** React 18 + TypeScript + Material-UI + Vite
- **Mobile:** Flutter 3.35.6 + Provider + Material Design 3
- **Base de données:** SQLite (dev) / PostgreSQL (prod)
- **Notifications:** Firebase Cloud Messaging
- **Tâches:** Celery + Redis

---

## 🚀 Démarrage Rapide

### Prérequis
- Python 3.12+
- Node.js 18+ & pnpm
- Flutter 3.35+
- Git

### Installation en une commande

**Windows PowerShell:**
```powershell
.\setup.ps1
```

**Démarrage de tous les serveurs:**
```powershell
.\start-all.ps1
```

> **Accès:**
> - 🌐 Web: http://localhost:3001
> - 🔧 API: http://localhost:8000/api
> - 📱 Mobile: Via émulateur Android

---

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| [📘 Installation](docs/INSTALLATION.md) | Guide d'installation détaillé |
| [🚀 Démarrage](DEMARRAGE_RAPIDE.md) | Lancement rapide des serveurs |
| [🔐 Authentification](docs/AUTHENTICATION.md) | Système d'auth et tokens |
| [📡 API](docs/API.md) | Documentation API complète |
| [🔔 Notifications](docs/NOTIFICATIONS_EMAIL.md) | Config email et push |
| [🧪 Tests](docs/TESTING.md) | Guide de test et comptes |
| [🏗️ Architecture](docs/ARCHITECTURE.md) | Architecture détaillée |

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
# Création news (enseignant1)
curl -X POST http://localhost:8000/api/api/news-api/ \
  -H "Authorization: Token {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "draft_title": "Test",
    "draft_content": "Contenu",
    "category": 1
  }'

# Liste news en attente (admin/moderateur)
curl http://localhost:8000/api/api/news-api/pending/ \
  -H "Authorization: Token {token}"

# Approbation (admin/moderateur)
curl -X POST http://localhost:8000/api/api/news-api/{id}/approve/ \
  -H "Authorization: Token {token}" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Approuvé"}'
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

### Variables d'Environnement

Créer un fichier `.env` à la racine :

```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de données
DATABASE_URL=sqlite:///db.sqlite3

# Email
EMAIL_BACKEND=django.core.mail.backends.filebased.EmailBackend
EMAIL_FILE_PATH=emails

# Firebase (optionnel)
FCM_SERVER_KEY=your-firebase-server-key
FCM_PROJECT_ID=your-project-id
```

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

### Version 1.0.0 (Nov 2025)
- ✅ Système de modération complet
- ✅ Applications web et mobile fonctionnelles
- ✅ Notifications email et push
- ✅ RBAC avec 4 rôles
- ✅ Workflow de validation
- ✅ Tests complets

Voir [CHANGELOG.md](docs/CHANGELOG.md) pour l'historique complet.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Anthony Kamoto**  
📧 Email: aanthonykamoto1@gmail.com  
🏢 Organisation: Fondation Children Coding Club  
📅 Projet N°3 - Octobre 2025

---

## 🙏 Remerciements

- Fondation Children Coding Club
- Universités de Kinshasa (UNIKIN, UPN)
- Communauté Django, React et Flutter

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email: aanthonykamoto1@gmail.com
- 📚 Documentation: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/AnthonyKamoto/UniKinHub/issues)

---

<div align="center">
  <p>Fait avec ❤️ pour les étudiants de Kinshasa</p>
  <p>© 2025 Anthony Kamoto - Tous droits réservés</p>
</div>
