# 📱 Configuration de la connexion Mobile → Backend

## 🎯 Problème

L'application mobile Flutter ne peut pas se connecter au serveur Django backend.

## 🔍 Diagnostic

### Étape 1 : Trouver l'adresse IP de votre machine

**Sur Windows (PowerShell) :**

```powershell
ipconfig | Select-String "IPv4"
```

Cherchez l'adresse IPv4 de votre adaptateur réseau (exemple : `192.168.1.100`)

**Alternative rapide :**

```powershell
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}).IPAddress
```

### Étape 2 : Identifier votre environnement

| Environnement | URL à utiliser | Explication |
|---------------|----------------|-------------|
| **Émulateur Android** | `http://10.0.2.2:8000/api` | Adresse spéciale de l'émulateur pour localhost |
| **Appareil physique (Wi-Fi)** | `http://192.168.X.X:8000/api` | Remplacer par l'IP de votre PC |
| **iOS Simulator** | `http://127.0.0.1:8000/api` | Localhost direct |

## ✅ Solution

### Option 1 : Modifier le fichier de configuration (Recommandé)

1. Ouvrez le fichier `mobile/lib/config/api_config.dart`

2. Modifiez la ligne `baseUrl` selon votre environnement :

**Pour émulateur Android :**

```dart
static const String baseUrl = 'http://10.0.2.2:8000/api';
```

**Pour appareil physique :**

```dart
static const String baseUrl = 'http://192.168.1.100:8000/api'; // Remplacez par votre IP
```

**Pour iOS Simulator :**

```dart
static const String baseUrl = 'http://127.0.0.1:8000/api';
```

3. **Sauvegardez le fichier**

4. **Hot Reload** dans votre application Flutter (appuyez sur `r` dans le terminal)

---

### Option 2 : Configurer le backend pour accepter toutes les adresses

Si vous testez sur un appareil physique, le backend Django doit écouter sur toutes les interfaces réseau :

**Modifiez `start-all.ps1` :**

Trouvez la ligne contenant `python manage.py runserver` et remplacez par :

```powershell
python manage.py runserver 0.0.0.0:8000
```

**Ajoutez votre IP à ALLOWED_HOSTS dans `backend/news_system/settings.py` :**

```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '192.168.1.100', '*']  # Remplacez par votre IP
```

---

## 🧪 Test de connexion

### Depuis votre appareil/émulateur

1. Ouvrez un navigateur sur l'appareil
2. Accédez à : `http://192.168.1.100:8000/admin/` (remplacez par votre IP)
3. Si la page de login Django s'affiche → ✅ La connexion fonctionne

### Depuis l'application Flutter

L'application affichera automatiquement un message d'erreur si elle ne peut pas se connecter :

- ❌ "Impossible de se connecter au serveur"
- ❌ "Network Error"
- ❌ "TimeoutException"

---

## 🔥 Dépannage

### Problème : "Connection refused" ou "Failed to connect"

**Solutions :**

1. **Vérifiez que le backend est démarré :**

   ```powershell
   # Dans le dossier backend
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Vérifiez le pare-feu Windows :**
   - Autorisez Python à communiquer sur le réseau
   - Autorisez le port 8000

3. **Vérifiez que votre appareil est sur le même réseau Wi-Fi que votre PC**

### Problème : "CORS Error"

Ajoutez l'origine dans `backend/news_system/settings.py` :

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.100:5173",  # Votre IP
]

# Pour le mobile, ajoutez :
CORS_ALLOW_ALL_ORIGINS = True  # ATTENTION : Seulement en développement !
```

### Problème : "Invalid Host header"

Ajoutez à `ALLOWED_HOSTS` dans `settings.py` :

```python
ALLOWED_HOSTS = ['*']  # En développement seulement !
```

---

## 📋 Checklist de vérification

- [ ] Backend Django démarré avec `python manage.py runserver 0.0.0.0:8000`
- [ ] Adresse IP de la machine identifiée (commande `ipconfig`)
- [ ] `baseUrl` modifié dans `mobile/lib/config/api_config.dart`
- [ ] Hot reload effectué dans l'application Flutter
- [ ] Appareil/émulateur sur le même réseau Wi-Fi que le PC
- [ ] Pare-feu Windows autorise Python sur le réseau
- [ ] `ALLOWED_HOSTS` contient l'adresse IP dans `settings.py`
- [ ] Test d'accès à `http://[VOTRE_IP]:8000/admin/` depuis le navigateur de l'appareil

---

## 🎯 Configuration actuelle

Actuellement dans `api_config.dart` :

```dart
static const String baseUrl = 'http://192.168.1.100:8000/api';
```

**⚠️ À MODIFIER selon votre environnement !**

---

✨ **Une fois configuré correctement, l'application mobile devrait se connecter sans problème au backend Django !**
