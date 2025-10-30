# Fondation Children Coding Club

## Projet N°3 — Logiciel de gestion de news
**Version :** PI.10.25.FCCC-V003  
**Date :** 11 Octobre 2025  

---

## Table des matières
1. Contexte et justification  
2. Objectifs pédagogiques  
3. Description fonctionnelle  
   - 3.1 Propriétés des news  
   - 3.2 Acteurs et rôles  
   - 3.3 Fréquences de notification possibles  
4. Modules à réaliser  
5. Technologies et langage  
6. Guide pas à pas pour les formateurs  
7. Livrable pour les formateurs  
8. Compréhension et cadrage du projet  
9. Préparation technique et outils  
   - 9.1 Outils et logiciels  
   - 9.2 Compétences nécessaires  
10. Organisation et planification du projet  
11. Conseils méthodologiques pour le développement  
12. Livrable attendu pour la Fondation CCC  

---

## Projet — Système de diffusion d’informations pour les étudiants de Kinshasa

**Encadrant :** DIOGO NORMAN Nono  
**Catégorie :** Application web & mobile (Python backend, Android/Flutter frontend)

### 1 — Contexte et justification
Dans les universités de Kinshasa (UNIKIN, UPN, autres institutions), de nombreuses informations circulent auprès des étudiants (annonces, messages, événements). Ces informations sont souvent dispersées.  
**Objectif :** créer un système centralisé de diffusion d’informations.

Les étudiants pourront :
- Recevoir des infos pertinentes pour leur programme  
- Consulter un site web de news validées  
- Utiliser une app mobile Android  
- Choisir la fréquence des notifications

### 2 — Objectifs pédagogiques
Le projet permet de :
1. Maîtriser le développement full-stack (Python backend + web frontend)  
2. Créer une API sécurisée  
3. Développer une app mobile  
4. Gérer utilisateurs et rôles  
5. Implémenter les notifications  
6. Produire documentation et livrable complet  

---

## 3 — Description fonctionnelle

### 3.1 — Propriétés des news
Chaque news a :  
- Programme destinataire  
- Dates de rédaction, modération, publication  
- Titre/contenu avant et après modération  
- Accord du modérateur  
- Importance (faible → urgente)  
- Auteur/invalidation éventuelle  

### 3.2 — Acteurs et rôles
- **Administrateurs :** gestion des rôles, publication  
- **Modérateurs :** valident ou refusent les news  
- **Publiants :** créent et soumettent  
- **Étudiants :** consultent et règlent leurs notifications  

### 3.3 — Fréquences de notification possibles
- À chaque nouvelle info  
- Quotidienne  
- Hebdomadaire  

---

## 4 — Modules à réaliser

| Module | Fonctionnalités principales |
|--------|------------------------------|
| Administration | Gestion utilisateurs, rôles, permissions |
| Gestion des news | CRUD, consultation |
| Modération | Validation, commentaire d’invalidation |
| Paramètres de notification | Fréquence, type (mail/push) |
| Application web | Consultation filtrée par programme/date |
| Application mobile | Notifications push, tri, filtrage |

---

## 5 — Technologies et langage
- **Backend :** Python (Django/Flask)  
- **Base de données :** PostgreSQL ou SQLite  
- **Frontend :** HTML/CSS/JS ou React  
- **Mobile :** Android (Java/Kotlin) ou Flutter (Dart)  
- **Notifications :** SMTP + Firebase Cloud Messaging  
- **Tests :** Pytest, CI/CD via GitHub Actions ou GitLab CI  

---

## 6 — Guide pas à pas pour les formateurs

1. **Installation backend Python** : environnement virtuel, dépendances, base de données, admin  
2. **Création utilisateurs/rôles** : admin, modérateurs, publiants, étudiants  
3. **Gestion des news** : création, modération, validation  
4. **Configuration notifications** : fréquence, tests d’envoi  
5. **Interface web/mobile** : tri, recherche, affichage  
6. **Livrables** : code source, DB, guide d’installation, manuel étudiant, démonstration  

---

## 7 — Livrable pour les formateurs
Le projet doit inclure :
- Dépôt GitHub/ZIP avec backend, frontend, scripts, base initialisée, documentation  
- Guide utilisateur étudiants  
- Exemples de news et comptes de test  

---

## 8 — Compréhension et cadrage du projet
Les formateurs doivent :
1. Analyser le contexte universitaire  
2. Identifier les objectifs (diffusion centralisée)  
3. Cartographier les acteurs : admin, modérateurs, publiants, étudiants  
4. Lister les fonctionnalités  

> 💡 **Astuce expert :** Réaliser un diagramme de cas d’utilisation avant le code

---

## 9 — Préparation technique et outils

### 9.1 — Outils et logiciels

| Catégorie | Outils |
|-----------|--------|
| Langage backend | Python 3.10+ |
| Framework | Django ou Flask |
| BDD | PostgreSQL / SQLite |
| Frontend web | HTML/CSS/JS ou React |
| Mobile | Android Studio / Flutter |
| Notifications | SMTP, FCM |
| Versioning | Git + GitHub/GitLab |
| Tests | Pytest |
| Documentation | Markdown, PDF, Word |
| IDE | VSCode, PyCharm, Android Studio |

### 9.2 — Compétences nécessaires
- Python, POO  
- API REST Django/Flask  
- Conception BDD  
- Authentification, permissions  
- Envoi mails & push  
- Dév web et mobile  
- Git, tests unitaires  

---

## 10 — Organisation et planification du projet

1. Découper en modules  
2. Répartir les responsabilités  
3. Établir un calendrier : besoins → backend → frontend → mobile → tests → déploiement  
4. Dépôt Git centralisé  
5. Jeux de données de test  

> 💡 **Astuce expert :** utiliser un diagramme entité-relation

---

## 11 — Conseils méthodologiques

**Backend :** modèles, permissions, API  
**Frontend :** affichage, filtres, news validées  
**Mobile :** UI ergonomique, notifications push  
**Notifications :** tester fréquences, gérer erreurs  
**Tests :** unité, cohérence des dates, scénarios multi-rôles  

---

## 12 — Livrable attendu pour la Fondation CCC

1. Code source complet et commenté  
2. Base de données initialisée  
3. Documentation complète :  
   - Guide d’installation/configuration  
   - Manuel utilisateur  
   - Guide de test  
4. Démonstration (screenshots/vidéo)  
5. Architecture et diagrammes (système + ER)
