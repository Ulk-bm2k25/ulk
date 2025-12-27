# Plan de Développement - School-HUB

## Vue d'ensemble des 4 Projets

Cette plateforme web de gestion des établissements primaires et secondaires est subdivisée en 4 sous-projets interconnectés.

---

## 📋 État d'Avancement

### ✅ Projet 1 : Module d'inscription et de réinscription
**Statut : Bien avancé**

#### Fonctionnalités implémentées :
- ✅ Inscription et réinscription en ligne
- ✅ Enregistrement des données parents/tuteurs
- ✅ Enregistrement des données élèves
- ✅ Gestion des classes
- ✅ Affectation des élèves dans les classes
- ✅ Édition des fiches d'inscription
- ✅ Carte de scolarité
- ✅ Gestion de notification et d'alertes aux parents
- ✅ Envoi de messages sur l'e-mail concernant les tranches de paiement

#### Fichiers clés :
- Frontend : `frontend/src/projet1/`
- Backend : Modèles `Eleve`, `ParentTuteur`, `Classe`, `Inscription`, `FicheInscription`, `CarteScolarite`
- Routes : Intégrées dans `App.jsx`

---

### ⚠️ Projet 2 : Module de gestion de la scolarité
**Statut : Partiellement implémenté**

#### Fonctionnalités implémentées :
- ✅ Gestion des frais d'inscription et des frais de scolarité par tranche
- ✅ Gestion du mode de paiement par momo (simulation)
- ✅ Gestion des notifications de paiement
- ✅ Édition des statistiques financières
- ✅ Gestion des remboursements (backend + frontend partiel)

#### Fonctionnalités à compléter :
- ⚠️ Intégration complète du paiement Mobile Money (actuellement simulation)
- ⚠️ Gestion des frais généraux (structure existe mais interface à compléter)

#### Fichiers clés :
- Frontend : `frontend/src/components/FinancialDashboard.tsx`, `frontend/src/components/Remboursements.jsx`
- Backend : `FinancialReportController`, `RemboursementController`, `NotificationPaymentController`
- Modèles : `Remboursement`, `Notification_Payment`

---

### ❌ Projet 3 : Module de gestion des notes
**Statut : Structure de base existante, module complet à développer**

#### Fonctionnalités à implémenter :
- ❌ Gestion des matières et de leur coefficient par classe et par série
- ❌ Gestion des semestres et ou trimestres
- ❌ Gestion des notes par types d'évaluation
- ❌ Gestion des notifications par mails et éventuellement par WhatsApp
- ❌ Gestion des instances de validation des notes
- ❌ Édition des statistiques
- ❌ Calcul de moyenne
- ❌ Délibération
- ❌ Édition des bulletins de notes par semestres / trimestres / annuels

#### Éléments existants :
- ✅ Modèle `Note` (backend)
- ✅ Modèle `Matiere` (backend)
- ✅ Modèle `Semestre` (backend)
- ✅ Composant `GradeEntrySheet.jsx` (frontend - partiel, dans projet1)

#### Structure à créer :
```
frontend/src/projet3/
  ├── admin/
  │   ├── NotesManager.jsx          # Gestionnaire principal
  │   ├── pages/
  │   │   ├── MatieresManager.jsx  # Gestion matières/coefficients
  │   │   ├── SemestresManager.jsx  # Gestion semestres/trimestres
  │   │   ├── NotesEntry.jsx       # Saisie des notes
  │   │   ├── NotesValidation.jsx   # Validation des notes
  │   │   ├── Deliberation.jsx      # Délibération
  │   │   ├── Bulletins.jsx         # Génération bulletins
  │   │   └── NotesStats.jsx        # Statistiques
  │   └── components/
  │       ├── NoteCard.jsx
  │       ├── BulletinPreview.jsx
  │       └── ValidationWorkflow.jsx
  └── parent/
      └── pages/
          └── Grades.jsx            # Consultation notes (existe déjà dans projet1)
```

#### Backend à créer :
```
backend/app/Http/Controllers/Api/
  ├── MatiereController.php
  ├── SemestreController.php
  ├── NoteController.php
  ├── BulletinController.php
  └── DeliberationController.php
```

---

### ⚠️ Projet 4 : Plateforme de gestion de présence
**Statut : Partiellement implémenté, à compléter**

#### Fonctionnalités implémentées :
- ✅ Ouverture d'une liste de présence (dans projet1 : `AttendanceRegister.jsx`)
- ✅ Gestion des requêtes de permission (`Permissions.jsx`)
- ⚠️ Gestion des cours et programme par classe (structure existe, interface à compléter)

#### Fonctionnalités à compléter :
- ❌ Consulter les programmes de cours pour une classe donnée
- ❌ Envoyer les notifications automatiquement aux parents en cas d'absence
- ❌ Gestion des requêtes des élèves et/ou parents sur la présence d'un cours spécifique
- ❌ Gestion des demandes de permission en cas d'absence imprévue (début fait)
- ❌ Recevoir des notifications d'alerte en cas d'absences successives
- ❌ Marquage de la présence par code QR à scanner
- ❌ Liste numérique avec cases à cocher (existe partiellement)
- ❌ Génération des rapports de présence au format PDF

#### Structure à compléter :
```
frontend/src/projet4/
  ├── admin/
  │   ├── PresenceManager.jsx      # Gestionnaire principal
  │   ├── pages/
  │   │   ├── AttendanceRegister.jsx  # Registre présence (existe dans projet1)
  │   │   ├── CoursesSchedule.jsx     # Gestion cours/programme
  │   │   ├── QRScanner.jsx          # Scanner QR pour présence
  │   │   ├── AttendanceReports.jsx  # Rapports PDF
  │   │   ├── AbsenceAlerts.jsx      # Alertes absences successives
  │   │   └── PermissionRequests.jsx # Demandes permission (existe partiellement)
  │   └── components/
  │       ├── QRCodeGenerator.jsx
  │       ├── AttendanceChart.jsx
  │       └── AbsenceNotification.jsx
  └── parent/
      └── pages/
          ├── Attendance.jsx        # Consultation présence (existe dans projet1)
          └── PermissionRequest.jsx # Demande permission parent
```

#### Backend à créer/compléter :
```
backend/app/Http/Controllers/Api/
  ├── PresenceController.php       # Existe partiellement
  ├── CoursController.php           # Gestion cours/programme
  ├── QRCodeController.php          # Génération/scan QR
  └── AttendanceReportController.php # Rapports PDF
```

---

## 🎯 Priorités de Développement

### Phase 1 : Compléter Projet 2
1. Finaliser l'intégration Mobile Money
2. Compléter l'interface de gestion des frais généraux

### Phase 2 : Développer Projet 3
1. Créer la structure frontend/backend
2. Implémenter la gestion des matières et coefficients
3. Implémenter la saisie et validation des notes
4. Implémenter le calcul de moyennes et délibération
5. Implémenter la génération de bulletins

### Phase 3 : Compléter Projet 4
1. Compléter la gestion des cours et programmes
2. Implémenter le scanner QR
3. Implémenter les notifications automatiques
4. Implémenter la génération de rapports PDF
5. Implémenter les alertes d'absences successives

---

## 🔗 Intégrations Nécessaires

### Entre Projets :
- **Projet 1 ↔ Projet 2** : Les élèves inscrits doivent pouvoir payer leurs frais
- **Projet 1 ↔ Projet 3** : Les élèves doivent être affectés aux classes pour recevoir des notes
- **Projet 1 ↔ Projet 4** : Les élèves doivent être dans des classes pour la présence
- **Projet 3 ↔ Projet 4** : Les absences peuvent affecter les notes (pénalités)
- **Projet 2 ↔ Projet 3** : Les paiements peuvent être requis pour accéder aux bulletins

### Notifications :
- Tous les projets utilisent le système de notifications centralisé
- Les notifications peuvent être envoyées par email, SMS, ou WhatsApp (selon configuration)

---

## 📝 Notes Techniques

### Technologies utilisées :
- **Backend** : Laravel 12 + PHP 8.5
- **Frontend** : React.js + Vite
- **Base de données** : MySQL
- **Styling** : Tailwind CSS
- **Authentification** : Laravel Sanctum

### Structure de routage :
- Projet 1 : `/projet1/*` (admin) et `/projet1-parent/*` (parent)
- Projet 2 : `/admin/finance` (intégré dans App.jsx)
- Projet 3 : À créer `/admin/notes/*`
- Projet 4 : `/admin/vie-scolaire/*` (partiellement intégré)

---

## ✅ Checklist de Validation

### Projet 1
- [x] Inscription en ligne
- [x] Gestion classes
- [x] Cartes scolarité
- [x] Notifications paiement

### Projet 2
- [x] Dashboard financier
- [x] Remboursements
- [ ] Intégration Mobile Money réelle
- [ ] Interface frais généraux

### Projet 3
- [ ] Gestion matières/coefficients
- [ ] Saisie notes
- [ ] Validation notes
- [ ] Calcul moyennes
- [ ] Délibération
- [ ] Bulletins PDF

### Projet 4
- [x] Registre présence basique
- [ ] Scanner QR
- [ ] Notifications automatiques
- [ ] Rapports PDF
- [ ] Alertes absences successives
- [ ] Gestion cours/programme

---

*Dernière mise à jour : Décembre 2025*

