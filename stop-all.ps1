# Script pour arrêter tous les serveurs en cours d'exécution

Write-Host "🛑 ARRÊT DE TOUS LES SERVEURS" -ForegroundColor Red
Write-Host "=" * 60

# Arrêter Redis
Write-Host "`n🔴 Arrêt de Redis..." -ForegroundColor Yellow
$redisProcesses = Get-Process -Name redis-server -ErrorAction SilentlyContinue
if ($redisProcesses) {
    $redisProcesses | Stop-Process -Force
    Write-Host "✅ Redis arrêté" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Aucun processus Redis en cours" -ForegroundColor Gray
}

# Arrêter Celery
Write-Host "`n🔔 Arrêt de Celery..." -ForegroundColor Yellow
$celeryProcesses = Get-Process -Name celery -ErrorAction SilentlyContinue
if ($celeryProcesses) {
    $celeryProcesses | Stop-Process -Force
    Write-Host "✅ Celery arrêté" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Aucun processus Celery en cours" -ForegroundColor Gray
}

# Arrêter les processus Python (Django)
Write-Host "`n🐍 Arrêt du serveur Django..." -ForegroundColor Yellow
$pythonProcesses = Get-Process -Name python -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    $pythonProcesses | Stop-Process -Force
    Write-Host "✅ Serveur Django arrêté" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Aucun processus Python en cours" -ForegroundColor Gray
}

# Arrêter les processus Node (React/Vite)
Write-Host "`n⚛️  Arrêt du serveur React/Vite..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✅ Serveur React/Vite arrêté" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Aucun processus Node en cours" -ForegroundColor Gray
}

# Arrêter les processus Flutter
Write-Host "`n📱 Arrêt de Flutter..." -ForegroundColor Yellow
$flutterProcesses = Get-Process -Name flutter -ErrorAction SilentlyContinue
if ($flutterProcesses) {
    $flutterProcesses | Stop-Process -Force
    Write-Host "✅ Flutter arrêté" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Aucun processus Flutter en cours" -ForegroundColor Gray
}

# Arrêter l'émulateur Android (optionnel)
Write-Host "`n📲 Arrêt de l'émulateur Android..." -ForegroundColor Yellow
$emulatorProcesses = Get-Process -Name qemu-system-x86_64 -ErrorAction SilentlyContinue
if ($emulatorProcesses) {
    $emulatorProcesses | Stop-Process -Force
    Write-Host "✅ Émulateur Android arrêté" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Aucun émulateur en cours" -ForegroundColor Gray
}

# Arrêter les fenêtres cmd
Write-Host "`n💻 Fermeture des fenêtres cmd..." -ForegroundColor Yellow
$cmdProcesses = Get-Process -Name cmd -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -ne "" }
if ($cmdProcesses) {
    $cmdProcesses | Stop-Process -Force
    Write-Host "✅ Fenêtres cmd fermées" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Aucune fenêtre cmd à fermer" -ForegroundColor Gray
}

Write-Host "`n=" * 60
Write-Host "✅ Tous les serveurs ont été arrêtés" -ForegroundColor Green
Write-Host "`nVous pouvez maintenant relancer avec: .\start-all.ps1" -ForegroundColor Cyan
