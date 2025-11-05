# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2025-11-05

### ✨ Ajouté

- Système de modération complet avec workflow approval/rejection
- Application web React avec Material-UI
- Application mobile Flutter avec Material Design 3
- API REST complète avec Django REST Framework
- Authentification par token
- Système de rôles (Admin, Modérateur, Publiant, Étudiant)
- Notifications email (modération, publication)
- Upload d'images pour les actualités
- Filtres avancés (catégorie, importance, programme)
- Statistiques pour modérateurs
- Système de likes et commentaires
- Recherche d'actualités
- Gestion des catégories
- Système de permissions RBAC

### 🔧 Backend

- Django 5.2.7 avec DRF
- SQLite pour développement
- Celery pour tâches asynchrones
- Token authentication
- ViewSet pour endpoints news
- Serializers pour validation
- Permissions personnalisées
- Middleware CORS
- File upload handling

### 🎨 Frontend Web

- React 18 avec TypeScript
- Vite pour build rapide
- Material-UI v5
- React Router pour navigation
- Axios pour API calls
- Context API pour state management
- React Hook Form + Zod validation
- Responsive design
- Dark mode support

### 📱 Mobile

- Flutter 3.35.6
- Material Design 3
- Provider pour state management
- HTTP package pour API
- SharedPreferences pour stockage local
- Image picker pour upload
- Pull-to-refresh
- Navigation drawer

### 🔒 Sécurité

- Authentication par token
- Permissions par rôle
- Validation des inputs
- CORS configuré
- CSRF protection
- SQL injection prevention (ORM)

### 📚 Documentation

- README principal
- Guide d'installation
- Documentation API
- Guide des comptes de test
- Documentation du workflow
- Scripts PowerShell automatisés

### 🧪 Tests

- 6 comptes de test configurés
- Workflow de modération validé
- Tests d'intégration API
- Tests des endpoints principaux

### 🐛 Corrections

- Fixed: Serializer `get_time_since()` null pointer exception
- Fixed: Category field validation (integer instead of string)
- Fixed: News status assignment for publishers
- Fixed: Mobile `getPendingNews()` endpoint URL
- Fixed: Mobile moderation action format (comment vs reason)
- Fixed: Token naming unification (`auth_token`)

## [0.9.0] - 2025-10-28

### ✨ Ajouté

- Structure initiale du projet
- Modèles Django de base
- Configuration initiale React
- Configuration initiale Flutter
- Scripts de setup automatisé

### 🔧 Technique

- Configuration environnement backend
- Configuration environnement frontend
- Configuration environnement mobile
- Scripts PowerShell (setup, start-all, stop-all)

## [Unreleased]

### 🚀 À venir

- [ ] Notifications push Firebase
- [ ] Support PostgreSQL en production
- [ ] Tests unitaires complets
- [ ] Tests E2E
- [ ] CI/CD pipeline
- [ ] Docker containers
- [ ] Déploiement cloud
- [ ] Système de cache Redis
- [ ] Websockets pour notifications temps réel
- [ ] Application iOS
- [ ] Internationalisation (i18n)
- [ ] Mode hors ligne mobile
- [ ] Analytics et monitoring
- [ ] Export PDF des actualités

### 🐛 Bugs connus

- Réponse JSON vide après création de news (mineur - données sauvegardées correctement)
- Tokens expirés après redémarrage serveur (requis: reconnexion)

---

## Types de changements

- `✨ Ajouté` pour les nouvelles fonctionnalités
- `🔧 Modifié` pour les changements aux fonctionnalités existantes
- `🗑️ Déprécié` pour les fonctionnalités bientôt supprimées
- `🔥 Supprimé` pour les fonctionnalités supprimées
- `🐛 Corrigé` pour les corrections de bugs
- `🔒 Sécurité` pour les correctifs de vulnérabilités
