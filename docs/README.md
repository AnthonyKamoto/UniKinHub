# Système de Diffusion d'Informations pour les Étudiants de Kinshasa

Un système complet de gestion et diffusion d'actualités pour les universités de Kinshasa, développé avec Django (backend) et Flutter (mobile).

## 🏗️ Architecture

- **Backend** : Django 5.2.7 avec Django REST Framework
- **Base de données** : SQLite
- **Frontend mobile** : Flutter avec Provider pour la gestion d'état
- **API** : REST API avec authentification et pagination

## 📁 Structure du Projet

```
MiniProjet_N3_CCC_AnthonyKamoto/
├── backend/                     # API Django
│   ├── news_system/            # Configuration principale
│   ├── news/                   # Application actualités
│   ├── manage.py              # Commandes Django
│   ├── db.sqlite3             # Base de données
│   └── create_test_data.py    # Script de données de test
├── mobile/                     # Application Flutter
│   ├── lib/
│   │   ├── models/            # Modèles de données
│   │   ├── services/          # Services API
│   │   ├── providers/         # Gestion d'état
│   │   ├── screens/           # Écrans de l'app
│   │   └── main.dart          # Point d'entrée
│   └── pubspec.yaml           # Dépendances Flutter
├── docs/                       # Documentation
└── .venv/                      # Environnement virtuel Python
```

## 🚀 Installation et Configuration

### Prérequis

- Python 3.12+
- Flutter 3.9+
- VS Code avec extensions Flutter et Django

### 1. Backend Django

```bash
# Naviguer vers le dossier du projet
cd MiniProjet_N3_CCC_AnthonyKamoto

# Activer l'environnement virtuel
.venv\Scripts\activate  # Windows
# ou
source .venv/bin/activate  # Linux/Mac

# Naviguer vers le backend
cd backend

# Installer les dépendances (déjà fait si vous suivez ce guide)
pip install django djangorestframework django-cors-headers pillow

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Créer des données de test
python manage.py shell < create_test_data.py

# Démarrer le serveur
python manage.py runserver
```

Le serveur Django sera accessible sur <http://127.0.0.1:8000/>

### 2. Application Flutter

```bash
# Naviguer vers le dossier mobile
cd ../mobile

# Récupérer les dépendances
flutter pub get

# Lancer l'application
flutter run
```

## 🔧 Configuration

### Variables d'Environnement

**Backend (settings.py)**

- `DEBUG = True` (développement seulement)
- `ALLOWED_HOSTS = []` (développement)
- Base de données SQLite configurée automatiquement

**Flutter (api_service.dart)**

- `baseUrl = 'http://127.0.0.1:8000/api'` (développement)

## 📱 Fonctionnalités

### Backend Django

#### Interface d'Administration

- URL : <http://127.0.0.1:8000/admin/>
- Gestion des utilisateurs avec rôles (admin, modérateur, publiant, étudiant)
- Gestion des actualités avec modération
- Gestion des catégories et notifications

#### API REST

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/categories/` | GET | Liste des catégories |
| `/api/news/` | GET | Liste des actualités avec filtres |
| `/api/news/{id}/` | GET | Détail d'une actualité |
| `/api/news/create/` | POST | Créer une actualité |
| `/api/news/{id}/like/` | POST/DELETE | Liker/Disliker |
| `/api/dashboard/` | GET | Statistiques |
| `/api/auth/register/` | POST | Inscription |
| `/api/auth/profile/` | GET/PUT | Profil utilisateur |

### Application Flutter

#### Écrans Disponibles

- **Accueil** : Liste des actualités avec filtres et recherche
- **Détail** : Contenu complet d'une actualité avec métadonnées
- **Navigation** : Interface moderne avec Material Design

#### Fonctionnalités

- Pagination infinie
- Filtres par catégorie, importance, université
- Recherche textuelle
- Système de likes
- Gestion des erreurs réseau
- Interface responsive

## 👥 Rôles Utilisateurs

### Administrateur

- Gestion complète du système
- Accès à toutes les fonctionnalités
- Modération des contenus

### Modérateur

- Validation des actualités
- Gestion des contenus signalés

### Publiant

- Création d'actualités
- Gestion de ses propres contenus

### Étudiant

- Consultation des actualités
- Interactions (likes, vues)
- Personnalisation des notifications

## 🗄️ Modèles de Données

### User (Utilisateur)

- Informations personnelles
- Rôle et permissions
- Université et programme
- Statut de vérification

### News (Actualité)

- Contenu et métadonnées
- Statut de publication
- Ciblage par université/programme
- Statistiques de vues et likes

### Category (Catégorie)

- Organisation des actualités
- Couleurs personnalisées
- Statistiques d'utilisation

### Notification

- Système de notifications
- Préférences utilisateur
- Historique des envois

## 🧪 Tests

### Tests Backend

```bash
cd backend
python manage.py test
```

### Tests Flutter

```bash
cd mobile
flutter test
```

## 📊 Données de Test

Le script `create_test_data.py` crée automatiquement :

- 6 catégories d'actualités
- 4 utilisateurs avec différents rôles
- 6 actualités d'exemple
- Données réalistes pour l'université de Kinshasa

## 🔒 Sécurité

- Authentification par session Django
- Validation des données d'entrée
- Protection CSRF
- Permissions basées sur les rôles
- Configuration CORS pour l'API

## 🚀 Déploiement

### Production Backend

1. Configurer une base de données PostgreSQL
2. Définir `DEBUG = False`
3. Configurer `ALLOWED_HOSTS`
4. Utiliser un serveur WSGI (Gunicorn)
5. Configurer les fichiers statiques

### Production Flutter

1. Construire l'APK : `flutter build apk`
2. Configurer l'URL de production dans ApiService
3. Tester sur différents appareils

## 📝 Contribution

1. Fork du projet
2. Créer une branche feature
3. Commiter les changements
4. Push vers la branche
5. Créer une Pull Request

## 📞 Support

Pour toute question ou problème :

- Consulter la documentation Django : <https://docs.djangoproject.com/>
- Documentation Flutter : <https://flutter.dev/docs>
- Issues GitHub du projet

## 📄 Licence

Projet éducatif - Fondation Children Coding Club

---

*Développé dans le cadre du MiniProjet N3 pour les étudiants de Kinshasa sous la supervision de DIOGO NORMAN Nono.*
