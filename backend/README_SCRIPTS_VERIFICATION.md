# 🔍 Scripts de Vérification des Données

Ce dossier contient plusieurs scripts pour vérifier que les données de test sont bien en base de données.

## 🚀 Script Principal (Recommandé)

### ✅ `check_database.py` - Vérification Rapide
**Le script le plus simple et complet**

```bash
cd backend
.\.venv\Scripts\python.exe check_database.py
```

**Affiche** :
- ✅ Localisation du fichier db.sqlite3
- ✅ Taille du fichier
- ✅ Comptage de tous les enregistrements
- ✅ Échantillon de données réelles
- ✅ Instructions d'utilisation

**Utilisation** : À exécuter à tout moment pour vérifier rapidement la base.

---

## 📊 Scripts de Statistiques

### `show_stats.py` - Statistiques Globales
```bash
.\.venv\Scripts\python.exe show_stats.py
```
Affiche le résumé des données par catégorie, rôle, statut.

### `show_examples.py` - Exemples de Données
```bash
.\.venv\Scripts\python.exe show_examples.py
```
Affiche quelques actualités et utilisateurs en exemple.

### `show_database_content.py` - Contenu Détaillé
```bash
.\.venv\Scripts\python.exe show_database_content.py
```
Affiche le contenu complet avec détails (utilisateurs, actualités, commentaires, likes).

---

## 🔬 Scripts de Vérification Technique

### `verify_database.py` - Vérification Django ORM
```bash
.\.venv\Scripts\python.exe verify_database.py
```
Vérifie via Django ORM avec statistiques complètes.

### `verify_sqlite_db.py` - Vérification SQL Directe
```bash
.\.venv\Scripts\python.exe verify_sqlite_db.py
```
Requêtes SQL directes sur la base SQLite pour prouver la persistance.

---

## 📦 Résumé des Données Disponibles

Après exécution de `populate_test_data`, vous avez :

| Type | Quantité |
|------|----------|
| 👥 Utilisateurs | 47 |
| 📰 Actualités | 70 |
| 🏷️ Catégories | 7 |
| 💬 Commentaires | 80 |
| ❤️ Likes | 187 |

**Détails** :
- Actualités : 36 publiées, 14 en attente, 20 brouillons
- Utilisateurs : 1 admin, 13 modérateurs, 8 enseignants, 7 publiants, 18 étudiants

---

## 🎯 Workflow Recommandé

### 1️⃣ Première vérification
```bash
cd backend
.\.venv\Scripts\python.exe check_database.py
```

### 2️⃣ Voir les statistiques
```bash
.\.venv\Scripts\python.exe show_stats.py
```

### 3️⃣ Voir des exemples
```bash
.\.venv\Scripts\python.exe show_examples.py
```

---

## 🌐 Tester les Données dans l'Application

### Application Web
```bash
cd frontend
pnpm dev
# Ouvrir http://localhost:3001/
# Se connecter avec admin/admin123
```

### Django Admin
```bash
cd backend
.\.venv\Scripts\python.exe manage.py runserver
# Ouvrir http://localhost:8000/admin/
# Login: admin / admin123
```

### Application Mobile
```bash
cd mobile
flutter run
# Se connecter avec moderateur1/password123
```

---

## 📝 Documentation Complète

- **DONNEES_TEST.md** : Documentation sur les données de test
- **CONFIRMATION_DONNEES_EN_BASE.md** : Confirmation détaillée
- **PREUVE_DONNEES_EN_BASE.md** : Preuves irréfutables

---

## 🔄 Créer Plus de Données

```bash
cd backend
.\.venv\Scripts\python.exe manage.py populate_test_data --users 10 --news 20 --comments 40
```

---

## ❓ Questions Fréquentes

**Q: Les données sont-elles en mémoire ou en base ?**  
R: Toutes les données sont **physiquement stockées** dans `backend/db.sqlite3` (488 KB).

**Q: Les données survivent-elles au redémarrage ?**  
R: Oui, elles sont **persistantes** dans le fichier SQLite.

**Q: Comment vérifier rapidement ?**  
R: Exécutez `check_database.py` - c'est le script le plus simple.

**Q: Les applications utilisent-elles ces données ?**  
R: Oui, Web et Mobile accèdent aux **mêmes données** via l'API REST.

---

## 📁 Localisation du Fichier de Base

```
backend/db.sqlite3
```

Taille : ~488 KB  
Format : SQLite 3 Database  
Tables : 25 tables avec données réelles
