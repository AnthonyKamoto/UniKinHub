# ============================================================================
# Script de création du package de livraison UniKinHub
# Auteur: Anthony Kamoto
# Date: 6 Novembre 2025
# ============================================================================

Write-Host "📦 CRÉATION DU PACKAGE DE LIVRAISON UniKinHub" -ForegroundColor Cyan
Write-Host "=" * 60

# Paramètres
$projectName = "UniKinHub"
$version = "v1.0.0"
$outputFolder = "LIVRAISON_${projectName}_${version}"
$zipFileName = "${outputFolder}.zip"

# Créer le dossier de livraison
Write-Host "`n📁 Création du dossier de livraison..." -ForegroundColor Yellow
if (Test-Path $outputFolder) {
    Remove-Item $outputFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $outputFolder | Out-Null

# Copier les fichiers importants (excluant les dossiers lourds)
Write-Host "📋 Copie des fichiers du projet..." -ForegroundColor Yellow

# Dossiers à exclure
$excludeFolders = @(
    "node_modules",
    "build",
    ".dart_tool",
    "venv",
    "__pycache__",
    ".git",
    "coverage",
    "dist",
    ".vscode",
    ".idea",
    "staticfiles",
    "media",
    "emails",
    ".pytest_cache"
)

# Fonction pour copier en excluant certains dossiers
function Copy-ProjectFiles {
    param($source, $destination)
    
    Get-ChildItem -Path $source -Recurse | ForEach-Object {
        $relativePath = $_.FullName.Substring($source.Length + 1)
        
        # Vérifier si le chemin contient un dossier exclu
        $shouldExclude = $false
        foreach ($exclude in $excludeFolders) {
            if ($relativePath -match "^$exclude" -or $relativePath -match "\\$exclude\\") {
                $shouldExclude = $true
                break
            }
        }
        
        if (-not $shouldExclude) {
            $destPath = Join-Path $destination $relativePath
            
            if ($_.PSIsContainer) {
                if (-not (Test-Path $destPath)) {
                    New-Item -ItemType Directory -Path $destPath -Force | Out-Null
                }
            } else {
                Copy-Item $_.FullName -Destination $destPath -Force
            }
        }
    }
}

# Copier les fichiers
Write-Host "  ⏳ Copie en cours (cela peut prendre quelques minutes)..." -ForegroundColor Gray
Copy-ProjectFiles -source "." -destination $outputFolder

Write-Host "  ✅ Fichiers copiés avec succès" -ForegroundColor Green

# Créer un fichier README pour la livraison
Write-Host "`n📝 Création du README de livraison..." -ForegroundColor Yellow
$livraisonReadme = @"
# 📦 UniKinHub - Package de Livraison v1.0.0

## 🎓 Informations Projet

- **Nom:** UniKinHub - Système de Gestion d'Actualités Universitaires
- **Auteur:** Anthony Kamoto
- **Email:** aanthonykamoto1@gmail.com
- **Date:** 6 Novembre 2025
- **Version:** 1.0.0

## 🔗 Repository GitHub

**URL:** https://github.com/AnthonyKamoto/UniKinHub

``````bash
git clone https://github.com/AnthonyKamoto/UniKinHub.git
``````

## 🚀 Installation Rapide

### Prérequis
- Python 3.12+
- Node.js 18+ & pnpm
- Flutter 3.35.6+
- Git

### Installation

``````powershell
# Ouvrir PowerShell dans ce dossier
cd UniKinHub

# Installation automatique
.\setup.ps1

# Démarrer tous les serveurs
.\start-all.ps1
``````

## 📖 Documentation

- **Guide Complet:** Voir \`README.md\`
- **Démarrage Rapide:** Voir \`DEMARRAGE_RAPIDE.md\`
- **Document de Livraison:** Voir \`DOCUMENT_LIVRAISON.md\`
- **Comptes de Test:** Voir \`COMPTES_UTILISATEURS.txt\`

## 🌐 Accès

- Application Web: http://localhost:3001
- API Backend: http://localhost:8000/api
- Admin Django: http://localhost:8000/admin

## 👤 Compte Admin

- **Username:** admin
- **Password:** admin123

## 📞 Support

Email: aanthonykamoto1@gmail.com
GitHub: @AnthonyKamoto

---

✅ Projet livré et fonctionnel
© 2025 Anthony Kamoto - Tous droits réservés
"@

Set-Content -Path (Join-Path $outputFolder "README_LIVRAISON.txt") -Value $livraisonReadme -Encoding UTF8

# Créer l'archive ZIP
Write-Host "`n🗜️  Création de l'archive ZIP..." -ForegroundColor Yellow
if (Test-Path $zipFileName) {
    Remove-Item $zipFileName -Force
}

Compress-Archive -Path $outputFolder -DestinationPath $zipFileName -CompressionLevel Optimal

$zipSize = (Get-Item $zipFileName).Length / 1MB
Write-Host "  ✅ Archive créée: $zipFileName ($([math]::Round($zipSize, 2)) MB)" -ForegroundColor Green

# Résumé
Write-Host "`n" + ("=" * 60)
Write-Host "✅ PACKAGE DE LIVRAISON CRÉÉ AVEC SUCCÈS" -ForegroundColor Green
Write-Host ("=" * 60)

Write-Host "`n📦 Contenu du package:" -ForegroundColor Cyan
Write-Host "  📁 Dossier: $outputFolder"
Write-Host "  🗜️  Archive: $zipFileName ($([math]::Round($zipSize, 2)) MB)"
Write-Host ""
Write-Host "📋 Fichiers inclus:" -ForegroundColor Cyan
Write-Host "  ✅ Code source complet (backend, frontend, mobile)"
Write-Host "  ✅ Documentation complète (README, guides, etc.)"
Write-Host "  ✅ Scripts PowerShell (setup, start, stop)"
Write-Host "  ✅ Fichiers de configuration"
Write-Host "  ✅ Captures d'écran"
Write-Host "  ✅ Base de données avec données de test"
Write-Host ""
Write-Host "📋 Fichiers exclus (à télécharger via setup.ps1):" -ForegroundColor Cyan
Write-Host "  ❌ node_modules (frontend)"
Write-Host "  ❌ venv (backend Python)"
Write-Host "  ❌ .dart_tool (Flutter)"
Write-Host "  ❌ build (compilations)"
Write-Host ""
Write-Host "📨 Pour partager:" -ForegroundColor Yellow
Write-Host "  1. Par email: Joindre le fichier $zipFileName"
Write-Host "  2. Par WhatsApp: Envoyer le fichier $zipFileName"
Write-Host "  3. Par lien: Partager le lien GitHub"
Write-Host "     https://github.com/AnthonyKamoto/UniKinHub"
Write-Host ""
Write-Host "💡 Note:" -ForegroundColor Gray
Write-Host "  Le destinataire devra exécuter .\setup.ps1 après extraction"
Write-Host "  pour installer automatiquement toutes les dépendances."
Write-Host ""
Write-Host ("=" * 60)
Write-Host "Package prêt à être partagé ! 🎉" -ForegroundColor Green
Write-Host ("=" * 60)
