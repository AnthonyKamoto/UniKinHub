# 🧪 Données de test pour UniKinHub

Ce document explique comment créer et utiliser les données de test pour l'application.

## 📊 Données actuellement disponibles

Après exécution de la commande de peuplement, vous disposez de :

- **47 utilisateurs** avec différents rôles :
  - 1 Admin (super utilisateur)
  - 13 Modérateurs
  - 8 Enseignants
  - 7 Publiants
  - 18 Étudiants

- **70 actualités** dans différents états :
  - 35 Publiées (visibles sur l'application)
  - 15 En attente de modération
  - 20 Brouillons

- **7 catégories** d'actualités :
  - Académique
  - Événements
  - Sports
  - Administratif
  - Recherche
  - Vie étudiante
  - Infrastructure

- **80 commentaires** sur les actualités publiées
- **187 likes** sur les actualités

## 🚀 Commandes disponibles

### Créer des données de test

```bash
cd backend
.\.venv\Scripts\python.exe manage.py populate_test_data
```

**Options disponibles** :

```bash
# Personnaliser le nombre d'éléments
.\.venv\Scripts\python.exe manage.py populate_test_data --users 30 --news 50 --comments 100

# Aide
.\.venv\Scripts\python.exe manage.py populate_test_data --help
```

### Voir les statistiques

```bash
.\.venv\Scripts\python.exe show_stats.py
```

### Voir des exemples de données

```bash
.\.venv\Scripts\python.exe show_examples.py
```

## 👥 Comptes de test disponibles

Tous les utilisateurs créés utilisent le mot de passe : **`password123`**

### Compte Admin

- **Username** : `admin`
- **Password** : `admin123`
- **Rôle** : Administrateur global
- **Email** : <admin@unikin.cd>

### Exemples d'utilisateurs par rôle

**Modérateurs** :

- `moderateur1` / `password123` (Jean Moderateur)
- `moderateur2` / `password123` (Marie Moderatrice)

**Enseignants** :

- Format : `prenom.nom{numero}` / `password123`
- Exemple : `sandrine.kasongo1` / `password123`

**Publiants** :

- `enseignant1` / `password123` (Pierre Professeur)
- Format : `prenom.nom{numero}` / `password123`

**Étudiants** :

- `etudiant1` / `password123` (Paul Étudiant)
- `etudiant2` / `password123` (Sophie Étudiante)
- Format : `prenom.nom{numero}` / `password123`

## 🎯 Scénarios de test recommandés

### 1. Test de la modération

1. Connectez-vous avec un compte **modérateur** (`moderateur1` / `password123`)
2. Allez dans la section modération
3. Vous verrez **15 actualités en attente**
4. Approuvez ou rejetez des actualités

### 2. Test de création d'actualité

1. Connectez-vous avec un compte **enseignant** ou **publiant**
2. Créez une nouvelle actualité
3. Choisissez une catégorie parmi les 7 disponibles
4. L'actualité sera en attente de modération

### 3. Test de consultation

1. Connectez-vous avec un compte **étudiant**
2. Consultez les **35 actualités publiées**
3. Filtrez par catégorie
4. Likez et commentez les actualités

### 4. Test d'administration

1. Connectez-vous avec le compte **admin**
2. Accédez au tableau de bord admin
3. Consultez les statistiques :
   - Total actualités
   - Actualités récentes (7 derniers jours)
   - Notifications non lues
   - Catégories populaires
4. Gérez les utilisateurs (47 utilisateurs)
5. Modérez les actualités en attente (15)

## 🔄 Réinitialiser les données

Si vous voulez repartir de zéro :

### Option 1 : Supprimer toutes les données (conserve la structure)

```bash
.\.venv\Scripts\python.exe manage.py flush --no-input
```

### Option 2 : Recréer la base de données complètement

```bash
# Supprimer la base
rm db.sqlite3

# Recréer les tables
.\.venv\Scripts\python.exe manage.py migrate

# Recréer les données
.\.venv\Scripts\python.exe manage.py populate_test_data
```

## 📱 Test sur mobile

Les mêmes comptes fonctionnent sur l'application mobile Flutter :

1. Lancez l'app mobile
2. Utilisez n'importe quel compte ci-dessus
3. Toutes les données sont synchronisées via l'API

## 🎨 Personnalisation

Le script `populate_test_data.py` peut être modifié pour :

- Ajouter plus de templates d'actualités
- Changer les noms/prénoms
- Modifier les universités
- Ajuster les pourcentages de status (publié/brouillon/en attente)

Chemin : `backend/news/management/commands/populate_test_data.py`

## ⚠️ Notes importantes

1. Les données sont **réelles** et stockées dans la base de données
2. Les dates sont générées aléatoirement dans les **30 derniers jours**
3. Les likes et commentaires sont répartis aléatoirement
4. Toutes les actualités "publiées" sont visibles immédiatement
5. Les actualités "en attente" nécessitent une modération

## 🐛 Dépannage

**Erreur "table already exists"** :

- Les catégories existent déjà, c'est normal
- Le script utilise `get_or_create` pour éviter les doublons

**Pas assez d'actualités visibles** :

- Seulement les actualités avec `status='published'` sont visibles
- Utilisez les filtres dans l'admin pour voir les brouillons

**Mot de passe incorrect** :

- Utilisez `password123` pour tous les comptes sauf admin
- Admin utilise `admin123`
