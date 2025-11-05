Write-Host "🚀 LANCEMENT DE TOUS LES SERVEURS" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# CONFIGURATION
# =============================================================================
$backendPath = ".\backend"
$frontendPath = ".\frontend"
$mobilePath = ".\mobile"
$venvPath = "$backendPath\.venv\Scripts\Activate.ps1"

$ErrorCount = 0

# =============================================================================
# FONCTIONS UTILITAIRES
# =============================================================================

function Test-Command {
    param($CommandName)
    $null = Get-Command $CommandName -ErrorAction SilentlyContinue
    return $?
}

function Write-StatusOK {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-StatusError {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    $script:ErrorCount++
}

function Write-StatusWarning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-StatusInfo {
    param($Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

# =============================================================================
# VÉRIFICATION DES DOSSIERS
# =============================================================================
Write-Host "📁 Vérification des dossiers..." -ForegroundColor Cyan

if (-not (Test-Path $backendPath)) { 
    Write-StatusError "Dossier backend introuvable"
    exit 1
}
Write-StatusOK "Dossier backend trouvé"

if (-not (Test-Path $frontendPath)) { 
    Write-StatusError "Dossier frontend-react introuvable"
    exit 1
}
Write-StatusOK "Dossier frontend trouvé"

if (-not (Test-Path $mobilePath)) { 
    Write-StatusError "Dossier mobile introuvable"
    exit 1
}
Write-StatusOK "Dossier mobile trouvé"

Write-Host ""

# =============================================================================
# VÉRIFICATION DES PRÉREQUIS
# =============================================================================
Write-Host "🔍 Vérification des prérequis système..." -ForegroundColor Cyan

# Vérifier Python
if (Test-Command "python") {
    $pythonVersion = python --version 2>&1
    Write-StatusOK "Python installé : $pythonVersion"
} else {
    Write-StatusError "Python n'est pas installé ou n'est pas dans le PATH"
}

# Vérifier pnpm ou npm
$useNpm = $false
if (Test-Command "pnpm") {
    $pnpmVersion = pnpm --version 2>&1
    Write-StatusOK "pnpm installé : v$pnpmVersion"
} elseif (Test-Command "npm") {
    $npmVersion = npm --version 2>&1
    Write-StatusOK "npm installé : v$npmVersion (pnpm non trouvé, utilisation de npm)"
    $useNpm = $true
} else {
    Write-StatusError "ni pnpm ni npm ne sont installés"
}

# Vérifier Flutter
if (Test-Command "flutter") {
    $flutterVersion = flutter --version 2>&1 | Select-String -Pattern "Flutter \d+\.\d+\.\d+" | Select-Object -First 1
    Write-StatusOK "Flutter installé : $flutterVersion"
} else {
    Write-StatusWarning "Flutter n'est pas installé ou n'est pas dans le PATH"
}

# Vérifier Redis (optionnel pour notifications)
$script:redisInstalled = Test-Command "redis-server"
if ($redisInstalled) {
    Write-StatusOK "Redis installé (notifications automatiques activées)"
} else {
    Write-StatusWarning "Redis non installé (notifications planifiées désactivées)"
    Write-StatusInfo "Pour activer les notifications quotidiennes/hebdomadaires:"
    Write-StatusInfo "  Installez Redis: https://github.com/tporadowski/redis/releases"
}

Write-Host ""

# Arrêter si des erreurs critiques
if ($ErrorCount -gt 0) {
    Write-Host ""
    Write-StatusError "Des prérequis critiques sont manquants. Installation impossible."
    Write-StatusInfo "Veuillez installer les outils manquants et relancer le script."
    exit 1
}

# =============================================================================
# PRÉPARATION BACKEND DJANGO
# =============================================================================
Write-Host "🐍 Préparation du Backend Django..." -ForegroundColor Cyan

# Vérifier l'environnement virtuel (à la racine du projet)
$venvDir = ".venv"
if (Test-Path $venvDir) {
    Write-StatusOK "Environnement virtuel Python détecté (racine)"
} else {
    Write-StatusError "Environnement virtuel non trouvé à la racine du projet"
    Write-StatusInfo "Veuillez créer un environnement virtuel: python -m venv .venv"
    exit 1
}

# Démarrer Redis si disponible
if ($redisInstalled) {
    Write-StatusInfo "Démarrage de Redis..."
    Start-Process redis-server -WindowStyle Minimized
    Start-Sleep -Seconds 2
}

# Commandes pour le backend (utilisation directe de python.exe du venv depuis la racine)
$rootPath = Get-Location
$backendFullPath = Join-Path $rootPath $backendPath
$pythonExe = Join-Path $rootPath ".venv\Scripts\python.exe"
$backendCommands = "cd /d `"$backendFullPath`" && echo Execution des migrations Django... && `"$pythonExe`" manage.py migrate --no-input && echo Demarrage du serveur Django (http://localhost:8000)... && `"$pythonExe`" manage.py runserver 0.0.0.0:8000"

Write-StatusInfo "Lancement du serveur Django..."
Start-Process cmd -ArgumentList "/k", $backendCommands

# Attendre que Django démarre avant de lancer Celery
if ($redisInstalled) {
    Write-StatusInfo "Attente du démarrage de Django (5 secondes)..."
    Start-Sleep -Seconds 5
    
    # Démarrer Celery Worker
    Write-StatusInfo "Démarrage de Celery Worker (notifications)..."
    $celeryExe = Join-Path $rootPath ".venv\Scripts\celery.exe"
    $celeryWorkerCmd = "cd /d `"$backendFullPath`" && echo Demarrage Celery Worker... && `"$celeryExe`" -A news_system worker --loglevel=info --pool=solo"
    Start-Process cmd -ArgumentList "/k", $celeryWorkerCmd
    
    Start-Sleep -Seconds 2
    
    # Démarrer Celery Beat
    Write-StatusInfo "Démarrage de Celery Beat (planificateur)..."
    $celeryBeatCmd = "cd /d `"$backendFullPath`" && echo Demarrage Celery Beat... && `"$celeryExe`" -A news_system beat --loglevel=info"
    Start-Process cmd -ArgumentList "/k", $celeryBeatCmd
}

Write-Host ""

# =============================================================================
# PRÉPARATION FRONTEND REACT
# =============================================================================
Write-Host "⚛️  Préparation du Frontend React..." -ForegroundColor Cyan

# Vérifier si node_modules existe
$nodeModulesPath = "$frontendPath\node_modules"
$needsInstall = -not (Test-Path $nodeModulesPath)

if ($needsInstall) {
    Write-StatusInfo "Dépendances non installées, installation nécessaire"
} else {
    Write-StatusOK "Dépendances déjà installées (node_modules existe)"
}

# Commandes pour le frontend
if ($useNpm) {
    if ($needsInstall) {
        $frontendCommands = @"
Write-Host '⚛️  FRONTEND REACT - NPM' -ForegroundColor Cyan
Write-Host '=' * 50 -ForegroundColor Cyan
Write-Host ''

Write-Host '🔹 Installation des dépendances npm...' -ForegroundColor Cyan
npm install
if (`$LASTEXITCODE -eq 0) {
    Write-Host '✅ Dépendances installées' -ForegroundColor Green
} else {
    Write-Host '❌ Erreur installation dépendances' -ForegroundColor Red
}
Write-Host ''

Write-Host '🚀 Démarrage du serveur Vite...' -ForegroundColor Green
Write-Host '📍 URL: http://localhost:5173' -ForegroundColor Cyan
Write-Host ''
npm run dev
"@
    } else {
        $frontendCommands = @"
Write-Host '⚛️  FRONTEND REACT - NPM' -ForegroundColor Cyan
Write-Host '=' * 50 -ForegroundColor Cyan
Write-Host ''

Write-Host '🚀 Démarrage du serveur Vite...' -ForegroundColor Green
Write-Host '📍 URL: http://localhost:5173' -ForegroundColor Cyan
Write-Host ''
npm run dev
"@
    }
} else {
    if ($needsInstall) {
        $frontendCommands = "cd /d `"$((Get-Location).Path)\$frontendPath`" && echo Installation des dependances pnpm... && pnpm install && echo Demarrage du serveur Vite... && pnpm dev"
    } else {
        $frontendCommands = "cd /d `"$((Get-Location).Path)\$frontendPath`" && echo Demarrage du serveur Vite (http://localhost:5173)... && pnpm dev"
    }
}

Write-StatusInfo "Lancement du serveur React/Vite..."

# Utiliser cmd au lieu de PowerShell pour éviter les problèmes d'ExecutionPolicy avec pnpm
if ($useNpm) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; $frontendCommands"
} else {
    Start-Process cmd -ArgumentList "/k", $frontendCommands
}

Write-Host ""

# =============================================================================
# PRÉPARATION FLUTTER MOBILE
# =============================================================================
Write-Host "📱 Préparation de l'application Flutter..." -ForegroundColor Cyan

if (Test-Command "flutter") {
    # Vérifier les émulateurs disponibles
    Write-StatusInfo "Détection des émulateurs Android..."
    
    $emulatorsList = flutter emulators 2>&1 | Out-String
    
    if ($emulatorsList -match "Medium_Phone_API_36\.1|Pixel_9") {
        # Déterminer quel émulateur lancer (priorité: Medium_Phone_API_36.1)
        $emulatorId = if ($emulatorsList -match "Medium_Phone_API_36\.1") {
            "Medium_Phone_API_36.1"
        } else {
            "Pixel_9"
        }
        
        Write-StatusInfo "Lancement de l'émulateur '$emulatorId'..."
        
        # Lancer l'émulateur en arrière-plan
        Start-Process -FilePath "flutter" -ArgumentList "emulators", "--launch", $emulatorId -WindowStyle Hidden
        
        Write-StatusOK "Émulateur en cours de démarrage..."
        Write-StatusInfo "Attente du démarrage complet (20 secondes)..."
        Start-Sleep -Seconds 20
        
        # Vérifier si l'émulateur est détecté
        $devices = flutter devices 2>&1 | Out-String
        
        if ($devices -match "emulator-\d+") {
            Write-StatusOK "Émulateur détecté et prêt !"
            
            # Lancer l'application Flutter sur l'émulateur
            $mobileFullPath = Join-Path (Get-Location) $mobilePath
            $flutterCommands = "cd /d `"$mobileFullPath`" && echo Installation des dependances Flutter... && flutter pub get && echo Lancement de l'application sur l'emulateur... && flutter run -d emulator-5554"
            
            Write-StatusInfo "Lancement de l'application Flutter..."
            Start-Process cmd -ArgumentList "/k", $flutterCommands
        } else {
            Write-StatusWarning "Émulateur non encore prêt, lancement manuel requis"
            
            # Lancer quand même, Flutter attendra
            $mobileFullPath = Join-Path (Get-Location) $mobilePath
            $flutterCommands = "cd /d `"$mobileFullPath`" && echo Installation des dependances Flutter... && flutter pub get && echo En attente de l'emulateur... && flutter run"
            
            Write-StatusInfo "Lancement de l'application Flutter (en attente émulateur)..."
            Start-Process cmd -ArgumentList "/k", $flutterCommands
        }
    } else {
        Write-StatusWarning "Aucun émulateur configuré"
        Write-StatusInfo "Lancement sans émulateur automatique..."
        
        $mobileFullPath = Join-Path (Get-Location) $mobilePath
        $flutterCommands = "cd /d `"$mobileFullPath`" && echo Installation des dependances Flutter... && flutter pub get && echo Detection des appareils... && flutter devices && pause && flutter run"
        
        Write-StatusInfo "Lancement de l'application Flutter..."
        Start-Process cmd -ArgumentList "/k", $flutterCommands
    }
} else {
    Write-StatusWarning "Flutter non installé, lancement de l'app mobile ignoré"
}

Write-Host ""

# =============================================================================
# RÉSUMÉ FINAL
# =============================================================================
Start-Sleep -Seconds 2

Write-Host "=" * 60 -ForegroundColor Green
Write-Host "✅ TOUS LES SERVEURS ONT ÉTÉ LANCÉS" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs d'accès :" -ForegroundColor Cyan
Write-Host "   🔹 Backend API  : http://localhost:8000" -ForegroundColor White
Write-Host "   🔹 Admin Django : http://localhost:8000/admin" -ForegroundColor White
Write-Host "   🔹 Frontend Web : http://localhost:5173" -ForegroundColor White
Write-Host "   🔹 Mobile       : Sur l'émulateur/appareil connecté" -ForegroundColor White
Write-Host ""
Write-Host "� Services de notifications :" -ForegroundColor Cyan
if ($redisInstalled) {
    Write-Host "   ✅ Redis : Actif" -ForegroundColor Green
    Write-Host "   ✅ Celery Worker : Actif (traitement des tâches)" -ForegroundColor Green
    Write-Host "   ✅ Celery Beat : Actif (notifications à 8h et lundi 9h)" -ForegroundColor Green
    Write-Host "   • Notifications immédiates : Envoyées dès la publication" -ForegroundColor White
    Write-Host "   • Notifications quotidiennes : Tous les jours à 8h00" -ForegroundColor White
    Write-Host "   • Notifications hebdomadaires : Tous les lundis à 9h00" -ForegroundColor White
} else {
    Write-Host "   ⚠️  Redis : Non installé" -ForegroundColor Yellow
    Write-Host "   • Notifications immédiates : Actives" -ForegroundColor White
    Write-Host "   • Notifications planifiées : Désactivées (Redis requis)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "�💡 Conseils :" -ForegroundColor Yellow
Write-Host "   • Les serveurs tournent dans des fenêtres séparées" -ForegroundColor Gray
Write-Host "   • Utilisez Ctrl+C dans chaque fenêtre pour arrêter un serveur" -ForegroundColor Gray
Write-Host "   • Consultez les logs dans chaque fenêtre en cas d'erreur" -ForegroundColor Gray
if (-not $redisInstalled) {
    Write-Host "   • Pour activer les notifications planifiées, installez Redis" -ForegroundColor Gray
}
Write-Host ""
Write-Host "📌 Pour le mobile : Assurez-vous qu'un émulateur est démarré !" -ForegroundColor Yellow
Write-Host ""
