# 🎥 Guide de Démonstration - UniKinHub

> Instructions complètes pour la démonstration du système de gestion d'actualités

## 📋 Table des Matières

1. [Préparation de l'Environnement](#préparation-de-lenvironnement)
2. [Scénarios de Démonstration](#scénarios-de-démonstration)
3. [Captures d'Écran](#captures-décran)
4. [Script de Présentation](#script-de-présentation)
5. [Points Clés à Montrer](#points-clés-à-montrer)

---

## 🚀 Préparation de l'Environnement

### Avant la Démonstration

#### 1. Vérifier les Services

```powershell
# Lancer tous les services
.\start-all.ps1

# Vérifier que tout fonctionne
# Backend : http://127.0.0.1:8000
# Frontend : http://localhost:3001
# Mobile : Application sur émulateur/téléphone
```

#### 2. Comptes de Test Disponibles

| Rôle | Username | Password | Permissions |
|------|----------|----------|-------------|
| Modérateur | moderateur1 | password123 | Approuver/Rejeter |
| Enseignant | enseignant1 | password123 | Créer des news |
| Publiant (Enseignant) | enseignant2 | password123 | Créer des news |
| Étudiant | etudiant1 | password123 | Consulter |
| Étudiant Publiant | etudiant2 | password123 | Créer + Consulter |

#### 3. Données de Test

La base de données contient :

- ✅ **6 utilisateurs** avec rôles différents
- ✅ **3 catégories** : Académique, Événements, Communauté
- ✅ **7 actualités** en statut "pending" (en attente de modération)
- ✅ Plusieurs actualités publiées pour démonstration

---

## 🎬 Scénarios de Démonstration

### Scénario 1 : Consultation d'Actualités (Étudiant)

**Objectif :** Montrer comment un étudiant consulte les actualités

**Durée :** 3-4 minutes

**Étapes :**

1. **Connexion**

   ```
   - Ouvrir http://localhost:3001
   - Cliquer "Se connecter"
   - Username: etudiant1
   - Password: password123
   - Cliquer "Connexion"
   ```

2. **Navigation dans le fil**
   - Montrer le fil d'actualités (page d'accueil)
   - Expliquer les informations affichées :
     - Titre
     - Auteur
     - Date
     - Catégorie
     - Importance (couleur)

3. **Lire une actualité**
   - Cliquer sur une actualité
   - Montrer le contenu complet
   - Image (si présente)
   - Programme concerné

4. **Filtrer les actualités**
   - Utiliser le filtre par catégorie
   - Montrer le filtre par importance
   - Démontrer la recherche

5. **Notifications**
   - Accéder au centre de notifications
   - Expliquer les types de notifications

### Scénario 2 : Création d'Actualité (Enseignant/Publiant)

**Objectif :** Montrer le processus de création d'une actualité

**Durée :** 5-6 minutes

**Étapes :**

1. **Connexion en tant qu'enseignant**

   ```
   - Se déconnecter (si connecté)
   - Username: enseignant1
   - Password: password123
   ```

2. **Créer une actualité**
   - Cliquer sur "Créer une actualité"
   - Remplir le formulaire :

     ```
     Titre : Nouvelle session d'examens - Janvier 2026
     Contenu : Les examens de la session de janvier...
     Catégorie : Académique
     Importance : High
     Programme : Tous les programmes
     ```

   - Ajouter une image (optionnel)
   - Cliquer "Publier"

3. **Vérifier le statut**
   - Expliquer que l'actualité est en "pending"
   - Elle n'apparaît pas encore publiquement
   - Elle attend l'approbation d'un modérateur

### Scénario 3 : Modération (Modérateur)

**Objectif :** Démontrer le workflow de modération

**Durée :** 4-5 minutes

**Étapes :**

1. **Connexion en tant que modérateur**

   ```
   - Se déconnecter
   - Username: moderateur1
   - Password: password123
   ```

2. **Accéder à l'interface de modération**
   - Menu → "Modération"
   - Voir la liste des actualités en attente (7+ items)

3. **Examiner une actualité**
   - Cliquer sur une actualité pending
   - Lire le contenu
   - Vérifier la qualité

4. **Approuver une actualité**
   - Cliquer "Approuver"
   - Ajouter un commentaire (optionnel) :

     ```
     Commentaire : Actualité conforme, informations vérifiées
     ```

   - Confirmer l'approbation
   - **L'actualité devient publique instantanément**

5. **Rejeter une actualité (démonstration)**
   - Sélectionner une autre actualité
   - Cliquer "Rejeter"
   - Raison obligatoire :

     ```
     Raison : Contenu incomplet, veuillez ajouter plus de détails
     ```

   - Confirmer le rejet

6. **Vérifier les changements**
   - Se déconnecter
   - Se reconnecter en tant qu'étudiant
   - Vérifier que l'actualité approuvée apparaît
   - Montrer qu'elle est maintenant visible par tous

### Scénario 4 : Application Mobile (Bonus)

**Objectif :** Montrer l'application mobile Android

**Durée :** 3-4 minutes

**Étapes :**

1. **Lancer l'application**
   - Ouvrir UniKinHub sur émulateur/téléphone
   - Connexion avec etudiant1

2. **Navigation mobile**
   - Montrer le fil d'actualités
   - Swipe pour actualiser
   - Tap pour ouvrir une actualité

3. **Notifications push**
   - Montrer les paramètres de notification
   - Activer les notifications
   - Expliquer les types de notifications

4. **Fonctionnalités spécifiques**
   - Mode hors ligne
   - Partage d'actualités
   - Navigation gestuelle

---

## 📸 Captures d'Écran

### Points à Capturer

#### 1. Page de Connexion

- Interface claire et simple
- Champs username/password
- Bouton de connexion

#### 2. Fil d'Actualités (Vue Étudiant)

- Liste des actualités
- Informations visibles (titre, auteur, date, catégorie)
- Badges d'importance colorés
- Barre de recherche

#### 3. Détail d'une Actualité

- Titre complet
- Image (si présente)
- Contenu complet
- Métadonnées (auteur, date, programme)

#### 4. Formulaire de Création

- Tous les champs visibles
- Upload d'image
- Sélecteur de catégorie
- Niveau d'importance

#### 5. Interface de Modération

- Liste des actualités pending
- Statut visible
- Boutons Approuver/Rejeter

#### 6. Modal de Modération

- Détails de l'actualité
- Zone de commentaire/raison
- Boutons d'action

#### 7. Application Mobile

- Écran d'accueil mobile
- Navigation inférieure
- Vue détaillée mobile
- Paramètres de notification

### Commandes pour Prendre des Screenshots

**Sur Windows :**

- `Win + Shift + S` : Outil de capture
- Ou utilisez l'outil Capture d'écran

**Sur émulateur Android :**

- Bouton camera dans la barre d'outils Android Studio
- Ou `Ctrl + S`

### Organisation des Screenshots

Créez un dossier `screenshots/` avec :

```
screenshots/
├── 01-login.png
├── 02-fil-actualites.png
├── 03-detail-actualite.png
├── 04-creation-form.png
├── 05-moderation-list.png
├── 06-moderation-approve.png
├── 07-moderation-reject.png
├── 08-mobile-home.png
├── 09-mobile-detail.png
└── 10-mobile-notifications.png
```

---

## 🎤 Script de Présentation

### Introduction (1 minute)

```
"Bonjour, je vais vous présenter UniKinHub, un système de gestion d'actualités 
universitaires avec modération.

Le système permet aux étudiants de consulter des actualités, aux enseignants 
de publier des informations, et aux modérateurs de valider le contenu avant 
publication.

Nous avons développé :
- Un backend Python/Django avec API REST
- Un frontend web React/TypeScript
- Une application mobile Flutter Android
- Un système complet de notifications"
```

### Démonstration Étudiant (3 minutes)

```
"Commençons par la vue étudiant. Je me connecte avec un compte étudiant.

[Connexion]

Nous arrivons sur le fil d'actualités. Vous pouvez voir :
- Les actualités publiées
- Des badges colorés pour l'importance (rouge=urgent, jaune=moyen, vert=info)
- Les catégories : Académique, Événements, Communauté

[Clic sur une actualité]

En cliquant sur une actualité, nous voyons le contenu complet avec l'image.

[Montrer les filtres]

Les étudiants peuvent filtrer par catégorie et rechercher des actualités 
spécifiques."
```

### Démonstration Création (4 minutes)

```
"Maintenant, voyons comment un enseignant crée une actualité.

[Déconnexion et connexion enseignant]

Je clique sur 'Créer une actualité'.

[Remplir le formulaire]

Je remplis :
- Le titre
- Le contenu
- Je sélectionne la catégorie
- Je définis l'importance
- J'ajoute une image si nécessaire

[Clic Publier]

Important : l'actualité n'est PAS publiée immédiatement. Elle passe en statut 
'pending' et attend la validation d'un modérateur. C'est le cœur du système 
de modération."
```

### Démonstration Modération (5 minutes)

```
"Passons maintenant à la modération, fonctionnalité clé du système.

[Connexion modérateur]

Le modérateur accède à l'interface de modération qui liste toutes les 
actualités en attente.

[Montrer la liste]

Nous avons actuellement 7 actualités en attente. Le modérateur peut :
- Les examiner une par une
- Vérifier le contenu
- Approuver ou rejeter

[Approuver une actualité]

Je clique sur Approuver, j'ajoute un commentaire si nécessaire, et je confirme.

[Montrer le changement de statut]

L'actualité passe immédiatement en statut 'published' et devient visible par 
tous les étudiants.

[Rejeter une actualité]

Pour le rejet, je dois obligatoirement fournir une raison. Cela permet à 
l'auteur de comprendre pourquoi et d'améliorer son contenu.

[Vérification côté étudiant]

Revenons en tant qu'étudiant... voilà, l'actualité approuvée apparaît 
maintenant dans le fil."
```

### Application Mobile (3 minutes)

```
"Enfin, voyons rapidement l'application mobile Android.

[Ouvrir l'app]

Même système de connexion, même architecture, mais adapté au mobile.

[Navigation]

Navigation intuitive avec :
- Fil d'actualités scrollable
- Swipe pour rafraîchir
- Tap pour ouvrir

[Notifications]

L'application supporte les notifications push Firebase pour alerter les 
étudiants des nouvelles actualités importantes."
```

### Conclusion (1 minute)

```
"En résumé, UniKinHub offre :

✅ Un système complet de gestion d'actualités
✅ Une modération efficace avant publication
✅ Des interfaces web et mobile
✅ Un système de notifications multi-canal
✅ Des rôles et permissions configurables

Le workflow est simple :
1. Création par un enseignant/publiant
2. Validation par un modérateur
3. Publication automatique après approbation
4. Consultation par tous les étudiants

Le projet est entièrement open-source, documenté, et prêt pour la production.

Merci de votre attention. Y a-t-il des questions ?"
```

---

## 🎯 Points Clés à Montrer

### Fonctionnalités Essentielles

#### 1. Système de Modération ⭐

- **Le plus important** : actualité pending → approve → published
- Montrer le workflow complet
- Insister sur le fait que c'est automatique

#### 2. Multi-Rôles

- 3 types d'utilisateurs : Étudiant, Publiant, Modérateur
- Permissions différentes
- Interface adaptée au rôle

#### 3. Catégories et Filtres

- 3 catégories définies
- Filtrage facile
- Recherche fonctionnelle

#### 4. Notifications

- Emails configurables
- Notifications push (mobile)
- Centre de notifications (web)

#### 5. Responsive Design

- Web fonctionne sur desktop
- Application mobile native
- Même données, interfaces adaptées

### Aspects Techniques à Mentionner

#### Backend

- Django 5.2.7 + Django REST Framework
- API RESTful complète
- Token Authentication
- SQLite (peut être PostgreSQL en production)

#### Frontend Web

- React 18 + TypeScript
- Material-UI pour le design
- Architecture moderne avec hooks

#### Mobile

- Flutter 3.35.6
- Material Design 3
- Support Android (extensible iOS)

#### Sécurité

- Authentification par token
- Permissions granulaires
- Validation des données
- Protection CSRF

---

## 📊 Métriques de Démonstration

### Données de Test Disponibles

```
Utilisateurs : 6 comptes
├── 1 Modérateur
├── 2 Enseignants (publiants)
├── 2 Étudiants (dont 1 publiant)
└── 1 Admin

Actualités : 10+ items
├── 7 en pending (à modérer)
├── 3+ publiées
└── Quelques brouillons

Catégories : 3
├── Académique
├── Événements
└── Communauté
```

### Performance à Montrer

- Temps de chargement : < 2 secondes
- Approbation instantanée
- Synchronisation temps réel
- Responsive sur mobile

---

## 🎥 Enregistrement Vidéo (Optionnel)

### Outils Recommandés

- **OBS Studio** (gratuit) : <https://obsproject.com/>
- **ShareX** (Windows) : <https://getsharex.com/>
- **Loom** (en ligne) : <https://www.loom.com/>

### Structure de la Vidéo

1. **Introduction** (30s)
   - Présentation du projet
   - Technologies utilisées

2. **Démonstration Étudiant** (2min)
   - Connexion
   - Navigation
   - Consultation

3. **Démonstration Création** (2min)
   - Connexion enseignant
   - Création d'actualité
   - Explication du statut pending

4. **Démonstration Modération** (3min)
   - Connexion modérateur
   - Approbation
   - Rejet
   - Vérification publication

5. **Application Mobile** (2min)
   - Lancement
   - Navigation
   - Fonctionnalités

6. **Conclusion** (30s)
   - Récapitulatif
   - Remerciements

**Durée totale recommandée : 8-10 minutes**

---

## ✅ Checklist Avant Démonstration

### Technique

- [ ] Backend démarré et accessible
- [ ] Frontend démarré et accessible
- [ ] Base de données avec données de test
- [ ] Application mobile installée sur émulateur/téléphone
- [ ] Tous les comptes de test fonctionnels
- [ ] Connexion Internet stable

### Présentation

- [ ] Script de présentation préparé
- [ ] Screenshots capturés
- [ ] Vidéo enregistrée (optionnel)
- [ ] Documentation imprimée/affichée
- [ ] Questions/Réponses anticipées

### Environnement

- [ ] Écran/Projecteur testé
- [ ] Son testé (si vidéo)
- [ ] Navigateur configuré (plein écran)
- [ ] Pas de notifications perturbatrices
- [ ] Fenêtres inutiles fermées

---

## 🐛 Plan B (Dépannage Rapide)

### Si le Backend ne Démarre Pas

```powershell
# Vérifier le port
Get-NetTCPConnection -LocalPort 8000

# Tuer le processus si nécessaire
Stop-Process -Id <PID> -Force

# Relancer
cd backend
python manage.py runserver
```

### Si le Frontend ne Démarre Pas

```powershell
# Vérifier le port
Get-NetTCPConnection -LocalPort 3001

# Relancer
cd frontend
pnpm run dev
```

### En Cas de Problème Majeur

- Avoir des screenshots pré-capturés
- Avoir une vidéo de backup
- Expliquer le workflow avec les screenshots

---

## 📝 Notes pour le Présentateur

### À Faire

- ✅ Parler clairement et pas trop vite
- ✅ Expliquer ce que vous faites à chaque étape
- ✅ Montrer le code si demandé
- ✅ Répondre aux questions avec assurance

### À Éviter

- ❌ Aller trop vite
- ❌ Cliquer partout sans expliquer
- ❌ Ignorer les erreurs
- ❌ Oublier de montrer la modération (clé du projet)

### Phrases Clés

- "Le point central du projet est le **système de modération**"
- "Toute actualité passe par un **workflow d'approbation**"
- "Le système est **multi-plateforme** : web et mobile"
- "L'architecture est **moderne et scalable**"
- "Le code est **entièrement documenté** et open-source"

---

**Version :** 1.0.0  
**Date :** 5 novembre 2025  
**Durée totale de démonstration :** 15-20 minutes

*Bonne démonstration ! 🚀*
