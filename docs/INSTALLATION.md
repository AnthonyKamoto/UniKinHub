# Guide d'Installation Rapide

## 🚀 Démarrage en 5 minutes

### Étape 1 : Prérequis

- Python 3.12+ installé
- Flutter 3.9+ installé
- VS Code avec extensions Flutter et Django

### Étape 2 : Backend Django

```bash
# Ouvrir un terminal dans le dossier du projet
cd MiniProjet_N3_CCC_AnthonyKamoto/backend

# Démarrer le serveur (l'environnement virtuel est déjà configuré)
C:/Users/ABC/Documents/We_Tech/MiniProjet_N3_CCC_AnthonyKamoto/.venv/Scripts/python.exe manage.py runserver
```

Le serveur Django démarre sur <http://127.0.0.1:8000/>

### Étape 3 : Application Flutter

```bash
# Nouveau terminal
cd MiniProjet_N3_CCC_AnthonyKamoto/mobile

# Lancer l'application
flutter run
```

## 🔑 Comptes de Test

### Administration Django (<http://127.0.0.1:8000/admin/>)

- **Utilisateur** : admin
- **Mot de passe** : admin123

### Utilisateurs de Test

- **Modérateur** : moderateur1 / test123
- **Publiant** : publiant1 / test123
- **Étudiant** : etudiant1 / test123

## 📊 Données Pré-chargées

✅ **6 catégories** : Annonces académiques, Événements, Bourses, Stages, Vie étudiante, Urgent

✅ **6 actualités** : Exemples réalistes pour les universités de Kinshasa

✅ **5 utilisateurs** : Différents rôles pour tester toutes les fonctionnalités

## 🔧 URLs Importantes

- **API principale** : <http://127.0.0.1:8000/api/>
- **Admin Django** : <http://127.0.0.1:8000/admin/>
- **API actualités** : <http://127.0.0.1:8000/api/news/>
- **API catégories** : <http://127.0.0.1:8000/api/categories/>

## ✅ Vérification

1. **Backend** : Ouvrir <http://127.0.0.1:8000/api/news/> dans un navigateur
2. **Flutter** : L'app doit afficher la liste des actualités
3. **Admin** : Se connecter sur <http://127.0.0.1:8000/admin/>

## 🆘 Problèmes Courants

### Erreur "Port already in use"

```bash
# Tuer le processus sur le port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Erreur Flutter "No devices found"

```bash
flutter doctor
flutter devices
```

### Erreur de connexion API

- Vérifier que le serveur Django fonctionne
- Vérifier l'URL dans `mobile/lib/services/api_service.dart`

---

🎉 **Votre système de diffusion d'actualités est prêt !**
