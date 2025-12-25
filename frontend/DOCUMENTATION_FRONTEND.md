# Documentation Frontend - SchoolHub+

## 📝 Présentation du Projet
SchoolHub+ est une plateforme de gestion scolaire moderne comprenant deux espaces distincts : un **Portail Administration** pour la gestion de l'établissement et un **Espace Parent** pour le suivi de la scolarité et les inscriptions en ligne.

---

## 🛠 Technologies Utilisées
- **Framework Core** : React.js (Vite)
- **Langage** : JavaScript (ES6+)
- **Styling** : Tailwind CSS (Design Premium & Responsive)
- **Icônes** : Lucide React
- **Animations** : Tailwind Animate / CSS Keyframes
- **Gestion d'état** : React Hooks (useState, useEffect)

---

## 📂 Architecture des Fichiers
Le projet est structuré dans le répertoire `src/projet1/` :

### 1. Espace Administration (`/admin`)
- `AdminManager.jsx` : Orchestrateur central de l'espace admin (Routage interne).
- `/layout` : Contient le `AdminLayout` (Sidebar, Header, Navigation).
- `/pages` :
  - `DashboardPage.jsx` : Statistiques globales.
  - `/inscriptions` : Liste et Détails (Validation/Rejet).
  - `/eleves` : Gestion des profils, annuaires et **Génération de Cartes Scolaires**.
  - `/classes` : Gestion des classes, Affectations et **Registre de Présence**.
  - `GradeEntrySheet.jsx` : Module de saisie de masse des notes avec coefficients.
  - `SendNotification.jsx` : Centre de communication (Email/WhatsApp).

### 2. Espace Parent (`/parent`)
- `ParentManager.jsx` : Orchestrateur central du portail parent.
- `/pages` :
  - `Registration.jsx` : Tunnel d'inscription/réinscription en 4 étapes.
  - `Grades.jsx` : Consultation des notes par trimestre avec détail des épreuves.
  - `Payments.jsx` : Historique et **Module Mobile Money** (Orange/MTN/Moov).
  - `Attendance.jsx` : Suivi des taux de présence et absences.
  - `Settings.jsx` : Profil parent et sécurité.

---

## ⚙️ Fonctionnalités Clés Implémentées

### 🏫 Pour l'Administration
- **Validation Intelligente** : La validation d'une inscription transforme automatiquement le dossier en compte élève.
- **Gestion Académique** : 
    - Calcul automatique des moyennes selon la formule : `(Moy. Interros + Devoir + 2*Composition) / 4`.
    - Système d'appel quotidien avec motifs d'absence.
- **Communication** : Templates de messages pour réunions, rappels de paiement et alertes d'absence.
- **Output Professionnel** : Impression des fiches d'inscription et génération de cartes scolaires avec QR Code.

### 👨‍👩‍👧 Pour les Parents
- **Inscription 100% Digitale** : Capture des données parents/élèves et upload de documents (extraits, photos).
- **Paiements Mobiles** : Simulation réelle de paiement via Mobile Money pour les frais de scolarité.
- **Monitoring** : Vue transparente sur les résultats scolaires et l'assiduité.

---

## 🎨 Design System
L'application utilise deux thèmes contrastés :
- **Admin** : Fond clair (`#f8fafc`), accents Orange (`brand-primary`) pour un aspect professionnel et propre.
- **Parent** : Thème sombre ("Glassmorphism") avec un arrière-plan `#0f172a`, flous de fond et accents colorés pour un aspect premium "App Mobile".

---

## 🚀 Guide d'Utilisation

### 🔐 Authentification
- **Admin** : Accédez à `/projet1`. Utilisez n'importe quel identifiant pour la démo. Cochez "Se souvenir de moi" pour rester connecté.
- **Parent** : Accédez à `/projet1-parent`. Vous pouvez vous connecter directement ou créer un compte via l'onglet "Inscription".

### 🏫 Espace Administration (Parcours Type)
1. **Valider une Inscription** : Menu `Inscriptions` → Cliquez sur un dossier → Vérifiez les documents → Cliquez sur `Valider l'inscription`. L'enfant est automatiquement ajouté à la base des élèves.
2. **Gérer les Classes** : Menu `Classes` → Sélectionnez une classe → Utilisez `Faire l'appel` pour marquer les présences quotidiennes ou `Saisie des Notes` pour entrer les résultats du trimestre.
3. **Imprimer les Cartes** : Menu `Cartes Scolaires` → Recherchez un élève → Cliquez sur `Générer PDF` pour obtenir sa carte d'identité scolaire avec QR Code.
4. **Communiquer** : Menu `Notifications` → Choisissez une classe (ex: 6ème) → Sélectionnez le template `Rappel Paiement` → Cliquez sur `Envoyer`.

### 👨‍👩‍👧 Espace Parent (Parcours Type)
1. **Inscrire un enfant** : Cliquez sur le bouton `Inscrire un nouvel enfant` sur le Dashboard → Suivez les 4 étapes (Parent → Enfant → Documents → Paiement).
2. **Suivre les Résultats** : Menu `Notes` → Sélectionnez l'enfant et le trimestre souhaité. Le système affiche le détail par matière et la moyenne calculée.
3. **Payer les Frais** : Menu `Paiements` → Bouton `Effectuer un paiement` → Choisissez l'opérateur (Orange/MTN/Moov) et validez la transaction simulée.
4. **Justifier les absences** : Menu `Présence` pour consulter l'historique et voir si l'école a bien reçu les motifs d'absence.

---

## 🚀 Installation et Lancement
1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer en mode développement :
   ```bash
   npm run dev
   ```
3. Accès aux espaces :
   - Admin : `/projet1`
   - Parent : `/projet1-parent`

---

## 📌 Maintenance
Toutes les données sont actuellement gérées via des fichiers de mock au sein des différents "Managers". Pour l'intégration backend (API), les appels devront être branchés dans les fichiers correspondants en remplacement des `sets` de states locaux.
