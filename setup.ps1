# ============================================
# Script d'Installation Automatique - UniKinHub
# ============================================
# Auteur: Anthony Kamoto
# Date: 30 Octobre 2025
# Description: Installation complète du projet
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   UniKinHub - Installation Automatique" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Fonction pour afficher les messages
function Write-Step {
    param([string]$Message)
    Write-Host "`n► $Message" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Message)
    Write-Host "  ✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "  ✗ $Message" -ForegroundColor Red
}

# Vérification des prérequis
Write-Step "Vérification des prérequis..."

try {
    $pythonVersion = python --version 2>&1
    Write-Success "Python installé: $pythonVersion"
} catch {
    Write-Error "Python n'est pas installé ou pas dans le PATH"
    Write-Host "  Téléchargez Python depuis: https://www.python.org/downloads/" -ForegroundColor White
    exit 1
}

try {
    $nodeVersion = node --version 2>&1
    Write-Success "Node.js installé: $nodeVersion"
} catch {
    Write-Error "Node.js n'est pas installé ou pas dans le PATH"
    Write-Host "  Téléchargez Node.js depuis: https://nodejs.org/" -ForegroundColor White
    exit 1
}

try {
    $pnpmVersion = pnpm --version 2>&1
    Write-Success "pnpm installé: v$pnpmVersion"
} catch {
    Write-Error "pnpm n'est pas installé"
    Write-Host "  Installez pnpm avec: npm install -g pnpm" -ForegroundColor White
    exit 1
}

try {
    $flutterVersion = flutter --version 2>&1 | Select-String "Flutter"
    Write-Success "Flutter installé: $flutterVersion"
} catch {
    Write-Error "Flutter n'est pas installé ou pas dans le PATH"
    Write-Host "  Téléchargez Flutter depuis: https://flutter.dev/docs/get-started/install" -ForegroundColor White
    exit 1
}

# ============================================
# INSTALLATION BACKEND
# ============================================
Write-Step "Installation du Backend Django..."

Push-Location backend

# Créer l'environnement virtuel
if (!(Test-Path ".venv")) {
    Write-Host "  Création de l'environnement virtuel Python..." -ForegroundColor White
    python -m venv .venv
    Write-Success "Environnement virtuel créé"
} else {
    Write-Success "Environnement virtuel déjà existant"
}

# Activer l'environnement virtuel
Write-Host "  Activation de l'environnement virtuel..." -ForegroundColor White
& .\.venv\Scripts\Activate.ps1

# Installer les dépendances
Write-Host "  Installation des dépendances Python..." -ForegroundColor White
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
Write-Success "Dépendances Python installées"

# Créer le fichier .env s'il n'existe pas
if (!(Test-Path ".env")) {
    Write-Host "  Création du fichier .env..." -ForegroundColor White
    Copy-Item ".env.example" ".env"
    Write-Success "Fichier .env créé (pensez à le configurer)"
} else {
    Write-Success "Fichier .env déjà existant"
}

# Créer la base de données
Write-Host "  Création de la base de données..." -ForegroundColor White
python manage.py makemigrations --noinput | Out-Null
python manage.py migrate --noinput | Out-Null
Write-Success "Base de données créée"

# Créer le superutilisateur
Write-Host "  Vérification du superutilisateur..." -ForegroundColor White
$superuserExists = python -c "from django.contrib.auth import get_user_model; User = get_user_model(); print(User.objects.filter(username='admin').exists())" 2>&1

if ($superuserExists -eq "False") {
    Write-Host "  Création du superutilisateur (admin/admin123)..." -ForegroundColor White
    python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123')" 2>&1 | Out-Null
    Write-Success "Superutilisateur créé: admin / admin123"
} else {
    Write-Success "Superutilisateur déjà existant"
}

# Peupler la base de données
Write-Host "  Peuplement de la base de données avec des données de test..." -ForegroundColor White
python populate_db.py 2>&1 | Out-Null
Write-Success "Base de données peuplée avec des données de test"

# Créer le dossier media
if (!(Test-Path "media\news\images")) {
    New-Item -ItemType Directory -Path "media\news\images" -Force | Out-Null
    Write-Success "Dossier media créé"
}

Pop-Location

# ============================================
# INSTALLATION FRONTEND
# ============================================
Write-Step "Installation du Frontend React..."

Push-Location frontend

if (!(Test-Path "node_modules")) {
    Write-Host "  Installation des dépendances npm..." -ForegroundColor White
    pnpm install --silent
    Write-Success "Dépendances npm installées"
} else {
    Write-Success "node_modules déjà installé"
}

Pop-Location

# ============================================
# INSTALLATION MOBILE
# ============================================
Write-Step "Installation de l'Application Mobile Flutter..."

Push-Location mobile

Write-Host "  Installation des dépendances Flutter..." -ForegroundColor White
flutter pub get 2>&1 | Out-Null
Write-Success "Dépendances Flutter installées"

# Vérifier la configuration Flutter
Write-Host "  Vérification de la configuration Flutter..." -ForegroundColor White
flutter doctor 2>&1 | Out-Null
Write-Success "Configuration Flutter vérifiée"

Pop-Location

# ============================================
# RÉSUMÉ
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Installation Terminée avec Succès !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configurer le fichier backend/.env (optionnel)" -ForegroundColor White
Write-Host "   - Configuration email SMTP pour les notifications" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Démarrer tous les serveurs:" -ForegroundColor White
Write-Host "   .\start-all.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Accéder aux applications:" -ForegroundColor White
Write-Host "   - Frontend Web: http://localhost:5173" -ForegroundColor Gray
Write-Host "   - Backend API: http://127.0.0.1:8000/api" -ForegroundColor Gray
Write-Host "   - Admin Django: http://127.0.0.1:8000/admin" -ForegroundColor Gray
Write-Host "   - Mobile: Sur émulateur Android" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Se connecter avec:" -ForegroundColor White
Write-Host "   - Admin: admin / admin123" -ForegroundColor Gray
Write-Host "   - Étudiant: etudiant1 / password123" -ForegroundColor Gray
Write-Host "   - Plus de comptes: COMPTES_UTILISATEURS.txt" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour plus d'informations, consultez:" -ForegroundColor White
Write-Host "   - INSTALLATION_RAPIDE.md" -ForegroundColor Cyan
Write-Host "   - README.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Bonne exploration d'UniKinHub ! 🚀" -ForegroundColor Green
Write-Host ""
