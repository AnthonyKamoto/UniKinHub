# Guide de Démarrage Rapide - UniKinHub

## 🚀 Installation et Démarrage

### Option 1 : Setup Automatique (Recommandé)

```powershell
.\setup.ps1
```

Cette commande configure automatiquement tout le projet :
- ✅ Création des environnements virtuels (Python, Node.js)
- ✅ Installation des dépendances (backend, frontend, mobile)
- ✅ Configuration de la base de données
- ✅ Création des données de test
- ✅ Vérification des prérequis système

### Option 2 : Démarrage Rapide (après setup)

```powershell
.\start-all.ps1
```

Cette commande démarre automatiquement :

- ✅ Backend Django (API)
- ✅ Frontend React (interface web)
- ✅ Application Mobile Flutter
- ✅ Redis (pour les notifications - optionnel)
- ✅ Celery Worker (traitement des notifications)
- ✅ Celery Beat (planification automatique)

## 📋 Fonctionnalités Activées

### 👥 4 Rôles Utilisateurs

1. **Administrateurs** (`is_superuser=True`)
   - Gestion complète des utilisateurs
   - Invalidation des actualités publiées
   - Accès à toutes les fonctionnalités

2. **Modérateurs** (`is_staff=True` + groupe "Moderateurs")
   - Validation/rejet des actualités en attente
   - Modification du contenu avant publication
   - Ajout de commentaires de modération

3. **Publiants** (groupe "Publishers")
   - Création d'actualités
   - Visualisation de leurs actualités
   - Modification des brouillons

4. **Étudiants** (utilisateurs standard)
   - Consultation des actualités publiées
   - Filtrage par programme/importance

### 📰 Système de Modération

**Workflow:**

```
Brouillon → En attente → Validée → Publiée
                      ↓
                   Rejetée
```

**Champs obligatoires:**

- `programme_ou_formation` : Programme/formation ciblé
- `draft_title` / `draft_content` : Version initiale
- `final_title` / `final_content` : Version après modération
- `desired_publish_start` : Date de publication souhaitée
- `importance` : Faible, Moyenne, Importante, Urgente

### 🔔 Notifications Automatiques

**3 Fréquences:**

1. **Immédiates** (`frequency='immediate'`)
   - Envoyées dès la publication d'une actualité
   - Email + notification push instantanés

2. **Quotidiennes** (`frequency='daily'`)
   - Envoyées tous les jours à **8h00**
   - Résumé des actualités publiées dans les dernières 24h

3. **Hebdomadaires** (`frequency='weekly'`)
   - Envoyées tous les **lundis à 9h00**
   - Résumé de la semaine écoulée

**Configuration utilisateur:**

```python
# Exemple de préférences
{
    "email_notifications": true,
    "push_notifications": true,
    "notification_frequency": "daily",  # immediate, daily, weekly
    "importance_threshold": "medium"    # low, medium, high, urgent
}
```

## 🔗 Endpoints API Principaux

### Authentification

```
POST /api/auth/login/
POST /api/auth/register/
```

### Modération

```
GET  /api/moderation/news/               # Liste toutes les actualités
GET  /api/moderation/news/pending/       # Actualités en attente
GET  /api/moderation/news/my_news/       # Mes actualités
POST /api/moderation/news/{id}/moderate/ # Modérer
POST /api/moderation/news/{id}/approve/  # Approuver
POST /api/moderation/news/{id}/reject/   # Rejeter
POST /api/moderation/news/{id}/invalidate/ # Invalider (admin)
```

### Filtres

```
GET /api/moderation/news/by_importance/?importance=urgent
GET /api/moderation/news/by_program/?program=Licence%20Informatique
```

## 🛑 Arrêter Tous les Services

```powershell
.\stop-all.ps1
```

## 📊 Vérification des Tâches Celery

```powershell
# Voir les tâches planifiées
cd backend
..\.venv\Scripts\celery.exe -A news_system inspect scheduled

# Voir les tâches actives
..\.venv\Scripts\celery.exe -A news_system inspect active
```

## 🔧 Configuration Redis (si nécessaire)

Si Redis n'est pas installé :

1. Télécharger depuis : <https://github.com/tporadowski/redis/releases>
2. Installer et ajouter au PATH
3. Redémarrer avec `.\start-services.ps1`

**Sans Redis :**

- ✅ Les notifications immédiates fonctionnent
- ❌ Les notifications quotidiennes/hebdomadaires ne fonctionnent pas

## 📱 Comptes de Test

Voir `COMPTES_UTILISATEURS.txt` pour les identifiants de test par rôle.

## 🌐 URLs

- Backend API : <http://127.0.0.1:8000>
- Admin Django : <http://127.0.0.1:8000/admin>
- Documentation : <http://127.0.0.1:8000/api/docs> (si configuré)

## 🆘 Dépannage

**Erreur "Redis connection refused":**

```powershell
redis-server
```

**Erreur de migration:**

```powershell
cd backend
..\.venv\Scripts\python.exe manage.py migrate
```

**Celery ne démarre pas:**

```powershell
# Vérifier Redis
redis-cli ping  # Doit répondre "PONG"
```

## 📚 Documentation Complète

- `SPECIFICATIONS_IMPLEMENTED.md` : Spécifications techniques
- `FIREBASE_INTEGRATION_SUMMARY.md` : Configuration Firebase
- `docs/` : Documentation détaillée
