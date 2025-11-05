# Script de vérification de la configuration Firebase
# Exécutez ce script pour vérifier que tout est en place

Write-Host "🔍 Vérification de la configuration Firebase Push Notifications" -ForegroundColor Cyan
Write-Host ""

$erreurs = 0
$avertissements = 0

# Fonction pour vérifier un fichier
function Test-FileExists {
    param($Path, $Description)
    if (Test-Path $Path) {
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Description" -ForegroundColor Red
        $script:erreurs++
        return $false
    }
}

# Fonction pour vérifier un contenu dans un fichier
function Test-FileContent {
    param($Path, $Pattern, $Description)
    if (Test-Path $Path) {
        $content = Get-Content $Path -Raw
        if ($content -match $Pattern) {
            Write-Host "✅ $Description" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️  $Description" -ForegroundColor Yellow
            $script:avertissements++
            return $false
        }
    } else {
        Write-Host "❌ Fichier non trouvé : $Path" -ForegroundColor Red
        $script:erreurs++
        return $false
    }
}

Write-Host "📱 Vérification Mobile Flutter" -ForegroundColor Yellow
Write-Host "─────────────────────────────" -ForegroundColor DarkGray

# Fichiers critiques mobile
Test-FileExists "mobile/android/app/google-services.json" "google-services.json présent"
Test-FileExists "mobile/lib/firebase_options.dart" "firebase_options.dart présent"
Test-FileExists "mobile/lib/services/notification_service.dart" "notification_service.dart présent"

# Configuration Android
Test-FileContent "mobile/android/app/build.gradle.kts" "com.google.gms.google-services" "Plugin Google Services ajouté"
Test-FileContent "mobile/android/app/build.gradle.kts" "firebase-messaging" "Dépendance Firebase Messaging"
Test-FileContent "mobile/android/app/src/main/AndroidManifest.xml" "POST_NOTIFICATIONS" "Permission POST_NOTIFICATIONS"
Test-FileContent "mobile/android/app/src/main/AndroidManifest.xml" "default_notification_channel_id" "Configuration FCM métadonnées"

# Configuration Flutter
Test-FileContent "mobile/lib/main.dart" "Firebase.initializeApp" "Initialisation Firebase"
Test-FileContent "mobile/lib/providers/auth_provider.dart" "NotificationService" "Intégration dans AuthProvider"

Write-Host ""
Write-Host "🔧 Vérification Backend Django" -ForegroundColor Yellow
Write-Host "─────────────────────────────" -ForegroundColor DarkGray

# Fichiers backend
Test-FileExists "backend/.env" "Fichier .env présent"
Test-FileContent "backend/news/views.py" "register_fcm_token" "Endpoint register_fcm_token"
Test-FileContent "backend/news/urls.py" "fcm/register" "Route FCM dans urls.py"
Test-FileContent "backend/news/notification_service.py" "send_push_notification" "Service de notification push"

# Vérifier la configuration .env
if (Test-Path "backend/.env") {
    $envContent = Get-Content "backend/.env" -Raw
    if ($envContent -match "FCM_SERVER_KEY\s*=\s*(?!your-fcm-server-key)(.+)") {
        Write-Host "✅ FCM_SERVER_KEY configurée" -ForegroundColor Green
    } else {
        Write-Host "⚠️  FCM_SERVER_KEY non configurée ou valeur par défaut" -ForegroundColor Yellow
        $avertissements++
    }
}

Write-Host ""
Write-Host "📦 Vérification des dépendances" -ForegroundColor Yellow
Write-Host "─────────────────────────────" -ForegroundColor DarkGray

# Vérifier pubspec.yaml
Test-FileContent "mobile/pubspec.yaml" "firebase_core" "Dépendance firebase_core"
Test-FileContent "mobile/pubspec.yaml" "firebase_messaging" "Dépendance firebase_messaging"
Test-FileContent "mobile/pubspec.yaml" "flutter_local_notifications" "Dépendance flutter_local_notifications"

Write-Host ""
Write-Host "📚 Vérification de la documentation" -ForegroundColor Yellow
Write-Host "────────────────────────────────────" -ForegroundColor DarkGray

Test-FileExists "docs/FIREBASE_PUSH_NOTIFICATIONS.md" "Guide complet de configuration"
Test-FileExists "FIREBASE_INTEGRATION_SUMMARY.md" "Résumé de l'intégration"
Test-FileExists "QUICKSTART_FIREBASE.md" "Guide de démarrage rapide"

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan

if ($erreurs -eq 0 -and $avertissements -eq 0) {
    Write-Host "🎉 Parfait ! Tout est en place !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "1. Vérifiez que FCM_SERVER_KEY est configurée dans backend/.env"
    Write-Host "2. Lancez le backend : cd backend && python manage.py runserver"
    Write-Host "3. Lancez l'app mobile : cd mobile && flutter run"
    Write-Host "4. Testez une notification depuis Firebase Console"
} elseif ($erreurs -eq 0) {
    Write-Host "⚠️  Configuration presque terminée" -ForegroundColor Yellow
    Write-Host "$avertissements avertissement(s) trouvé(s)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Actions recommandées :" -ForegroundColor Yellow
    Write-Host "- Configurez FCM_SERVER_KEY dans backend/.env"
    Write-Host "- Vérifiez le guide : docs/FIREBASE_PUSH_NOTIFICATIONS.md"
} else {
    Write-Host "❌ Configuration incomplète" -ForegroundColor Red
    Write-Host "$erreurs erreur(s) et $avertissements avertissement(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Actions requises :" -ForegroundColor Yellow
    Write-Host "1. Placez google-services.json dans mobile/android/app/"
    Write-Host "2. Exécutez : cd mobile && flutterfire configure"
    Write-Host "3. Configurez backend/.env avec FCM_SERVER_KEY"
    Write-Host ""
    Write-Host "Consultez : QUICKSTART_FIREBASE.md pour un guide pas à pas"
}

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
