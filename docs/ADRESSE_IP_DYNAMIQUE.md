# 🌐 Gestion Dynamique des Adresses IP

## ✅ Solution Implémentée

### 📱 Pour le Mobile

Un gestionnaire d'API dynamique a été créé : `ApiConfigManager`

**Fonctionnalités :**

- ✅ Détection automatique de l'adresse IP du backend
- ✅ Test de plusieurs adresses candidates
- ✅ Sauvegarde de l'adresse détectée
- ✅ Fallback automatique en cas de changement de réseau

**Addresses testées automatiquement (dans l'ordre) :**

1. `192.168.1.198` - IP actuelle de votre PC
2. `10.0.2.2` - Émulateur Android
3. `127.0.0.1` - iOS Simulator  
4. `localhost` - Alternative locale

### 🔧 Utilisation

#### Dans le code

```dart
import '../config/api_config_manager.dart';

// Obtenir l'URL automatiquement
final url = await ApiConfigManager.getBaseUrl();

// Forcer une re-détection (après changement de réseau)
await ApiConfigManager.forceRedetect();

// Définir manuellement une URL
await ApiConfigManager.setManualUrl('http://192.168.2.100:8000/api');

// Vérifier le statut
final status = await ApiConfigManager.getConnectionStatus();
print(status); // {url: ..., accessible: true, timestamp: ...}
```

### ⚛️ Pour le Frontend React

Le frontend utilise toujours `127.0.0.1` car il tourne sur le même PC que le backend.

**Pas besoin de gestion dynamique** - l'adresse locale ne change jamais.

---

## 🚀 Avantages

### ✅ Changement de réseau

Si vous changez de réseau Wi-Fi, l'application mobile :

1. Essaie l'URL sauvegardée
2. Si échec, re-détecte automatiquement
3. Sauvegarde la nouvelle URL

### ✅ Changement d'ordinateur  

Si vous déplacez le projet sur un autre PC :

1. Modifiez juste la première adresse dans `_candidateAddresses`
2. Ou laissez l'app détecter automatiquement

### ✅ Multi-environnement

Fonctionne sur :

- Émulateur Android ✅
- Appareil physique ✅
- iOS Simulator ✅

---

## 🛠️ Configuration Manuelle (Si Besoin)

### Étape 1 : Trouver votre nouvelle IP

**Windows :**

```powershell
ipconfig | Select-String "IPv4"
```

**macOS/Linux :**

```bash
ifconfig | grep "inet "
```

### Étape 2 : Mettre à jour l'adresse prioritaire

Éditez `mobile/lib/config/api_config_manager.dart` :

```dart
static final List<String> _candidateAddresses = [
  '192.168.X.X',    // ← Mettre votre nouvelle IP ici
  '10.0.2.2',       
  '127.0.0.1',      
  'localhost',      
];
```

### Étape 3 : Forcer la re-détection dans l'app

Dans l'interface mobile, ajoutez un bouton :

```dart
ElevatedButton(
  onPressed: () async {
    await ApiConfigManager.forceRedetect();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Backend re-détecté !')),
    );
  },
  child: Text('Re-détecter le backend'),
)
```

---

## 📊 Page de Diagnostic

Une page de diagnostic est disponible pour tester la connexion :

```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => ConnectionTestPage(),
  ),
);
```

Cette page :

- ✅ Teste toutes les adresses candidates
- ✅ Affiche les résultats en temps réel
- ✅ Permet de forcer une re-détection
- ✅ Affiche des conseils de dépannage

---

## 🎯 Workflow Recommandé

### Développement Normal

1. Lancez les serveurs avec `.\start-all.ps1`
2. L'app mobile détecte automatiquement le backend
3. Travaillez normalement

### Changement de Réseau

1. Connectez-vous au nouveau réseau Wi-Fi
2. Relancez l'app mobile
3. Elle re-détecte automatiquement la nouvelle IP
4. Ou utilisez le bouton "Re-détecter"

### Nouveau PC

1. Clonez le projet
2. Notez votre nouvelle IP : `ipconfig`
3. Mettez à jour `_candidateAddresses` (optionnel)
4. Lancez l'app - elle détecte automatiquement

---

## 💡 Optimisations Futures

### Cache Intelligent

- ✅ L'URL détectée est mise en cache
- ✅ Pas de re-détection à chaque démarrage
- ✅ Re-détection seulement si connexion échoue

### Mode Développement vs Production

```dart
// Développement : détection automatique
if (kDebugMode) {
  url = await ApiConfigManager.getBaseUrl();
} else {
  // Production : URL fixe du serveur de production
  url = 'https://api.monapp.com';
}
```

---

✨ **Votre application est maintenant portable et résiliente aux changements de réseau !**
