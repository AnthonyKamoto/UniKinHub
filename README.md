# 📰 Système de Gestion d'Actualités Universitaires

**Projet N°3 - Fondation Children Coding Club**  
**Développeur:** Anthony Kamoto  
**Email:** <aanthonykamoto1@gmail.com>  
**Version:** PI.10.25.FCCC-V003  
**Date:** Octobre 2025

Système centralisé de diffusion d'informations pour les étudiants des universités de Kinshasa (UNIKIN, UPN, etc.) avec application web et mobile.

---

## 📋 Table des Matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Fonctionnalités](#-fonctionnalités)
3. [Architecture](#-architecture)
4. [Technologies](#-technologies)
5. [Prérequis](#-prérequis)
6. [Installation](#-installation)
7. [Démarrage](#-démarrage)
8. [Utilisation](#-utilisation)
9. [Structure du Projet](#-structure-du-projet)
10. [Comptes de Test](#-comptes-de-test)
11. [Guide de Test](#-guide-de-test)
12. [API Documentation](#-api-documentation)
13. [Démonstration](#-démonstration)

---

## 🎯 Vue d'ensemble

### Contexte

Dans les universités de Kinshasa, les informations (annonces, événements, messages) sont dispersées. Ce système centralise la diffusion d'actualités avec :

- Un site web de consultation
- Une application mobile Android
- Des notifications configurables (email et push)
- Un système de modération des contenus

### Objectifs

- ✅ Centraliser la diffusion d'informations universitaires
- ✅ Permettre la consultation web et mobile
- ✅ Gérer les rôles et permissions (RBAC)
- ✅ Modérer les contenus avant publication
- ✅ Personnaliser les notifications par utilisateur

---

## ✨ Fonctionnalités

### Pour les Étudiants

- 📱 Consultation des actualités (web et mobile)
- 🔔 Notifications personnalisables (email/push)
- 🔍 Filtres avancés (catégorie, importance, date, université)
- ❤️ Like et interaction avec les actualités
- 📊 Visualisation par programme/faculté

### Pour les Publiants

- ✍️ Création d'actualités avec images
- 📝 Ciblage par université/faculté/département
- 🔄 Modification des brouillons
- 📈 Suivi du statut (brouillon, en attente, publié, rejeté)

### Pour les Modérateurs

- ✅ Validation ou rejet des actualités
- 💬 Ajout de commentaires de modération
- 📊 Statistiques de modération
- 🔍 Vue des actualités en attente

### Pour les Administrateurs

- 👥 Gestion des utilisateurs et rôles
- 🎓 Gestion des universités/facultés/départements
- 📊 Statistiques globales du système
- ⚙️ Configuration des paramètres

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND APPLICATIONS                     │
├──────────────────────────┬──────────────────────────────────┤
│   React Web (Vite)       │   Flutter Mobile (Android)       │
│   Port: 5173             │   Émulateur/Appareil            │
└──────────────────────────┴──────────────────────────────────┘
                            │
                            ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Django 5.2.7)                    │
├─────────────────────────────────────────────────────────────┤
│  • API REST (Django REST Framework)                         │
│  • Authentification Token                                    │
│  • RBAC (Role-Based Access Control)                         │
│  • Gestion des médias (images)                              │
│  • Système de notifications (email)                         │
│  Port: 8000                                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  BASE DE DONNÉES (SQLite)                    │
├─────────────────────────────────────────────────────────────┤
│  • Utilisateurs et rôles                                     │
│  • Actualités (news)                                         │
│  • Catégories                                                │
│  • Organisations (universités, facultés, départements)      │
│  • Logs de modération                                        │
└─────────────────────────────────────────────────────────────┘
```

### Diagramme Entité-Relation

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    Role     │         │     User     │         │  Universite │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id          │◄────┐   │ id           │    ┌───►│ id          │
│ nom         │     └───│ role         │    │    │ nom         │
│ permissions │         │ username     │    │    │ code        │
└─────────────┘         │ email        │    │    └─────────────┘
                        │ universite_id├────┘           │
                        │ faculte_id   ├────┐           │
                        │ departement  │    │    ┌──────▼─────┐
                        └──────┬───────┘    │    │   Faculte  │
                               │            │    ├────────────┤
                               │            └───►│ id         │
                        ┌──────▼────────┐       │ nom        │
                        │     News      │       │ universite │
                        ├───────────────┤       └────────────┘
                        │ id            │              │
                        │ title         │       ┌──────▼──────┐
                        │ content       │       │ Departement │
                        │ author_id     │       ├─────────────┤
                        │ category_id   ├───┐   │ id          │
                        │ status        │   │   │ nom         │
                        │ importance    │   │   │ faculte     │
                        │ image         │   │   └─────────────┘
                        │ publish_date  │   │
                        └───────────────┘   │
                                            │
                                     ┌──────▼────┐
                                     │  Category │
                                     ├───────────┤
                                     │ id        │
                                     │ name      │
                                     │ color     │
                                     └───────────┘
```

---

## 🛠️ Technologies

### Backend

- **Framework:** Django 5.2.7
- **API:** Django REST Framework 3.15.2
- **Base de données:** SQLite (développement) / PostgreSQL (production)
- **Authentification:** Token-based authentication
- **Gestion des médias:** Pillow
- **Email:** SMTP (Gmail, SendGrid, etc.)

### Frontend Web

- **Framework:** React 18.3.1
- **Build Tool:** Vite 4.5.14
- **UI Library:** Material-UI (MUI) 5.18.0
- **State Management:** React Context API
- **Routing:** React Router DOM 6.30.1
- **HTTP Client:** Axios 1.12.2
- **Forms:** React Hook Form 7.65.0 + Zod 3.25.76

### Mobile

- **Framework:** Flutter 3.35.6
- **Langage:** Dart
- **State Management:** Provider
- **HTTP Client:** http package
- **Notifications:** Firebase Cloud Messaging
- **Local Storage:** SharedPreferences

### DevOps

- **Versioning:** Git + GitHub
- **Scripts:** PowerShell (start-all.ps1, stop-all.ps1)
- **Package Manager:** pnpm (frontend), pip (backend), pub (mobile)

---

## 📦 Prérequis

### Logiciels Requis

| Logiciel | Version Minimale | Vérification |
|----------|------------------|--------------|
| Python | 3.10+ | `python --version` |
| Node.js | 18.0+ | `node --version` |
| pnpm | 9.0+ | `pnpm --version` |
| Flutter | 3.0+ | `flutter --version` |
| Git | 2.0+ | `git --version` |

### Optionnels

- Android Studio (pour l'émulateur Android)
- VS Code avec extensions : Python, Flutter, ESLint

### Système d'exploitation

- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 20.04+)

---

## 🚀 Installation

### 1. Cloner le Dépôt

```bash
git clone https://github.com/votre-repo/news-system.git
cd news-system
```

### 2. Backend Django

```powershell
# Naviguer vers le dossier backend
cd backend

# Créer l'environnement virtuel Python
python -m venv .venv

# Activer l'environnement
.\.venv\Scripts\Activate.ps1  # Windows
# ou
source .venv/bin/activate     # Linux/macOS

# Installer les dépendances
pip install -r requirements.txt

# Créer la base de données
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Peupler la base de données (optionnel)
python populate_db.py
```

### 3. Frontend React

```powershell
# Naviguer vers le dossier frontend
cd ../frontend

# Installer les dépendances
pnpm install
```

### 4. Mobile Flutter

```powershell
# Naviguer vers le dossier mobile
cd ../mobile

# Installer les dépendances
flutter pub get

# Vérifier l'installation
flutter doctor
```

### 5. Configuration

#### Backend (.env)

Créer `backend/.env` :

```env
SECRET_KEY=votre-cle-secrete-django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.198

# Configuration Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-app
```

#### Frontend

Aucune configuration requise (utilise <http://127.0.0.1:8000> par défaut)

#### Mobile

Modifier `mobile/lib/services/api_service.dart` si nécessaire :

```dart
static const String baseUrl = 'http://10.0.2.2:8000/api'; // Émulateur
// ou
static const String baseUrl = 'http://192.168.1.198:8000/api'; // Appareil physique
```

---

## 🎬 Démarrage

### Option 1 : Démarrage Automatique (Recommandé)

```powershell
# Depuis la racine du projet
.\start-all.ps1
```

Ce script lance automatiquement :

- ✅ Backend Django (port 8000)
- ✅ Frontend React (port 5173)
- ✅ Émulateur Android + Application Flutter

### Option 2 : Démarrage Manuel

#### Backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver 0.0.0.0:8000
```

#### Frontend

```powershell
cd frontend
pnpm dev
```

#### Mobile

```powershell
cd mobile
flutter emulators --launch Medium_Phone_API_36.1  # Lancer l'émulateur
flutter run -d emulator-5554
```

### Arrêter les Serveurs

```powershell
.\stop-all.ps1
```

---

## 👥 Comptes de Test

Voir le fichier `COMPTES_UTILISATEURS.txt` pour la liste complète.

### Accès Rapides

| Rôle | Username | Password | Email |
|------|----------|----------|-------|
| **Administrateur** | admin | admin123 | <admin@example.com> |
| **Modérateur** | moderateur1 | password123 | <mod1@unikin.ac.cd> |
| **Publiant** | publiant1 | password123 | <pub1@upn.ac.cd> |
| **Étudiant** | etudiant1 | password123 | <etud1@unikin.ac.cd> |

---

## 📖 Utilisation

### Accès aux Applications

- **Backend Admin:** <http://127.0.0.1:8000/admin>
- **Backend API:** <http://127.0.0.1:8000/api>
- **Frontend Web:** <http://localhost:5173>
- **Mobile:** Sur émulateur ou appareil Android

### Workflow Typique

#### 1. En tant qu'Étudiant

```
1. Se connecter (username: etudiant1, password: password123)
2. Consulter les actualités sur la page d'accueil
3. Filtrer par catégorie, importance, ou université
4. Liker une actualité
5. Configurer les préférences de notification
```

#### 2. En tant que Publiant

```
1. Se connecter (username: publiant1, password: password123)
2. Cliquer sur "Créer une actualité"
3. Remplir le formulaire :
   - Titre et contenu
   - Catégorie et importance
   - Ajouter une image (optionnel)
   - Cibler université/faculté/département
4. Soumettre pour modération
5. Voir le statut dans "Mes actualités"
```

#### 3. En tant que Modérateur

```
1. Se connecter (username: moderateur1, password: password123)
2. Accéder à "Modération" dans le menu
3. Consulter les actualités en attente
4. Approuver ou rejeter avec commentaire
5. Voir les statistiques de modération
```

#### 4. En tant qu'Administrateur

```
1. Se connecter (username: admin, password: admin123)
2. Accéder au panel d'administration (web: /admin)
3. Gérer les utilisateurs, rôles, et permissions
4. Créer/modifier universités, facultés, départements
5. Voir les statistiques globales
```

---

## 📁 Structure du Projet

```
MiniProjet_N3_CCC_AnthonyKamoto/
├── backend/                    # Backend Django
│   ├── news/                   # Application principale
│   │   ├── models.py          # Modèles de données
│   │   ├── views.py           # Vues API
│   │   ├── serializers.py     # Sérialiseurs DRF
│   │   ├── urls.py            # Routes API
│   │   └── admin.py           # Configuration admin
│   ├── news_system/           # Configuration Django
│   │   ├── settings.py        # Paramètres
│   │   └── urls.py            # URLs principales
│   ├── media/                 # Fichiers médias (images)
│   ├── static/                # Fichiers statiques
│   ├── templates/             # Templates HTML
│   ├── manage.py              # Script Django
│   ├── requirements.txt       # Dépendances Python
│   ├── populate_db.py         # Script de peuplement
│   └── db.sqlite3             # Base de données
│
├── frontend/                  # Frontend React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── pages/             # Pages de l'application
│   │   ├── contexts/          # Contexts React (AuthContext)
│   │   ├── services/          # Services API (axios)
│   │   ├── types/             # Types TypeScript
│   │   └── main.tsx           # Point d'entrée
│   ├── public/                # Assets publics
│   ├── package.json           # Dépendances npm
│   ├── vite.config.ts         # Configuration Vite
│   └── tsconfig.json          # Configuration TypeScript
│
├── mobile/                    # Application Flutter
│   ├── lib/
│   │   ├── models/            # Modèles de données
│   │   ├── providers/         # State management (Provider)
│   │   ├── screens/           # Écrans de l'application
│   │   ├── services/          # Services API
│   │   ├── widgets/           # Widgets réutilisables
│   │   └── main.dart          # Point d'entrée
│   ├── android/               # Configuration Android
│   ├── ios/                   # Configuration iOS
│   ├── pubspec.yaml           # Dépendances Flutter
│   └── README.md              # Documentation mobile
│
├── docs/                      # Documentation
│   ├── INSTALLATION.md        # Guide d'installation
│   ├── README.md              # Documentation générale
│   └── SMTP_CONFIGURATION.md  # Configuration email
│
├── start-all.ps1              # Script de démarrage
├── stop-all.ps1               # Script d'arrêt
├── COMPTES_UTILISATEURS.txt   # Liste des comptes de test
├── Projet_N3_Fondation_CCC.md # Spécifications du projet
└── README.md                  # Ce fichier
```

---

## 🧪 Guide de Test

### Tests Fonctionnels

#### 1. Authentification

- [ ] Connexion avec un compte existant
- [ ] Connexion avec des identifiants incorrects
- [ ] Inscription d'un nouveau compte
- [ ] Déconnexion

#### 2. Gestion des Actualités

- [ ] Création d'une actualité (publiant)
- [ ] Ajout d'une image à une actualité
- [ ] Modification d'un brouillon
- [ ] Suppression d'une actualité
- [ ] Filtrage par catégorie
- [ ] Filtrage par importance
- [ ] Filtrage par date
- [ ] Recherche par mot-clé

#### 3. Modération

- [ ] Voir la liste des actualités en attente
- [ ] Approuver une actualité
- [ ] Rejeter une actualité avec commentaire
- [ ] Voir les statistiques de modération

#### 4. Interactions

- [ ] Liker une actualité
- [ ] Retirer un like
- [ ] Voir le nombre de vues
- [ ] Partager une actualité (mobile)

#### 5. Notifications

- [ ] Configurer la fréquence des emails
- [ ] Recevoir une notification push (mobile)
- [ ] Désactiver les notifications

#### 6. Administration

- [ ] Créer un utilisateur
- [ ] Modifier les rôles
- [ ] Créer une université/faculté/département
- [ ] Voir les statistiques globales

### Tests Techniques

#### Backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py test
```

#### Frontend

```powershell
cd frontend
pnpm test
```

#### Mobile

```powershell
cd mobile
flutter test
```

### Scénarios de Test

#### Scénario 1 : Publication d'une actualité complète

```
1. Connexion en tant que publiant (publiant1)
2. Créer une actualité avec image
3. Soumettre pour modération
4. Déconnexion
5. Connexion en tant que modérateur (moderateur1)
6. Approuver l'actualité
7. Déconnexion
8. Connexion en tant qu'étudiant (etudiant1)
9. Vérifier que l'actualité apparaît
10. Liker l'actualité
```

#### Scénario 2 : Rejet et modification

```
1. Publiant crée une actualité
2. Modérateur rejette avec commentaire
3. Publiant modifie et resoumet
4. Modérateur approuve
```

---

## 📡 API Documentation

### Base URL

```
http://127.0.0.1:8000/api
```

### Authentification

Toutes les requêtes authentifiées nécessitent un header :

```
Authorization: Token <votre_token>
```

### Endpoints Principaux

#### Authentification

```http
POST /api/auth/login/
Body: { "username": "string", "password": "string" }
Response: { "token": "string", "user": {...} }

POST /api/auth/logout/
Response: { "message": "Déconnexion réussie" }

GET /api/auth/me/
Response: { "id": int, "username": "string", ... }
```

#### Actualités

```http
GET /api/news/
Query Params: ?category=1&importance=high&search=mot
Response: { "results": [...], "count": int }

GET /api/news/{id}/
Response: { "id": int, "title": "string", ... }

POST /api/news/create/
Body: FormData { title, content, category, image (file) }
Response: { "id": int, "title": "string", ... }
```

#### Catégories

```http
GET /api/categories/
Response: [{ "id": int, "name": "string", "color": "#hex" }]
```

#### Rôles et Organisations

```http
GET /api/roles/
GET /api/universites/
GET /api/facultes/?universite=1
GET /api/departements/?faculte=1
```

#### Modération

```http
GET /api/admin/news/pending/
Response: [{ "id": int, "title": "string", "status": "pending" }]

POST /api/admin/news/{id}/moderate/
Body: { "action": "approve|reject" }
```

---

## 🎥 Démonstration

### Screenshots

#### Interface Web

![Page d'accueil](docs/screenshots/home-web.png)
![Création d'actualité](docs/screenshots/create-news-web.png)
![Modération](docs/screenshots/moderation-web.png)

#### Application Mobile

![Accueil Mobile](docs/screenshots/home-mobile.png)
![Filtres](docs/screenshots/filters-mobile.png)
![Profil](docs/screenshots/profile-mobile.png)

### Vidéo de Démonstration

Lien vers la vidéo : [YouTube/Drive]

---

## 📚 Documentation Complémentaire

- [Guide d'Installation Détaillé](docs/INSTALLATION.md)
- [Configuration SMTP](docs/SMTP_CONFIGURATION.md)
- [Connexion API Mobile](docs/MOBILE_API_CONNECTION.md)
- [Notifications Email](docs/NOTIFICATIONS_EMAIL.md)

---

## 🤝 Contribution

### Équipe de Développement

- **Encadrant:** DIOGO NORMAN Nono
- **Développeur:** Anthony Kamoto (<aanthonykamoto1@gmail.com>)
- **Organisation:** Fondation Children Coding Club

### Workflow Git

```bash
# Créer une branche pour une nouvelle fonctionnalité
git checkout -b feature/nouvelle-fonctionnalite

# Faire des commits réguliers
git add .
git commit -m "Description des changements"

# Pousser vers le dépôt
git push origin feature/nouvelle-fonctionnalite
```

---

## 🐛 Dépannage

### Problèmes Courants

#### Backend ne démarre pas

```powershell
# Vérifier que l'environnement virtuel est activé
.\.venv\Scripts\Activate.ps1

# Vérifier les dépendances
pip install -r requirements.txt

# Vérifier les migrations
python manage.py migrate
```

#### Frontend ne se lance pas

```powershell
# Réinstaller les dépendances
pnpm install

# Vérifier le port 5173 n'est pas utilisé
netstat -ano | findstr :5173
```

#### Mobile ne compile pas

```powershell
# Nettoyer et récupérer les dépendances
flutter clean
flutter pub get

# Vérifier la configuration
flutter doctor
```

#### Erreur 404 sur les images

Vérifier que le dossier `backend/media/news/images/` existe et que `MEDIA_URL` est configuré dans Django.

---

## 📄 Licence

Ce projet est développé dans le cadre du programme de formation de la **Fondation Children Coding Club**.

---

## 📞 Contact

### Développeur du Projet

**Anthony Kamoto**  
Email: <aanthonykamoto1@gmail.com>  
GitHub: [Anthony Kamoto](https://github.com/anthonykamoto)

### Organisation

**Fondation Children Coding Club**

---

**Dernière mise à jour:** 29 Octobre 2025  
**Version:** 1.0.0  
**Développé par:** Anthony Kamoto
