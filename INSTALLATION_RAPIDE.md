# 🚀 Guide d'Installation Rapide - UniKinHub

**Version:** 1.0.0  
**Date:** 30 Octobre 2025  
**Développeur:** Anthony Kamoto

---

## ⚡ Installation Rapide (10 minutes)

Ce guide vous permettra de tester rapidement l'application UniKinHub.

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

| Logiciel | Version | Téléchargement |
|----------|---------|----------------|
| **Python** | 3.10+ | <https://www.python.org/downloads/> |
| **Node.js** | 18.0+ | <https://nodejs.org/> |
| **pnpm** | 9.0+ | `npm install -g pnpm` |
| **Flutter** | 3.0+ | <https://flutter.dev/docs/get-started/install> |

### Vérification des prérequis

```powershell
# Vérifier les versions installées
python --version      # Doit être >= 3.10
node --version        # Doit être >= 18.0
pnpm --version        # Doit être >= 9.0
flutter --version     # Doit être >= 3.0
```

---

## 📦 Installation

### Étape 1 : Extraire le projet

Décompressez l'archive `UniKinHub.zip` dans un dossier de votre choix.

### Étape 2 : Ouvrir PowerShell

```powershell
# Ouvrir PowerShell en mode Administrateur
# Naviguer vers le dossier du projet
cd chemin\vers\UniKinHub
```

### Étape 3 : Installation automatique

```powershell
# Lancer le script d'installation
.\setup.ps1
```

Ce script va automatiquement :

- ✅ Créer l'environnement virtuel Python
- ✅ Installer les dépendances backend (Django)
- ✅ Créer la base de données
- ✅ Installer les dépendances frontend (React)
- ✅ Installer les dépendances mobile (Flutter)
- ✅ Peupler la base avec des données de test

**Durée estimée :** 5-7 minutes

---

## 🎬 Démarrage

### Lancer tous les serveurs

```powershell
.\start-all.ps1
```

Ce script démarre automatiquement :

- 🔧 Backend Django (port 8000)
- 🌐 Frontend React (port 5173)
- 📱 Émulateur Android + Application Flutter

**Durée de démarrage :** 30-60 secondes

### Accéder aux applications

| Application | URL | Description |
|-------------|-----|-------------|
| **Frontend Web** | <http://localhost:5173> | Interface web étudiants |
| **Backend API** | <http://127.0.0.1:8000/api> | API REST |
| **Admin Django** | <http://127.0.0.1:8000/admin> | Interface administration |
| **Mobile** | Émulateur Android | Application mobile |

---

## 👥 Comptes de Test

Utilisez ces comptes pour tester les différentes fonctionnalités :

### Compte Administrateur

- **Username:** admin
- **Password:** admin123
- **Rôle:** Gestion complète du système

### Compte Modérateur

- **Username:** moderateur1
- **Password:** password123
- **Rôle:** Modération des actualités

### Compte Publiant

- **Username:** publiant1
- **Password:** password123
- **Rôle:** Création d'actualités

### Compte Étudiant

- **Username:** etudiant1
- **Password:** password123
- **Rôle:** Consultation des actualités

> **Note:** 18 comptes de test sont disponibles. Voir `COMPTES_UTILISATEURS.txt` pour la liste complète.

---

## 🧪 Scénarios de Test

### Test 1 : Consultation d'actualités (Étudiant)

```
1. Ouvrir http://localhost:5173
2. Se connecter avec etudiant1 / password123
3. Consulter les actualités sur la page d'accueil
4. Cliquer sur une actualité pour voir les détails
5. Liker une actualité
6. Utiliser les filtres (catégorie, importance, date)
```

### Test 2 : Création d'actualité (Publiant)

```
1. Se connecter avec publiant1 / password123
2. Cliquer sur "Créer une actualité"
3. Remplir le formulaire :
   - Titre : "Test actualité"
   - Contenu : "Ceci est un test"
   - Catégorie : Académique
   - Importance : Moyenne
   - Ajouter une image (optionnel)
4. Soumettre
5. Vérifier que le statut est "En attente de modération"
```

### Test 3 : Modération (Modérateur)

```
1. Se connecter avec moderateur1 / password123
2. Aller dans "Modération"
3. Voir la liste des actualités en attente
4. Cliquer sur une actualité
5. Approuver ou rejeter avec un commentaire
6. Vérifier que l'actualité change de statut
```

### Test 4 : Administration (Admin)

```
1. Se connecter avec admin / admin123
2. Accéder au panel d'administration (http://127.0.0.1:8000/admin)
3. Voir les statistiques globales
4. Gérer les utilisateurs et rôles
5. Créer une nouvelle université/faculté
```

### Test 5 : Application Mobile

```
1. Ouvrir l'émulateur Android
2. Se connecter avec etudiant1 / password123
3. Consulter les actualités
4. Tester les filtres avancés
5. Voir le profil utilisateur
6. Configurer les notifications
```

---

## 🛑 Arrêt

### Arrêter tous les serveurs

```powershell
.\stop-all.ps1
```

---

## ❗ Problèmes Courants

### Problème : Backend ne démarre pas

**Solution :**

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```

### Problème : Frontend affiche une page blanche

**Solution :**

```powershell
cd frontend
pnpm install
pnpm dev
```

### Problème : Mobile ne compile pas

**Solution :**

```powershell
cd mobile
flutter clean
flutter pub get
flutter doctor  # Vérifier les problèmes
```

### Problème : Port déjà utilisé

**Solution :**

```powershell
# Trouver le processus qui utilise le port 8000
netstat -ano | findstr :8000

# Tuer le processus (remplacer PID par l'ID du processus)
taskkill /PID <PID> /F
```

### Problème : Erreur de permissions PowerShell

**Solution :**

```powershell
# Exécuter en mode Administrateur
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## 📊 Fonctionnalités à Tester

### Frontend Web

- ✅ Authentification (connexion/déconnexion)
- ✅ Liste des actualités avec pagination
- ✅ Filtres avancés (catégorie, importance, date, université)
- ✅ Création d'actualité avec upload d'image
- ✅ Modération des actualités
- ✅ Interface admin (statistiques, gestion utilisateurs)
- ✅ Profil utilisateur et préférences
- ✅ Notifications email configurables

### Application Mobile

- ✅ Authentification
- ✅ Liste des actualités avec images
- ✅ Filtres avancés
- ✅ Détails d'actualité
- ✅ Like/Unlike
- ✅ Profil utilisateur
- ✅ Préférences de notification
- ✅ Interface responsive

### Backend API

- ✅ Authentification par token
- ✅ CRUD complet des actualités
- ✅ Système de modération
- ✅ Gestion des rôles et permissions (RBAC)
- ✅ Upload et gestion des images
- ✅ Notifications email
- ✅ Statistiques et logs

---

## 📝 Retour d'Informations

Après vos tests, merci de me faire parvenir :

1. **Fonctionnalités testées** : Liste des fonctionnalités que vous avez pu tester
2. **Problèmes rencontrés** : Bugs, erreurs, comportements inattendus
3. **Suggestions** : Améliorations, nouvelles fonctionnalités
4. **Performance** : Vitesse de l'application, temps de réponse
5. **Interface** : Ergonomie, design, facilité d'utilisation

**Contact :**

- Email : <aanthonykamoto1@gmail.com>
- GitHub : <https://github.com/AnthonyKamoto/UniKinHub>

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **README.md** : Documentation complète du projet
- **COMPTES_UTILISATEURS.txt** : Liste de tous les comptes de test
- **docs/** : Documentation technique détaillée

---

**Bonne exploration d'UniKinHub ! 🚀**
