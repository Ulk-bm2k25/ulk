# 🏫 SchoolHub – Module Admin

📁 SchoolHub – Module Admin
Ce module fait partie de la plateforme SchoolHub et gère l’administration des inscriptions, le suivi des élèves et la génération de documents scolaires. Il est conçu pour être modulaire, facilement extensible et connecté à d’autres modules de la plateforme.

---

## 🚀 État du Projet

🔸 Développement en cours sur le **Module d'Inscription & Gestion Administrative**

---

## 🛠️ Stack Technique

- ⚛️ **Framework** : React 19 (Vite)
- 💻 **Langage** : JavaScript (ESModules)
- 🎨 **Styling** : Tailwind CSS v4 (Mobile First)
- 🖼️ **Icônes** : Lucide React
- 🧭 **Navigation** : React Router Dom v7
- 🗂️ **Architecture** : Modulaire (sous-dossiers projets)

---

## **Structure du module**

  src/
   └── projet1/
      └── admin/
        ├── pages/       # Vues (Dashboard, Listes, Profils)
        ├── layout/      # Structure (Sidebar, Header)
        └── AdminManager.jsx # Point d'entrée du module

  > ⚠️ L'application utilise des données simulées (Mock Data). Aucune connexion backend requise pour tester l'UX actuelle.

---

## 🌟 Fonctionnalités Principales

### 🔐 Authentification & Sécurité

- 🔄 Page de connexion avec simulation de chargement
- 🛡️ Validation des champs (Email/Mot de passe)
- ⚡ Feedback visuel utilisateur (Loaders)

### 📊 Tableau de Bord (Dashboard)

- 📈 **KPIs :** Nombre d'élèves, inscriptions en attente, taux de présence
- 🚨 **Alertes dynamiques :** Notification en cas de classes saturées ou dossiers en attente
- 🧭 **Navigation rapide :** Accès direct aux modules via widgets

### 📝 Gestion des Inscriptions (Flux Entrant)

- 🗂️ **Liste de tri :** Filtrage par statut (En attente / Validé / Rejeté)
- 👁️ **Vue Détail :** Master-Detail (État civil, Parents, Pièces jointes)
- ✅ **Workflow de validation :** Valider, Rejeter ou Demander un complément

### 👨‍🎓 Annuaire des Élèves (Flux Actif)

- 🔍 **Recherche avancée :** Filtrage par Nom, Classe, Statut
- 📑 **Actions de masse :** Sélection multiple, génération de documents groupés
- 🗃️ **Profil élève complet :** Infos, Parcours, Documents, Widgets financiers

### 🪪 Génération de Documents

- 🏷️ **Carte scolaire numérique :** Format CR80 (carte bancaire)
- 📱 **QR Code intégré** (pointage, Projet 4)
- 🖨️ **Impression optimisée :** CSS `@media print` pour badges ou papier

---

## 🧭 Guide de Navigation

- **🔑 Login :** Cliquez sur **Se connecter** *(Pas de credentials requis en mode démo)*
- **📊 Dashboard :** Cliquez sur une alerte **Inscriptions en attente** ou via le menu latéral
- **📝 Inscriptions :**
  - Cliquez sur l'icône **Œil** 👁️ pour voir le détail d'un dossier
  - Utilisez le **Menu (3 points)** ⋮ pour des actions rapides
- **👨‍🎓 Élèves :**
  - Cochez plusieurs élèves pour voir la barre d'actions groupées apparaître
  - Entrez dans un profil et cliquez sur **Carte Scolaire** 🪪 pour générer le badge

---

## 🚧 Prochaines Étapes (Backend)

Ce frontend est prêt à être connecté à l'API Laravel. Les structures de données (JSON) sont alignées avec les migrations de la base de données :

- Table `inscriptions`
- Table `eleves` & `users`
- Table `parents_tuteurs`
- Table `cartes_scolarite`
