# 🏫 ECOLE+ v3.0 Premium | Système de Pilotage Académique

> **L'excellence n'est pas un acte, c'est une habitude.** ECOLE+ v3.0 est une plateforme intégrée de gestion scolaire conçue pour harmoniser le suivi pédagogique, la gestion administrative et la communication avec les familles.

---

## 💎 Écosystème de Fonctionnalités

### 🚀 Cockpit de Pilotage (Administration)
*   **Tableau de Bord Holistique** : Visualisation instantanée du taux de réussite global et des KPIs critiques.
*   **Matrice de Configuration** : Gestion dynamique des classes, des séries (A, B, C, D) et une matrice de coefficients personnalisable par matière.
*   **Contrôle du Staff** : Interface de déploiement et d'affectation des enseignants par matière et par classe.

### 📝 Gestion Intelligente des Évaluations (Module 3)
*   **Terminal de Saisie Enseignant** : Workflow sécurisé (Brouillon > Validation) avec calcul automatique des moyennes pondérées (calcul des moyennes en tenant compte des coefficients).
*   **Support Multi-Matières** : Gestion robuste des enseignants cross-disciplinaires (ex: "Communication écrite et Lecture").
*   **Instance de Délibération** : Outil de validation officielle permettant le verrouillage des notes pour un semestre donné.

### 📈 Analytique & Communication
*   **Générateur de Bulletins de Prestige** : Production de bulletins au format PDF professionnel pour les semestres et les synthèses annuelles.
*   **Portail Parent (Suivi en Direct)** : Interface dédiée permettant aux parents de consulter les résultats de leurs enfants en temps réel.
*   **Logs de Notifications** : Traçabilité des communications sortantes (Email / WhatsApp) pour un suivi parent-élève sans faille.

---

## 🏗️ Architecture Technique

ECOLE+ v3.0 repose sur une architecture **hybride** performante garantissant une réactivité maximale et une robustesse éprouvée :

*   **Frontend Immersif** : 
    *   Framework : **React.js** (Vite).
    *   Design : Interface "Glassmorphism" moderne, responsive et optimisée pour l'expérience utilisateur (UX).
*   **Backend Double Moteur** :
    *   **Node.js / Express** : Dédié aux services de calcul intensif et aux routes de validation critiques.
    *   **PHP REST API** : Moteur historique optimisé pour la persistance des données et les statistiques rapides.
*   **Base de Données** : **MySQL** avec schémas normalisés et intégrité référentielle.

---

## 🚀 Installation & Déploiement

### 📋 Prérequis
*   **Environnement PHP/MySQL** : XAMPP, WAMP ou équivalent.
*   **Node.js** : Version 16+ recommandée.

### 1️⃣ Mise en Place de la Database
1. Créez une base de données MySQL nommée `ecole_plus`.
2. Importez le script structurel : `backend/database_complet.sql`.

### 2️⃣ Démarrage du Backend
Le backend nécessite l'exécution simultanée du serveur Apache (pour PHP) et de l'instance Node.js.
1. Activez **Apache & MySQL** via votre panneau de contrôle.
2. Dans le terminal, dossier `/backend` :
   ```bash
   npm install
   npm start
   ```

### 3️⃣ Lancement du Frontend
1. Dans un autre terminal, dossier `/frontend` :
   ```bash
   npm install
   npm run dev
   ```
2. Accédez à l'URL locale générée par Vite.

---

## 🔑 Identifiants d'Accès (Mode Démo)

| Profil | Email | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@gmail.com` | `admin123` |
| **Enseignant** | `kouakou@yahoo.fr` | `1234` |

---
© 2025 - Projet ECOLE+ Premium v3.0. Tous droits réservés.
