# Plan d'Implémentation - Module d'Inscription et de Gestion Administrative

## 📋 Résumé

Ce document décrit l'implémentation complète du **Module d'Inscription et de Gestion Administrative** pour l'ERP scolaire. Le module est maintenant **totalement fonctionnel** et **indépendant**.

---

## ✅ Fonctionnalités Implémentées

### 1. Gestion de la Structure Académique (Back-office Admin)

#### Contrôleur: `AcademicStructureController`

**Niveaux Scolaires:**
- ✅ `GET /api/admin/academic/niveaux` - Lister tous les niveaux
- ✅ `POST /api/admin/academic/niveaux` - Créer un niveau
- ✅ `PUT /api/admin/academic/niveaux/{id}` - Modifier un niveau
- ✅ `DELETE /api/admin/academic/niveaux/{id}` - Supprimer un niveau (avec vérification des classes associées)

**Cycles:**
- ✅ `GET /api/admin/academic/cycles` - Lister tous les cycles
- ✅ `POST /api/admin/academic/cycles` - Créer un cycle
- ✅ `PUT /api/admin/academic/cycles/{id}` - Modifier un cycle
- ✅ `DELETE /api/admin/academic/cycles/{id}` - Supprimer un cycle

**Séries:**
- ✅ `GET /api/admin/academic/series` - Lister toutes les séries
- ✅ `POST /api/admin/academic/series` - Créer une série
- ✅ `PUT /api/admin/academic/series/{id}` - Modifier une série
- ✅ `DELETE /api/admin/academic/series/{id}` - Supprimer une série

**Années Scolaires:**
- ✅ `GET /api/admin/academic/annees-scolaires` - Lister toutes les années
- ✅ `GET /api/admin/academic/annee-scolaire/active` - Obtenir l'année active
- ✅ `POST /api/admin/academic/annees-scolaires` - Créer une année (désactive automatiquement les autres si marquée active)
- ✅ `PUT /api/admin/academic/annees-scolaires/{id}` - Modifier une année
- ✅ `DELETE /api/admin/academic/annees-scolaires/{id}` - Supprimer une année (avec vérification des inscriptions)

---

### 2. Gestion des Classes

#### Contrôleur: `ClassController` (amélioré)

**Logique métier:**
- ✅ Empêche la suppression d'une classe s'il y a des élèves affectés
- ✅ Gestion de la capacité maximale (`capacity_max`)
- ✅ Compteur automatique d'élèves (`current_students`)

**Routes existantes:**
- `GET /api/classes` - Lister toutes les classes
- `POST /api/classes` - Créer une classe
- `GET /api/classes/{id}` - Détails d'une classe
- `PUT /api/classes/{id}` - Modifier une classe
- `DELETE /api/classes/{id}` - Supprimer une classe (avec vérification)

---

### 3. Gestion des Acteurs (Inscription)

#### Inscription Complète Parent + Élève

**Route:** `POST /api/inscription/complete` (publique)

**Fonctionnalités:**
- ✅ Création simultanée du compte parent (`users` + `parents_tuteurs`)
- ✅ Création du compte élève (`users` + `eleves`)
- ✅ Génération automatique d'un matricule unique (format: `E{année}{4 chiffres}`)
- ✅ Upload de photo de l'élève
- ✅ Upload de documents multiples (PDF, images)
- ✅ Liaison automatique parent-élève (`relations_eleve_tuteur`)
- ✅ Création automatique de l'inscription pour l'année scolaire active
- ✅ Retourne un token d'authentification pour le parent

**Données requises:**
```json
{
  "parent_nom": "string",
  "parent_prenom": "string",
  "parent_email": "email|unique",
  "parent_username": "string|unique",
  "parent_password": "string|min:8|confirmed",
  "parent_telephone": "string",
  "parent_adresse": "string|null",
  "parent_profession": "string|null",
  "eleve_nom": "string",
  "eleve_prenom": "string",
  "eleve_date_naissance": "date",
  "eleve_lieu_naissance": "string|null",
  "eleve_sexe": "M|F",
  "eleve_adresse": "string|null",
  "eleve_serie_id": "integer|null",
  "eleve_photo": "image|max:2048",
  "documents": [
    {
      "type": "string",
      "file": "file|max:5120"
    }
  ]
}
```

#### Gestion des Documents

**Routes:**
- ✅ `GET /api/admin/eleves/{eleveId}/documents` - Lister les documents d'un élève
- ✅ `POST /api/admin/eleves/{eleveId}/documents` - Ajouter un document
- ✅ `GET /api/parent/children/{id}/documents` - Parents peuvent voir les documents de leurs enfants
- ✅ `POST /api/parent/children/{id}/documents` - Parents peuvent ajouter des documents

---

### 4. Processus d'Inscription & Affectation

#### Inscription Administrative

**Contrôleur:** `InscriptionController` (amélioré)

**Routes:**
- ✅ `GET /api/admin/inscriptions` - Lister toutes les inscriptions
- ✅ `GET /api/admin/inscriptions/{id}` - Détails d'une inscription
- ✅ `PATCH /api/admin/inscriptions/{id}/status` - Changer le statut (inscrit/en attente/rejete)

**Statuts:**
- `en attente` - Par défaut lors de la création
- `inscrit` - Inscription validée
- `rejete` - Inscription rejetée

#### Affectation des Élèves aux Classes

**Contrôleur:** `AffectationController` (nouveau)

**Routes:**
- ✅ `GET /api/admin/affectations` - Lister toutes les affectations (avec filtres)
- ✅ `POST /api/admin/affectations` - Affecter un élève à une classe
- ✅ `POST /api/admin/affectations/{id}/transfer` - Transférer un élève vers une autre classe
- ✅ `DELETE /api/admin/affectations/{id}/unassign` - Désaffecter un élève
- ✅ `GET /api/admin/affectations/eleve/{eleveId}` - Historique des affectations d'un élève
- ✅ `GET /api/admin/affectations/classe/{classeId}` - Liste des élèves affectés à une classe

**Logique métier:**
- ✅ Vérification que l'élève est inscrit pour l'année scolaire de la classe
- ✅ Vérification de la capacité maximale de la classe
- ✅ Empêche les doublons (élève déjà affecté à la même classe)
- ✅ Désaffectation automatique de l'ancienne classe lors d'un transfert
- ✅ Mise à jour automatique des compteurs (`current_students`)
- ✅ Historique complet des affectations dans `affectations_classes`

**Table:** `affectations_classes`
- `eleve_id` - ID de l'élève
- `classe_id` - ID de la classe
- `date_affectation` - Date d'affectation
- `statut` - `affecte`, `desaffecte`, `transfere`
- `commentaire` - Commentaire optionnel

---

### 5. Génération de Documents (PDF)

#### Fiche d'Inscription

**Contrôleur:** `PdfController` (amélioré)

**Routes:**
- ✅ `GET /api/admin/pdf/fiche-inscription/{inscriptionId}` - Télécharger la fiche PDF
- ✅ `GET /api/admin/pdf/fiche-inscription/{inscriptionId}/preview` - Prévisualiser la fiche

**Contenu de la fiche:**
- Informations complètes de l'élève (nom, prénom, date de naissance, matricule, etc.)
- Photo de l'élève (si disponible)
- Informations des parents/tuteurs
- Liste des documents joints
- Statut de l'inscription
- Année scolaire

**Vue:** `resources/views/pdf/fiche_inscription.blade.php`

#### Carte de Scolarité

**Routes:**
- ✅ `GET /api/admin/pdf/carte-scolarite/{eleveId}` - Télécharger la carte PDF
- ✅ `GET /api/admin/pdf/carte-scolarite/{eleveId}/preview` - Prévisualiser la carte

**Contenu de la carte:**
- Photo de l'élève
- Nom et prénom
- Matricule
- Classe
- Année scolaire
- **QR Code** contenant le matricule (généré via API externe)
- Format carte d'identité (85.6mm x 53.98mm)

**Vue:** `resources/views/pdf/carte_scolarite.blade.php`

**Table:** `cartes_scolarite`
- Enregistrement automatique lors de la génération
- Stockage du code-barre (matricule)
- Date de génération
- Statut (active/inactive)

---

### 6. Module de Communication

#### Notifications aux Parents

**Contrôleur:** `Api\NotificationController` (amélioré)

**Routes:**
- ✅ `GET /api/admin/notifications` - Lister toutes les notifications (admin)
- ✅ `GET /api/admin/notifications/templates` - Lister les templates disponibles
- ✅ `POST /api/admin/notifications/payment-reminder` - Envoyer un rappel de paiement
- ✅ `POST /api/admin/notifications/urgent` - Envoyer une notification urgente
- ✅ `POST /api/admin/notifications/general` - Envoyer une notification générale
- ✅ `POST /api/admin/notifications/class` - **Envoyer à tous les parents d'une classe**
- ✅ `GET /api/admin/notifications/{id}` - Détails d'une notification
- ✅ `POST /api/admin/notifications/{id}/retry` - Relancer une notification échouée
- ✅ `GET /api/parent/notifications` - Notifications du parent connecté

**Types de notifications:**
1. **Rappel de paiement** (`payment_reminder`)
   - Montant dû
   - Date d'échéance
   - Tranche concernée
   - Nom de l'élève

2. **Information urgente** (`urgent_info`)
   - Sujet personnalisé
   - Message personnalisé
   - Envoi immédiat

3. **Notification générale** (`general`)
   - Sujet personnalisé
   - Message personnalisé
   - Peut être programmée

**Canaux:**
- ✅ Email (via SMTP - configuré dans `.env`)
- ✅ Préparation pour SMS/WhatsApp (structure en place)

**Service:** `NotificationService`
- Gestion des templates
- Queue pour envoi asynchrone
- Logs d'envoi
- Statistiques (ouvert, cliqué, etc.)

---

## 🗄️ Modifications de la Base de Données

### Nouvelles Tables

1. **`affectations_classes`** (Migration: `0006_affectations_classes.php`)
   - Historique des affectations élèves-classes
   - Statuts: `affecte`, `desaffecte`, `transfere`

2. **`school_configurations`** (Migration: `0007_school_configuration.php`)
   - Configuration de l'école (nom, logo, adresse, etc.)
   - Pour utilisation dans les PDFs

### Tables Existantes Utilisées

- ✅ `users` - Comptes utilisateurs
- ✅ `parents_tuteurs` - Profils parents
- ✅ `eleves` - Profils élèves
- ✅ `relations_eleve_tuteur` - Liaison parent-élève
- ✅ `inscriptions` - Inscriptions administratives
- ✅ `classes` - Classes
- ✅ `niveaux_scolaires` - Niveaux
- ✅ `cycles` - Cycles
- ✅ `series` - Séries
- ✅ `annee_scolaires` - Années scolaires
- ✅ `documents_eleves` - Documents joints
- ✅ `cartes_scolarite` - Cartes générées
- ✅ `notifications` - Notifications envoyées

---

## 📁 Fichiers Créés/Modifiés

### Contrôleurs
- ✅ `app/Http/Controllers/AcademicStructureController.php` (nouveau)
- ✅ `app/Http/Controllers/AffectationController.php` (nouveau)
- ✅ `app/Http/Controllers/InscriptionController.php` (amélioré)
- ✅ `app/Http/Controllers/PdfController.php` (amélioré)
- ✅ `app/Http/Controllers/Api/NotificationController.php` (amélioré)

### Modèles
- ✅ `app/Models/AffectationClasse.php` (nouveau)
- ✅ `app/Models/DocumentEleve.php` (nouveau)
- ✅ `app/Models/SchoolConfiguration.php` (nouveau)
- ✅ `app/Models/Cycle.php` (amélioré - ajout relation)
- ✅ `app/Models/CarteScolarite.php` (amélioré - structure corrigée)
- ✅ `app/Models/Eleve.php` (amélioré - ajout relation documents)

### Migrations
- ✅ `database/migrations/0006_affectations_classes.php` (nouveau)
- ✅ `database/migrations/0007_school_configuration.php` (nouveau)

### Vues
- ✅ `resources/views/pdf/fiche_inscription.blade.php` (amélioré)
- ✅ `resources/views/pdf/carte_scolarite.blade.php` (nouveau)

### Routes
- ✅ `routes/api.php` (mise à jour complète)

---

## 🚀 Installation et Utilisation

### 1. Exécuter les Migrations

```bash
cd backend
php artisan migrate
```

### 2. Configuration Email (pour les notifications)

Dans `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@ecole.local
MAIL_FROM_NAME="École Primaire"
```

### 3. Créer les Dossiers de Stockage

```bash
mkdir -p storage/app/public/eleves/photos
mkdir -p storage/app/public/eleves/documents
php artisan storage:link
```

### 4. Configuration de l'École

Utiliser l'interface admin ou directement en base de données pour configurer:
- Nom de l'école
- Logo
- Adresse
- Coordonnées

---

## 📝 Exemples d'Utilisation API

### Inscription Complète

```bash
POST /api/inscription/complete
Content-Type: multipart/form-data

{
  "parent_nom": "Dupont",
  "parent_prenom": "Jean",
  "parent_email": "jean.dupont@example.com",
  "parent_username": "jdupont",
  "parent_password": "password123",
  "parent_password_confirmation": "password123",
  "parent_telephone": "+33123456789",
  "eleve_nom": "Martin",
  "eleve_prenom": "Sophie",
  "eleve_date_naissance": "2015-05-15",
  "eleve_sexe": "F",
  "eleve_photo": [fichier image],
  "documents": [
    {
      "type": "acte_naissance",
      "file": [fichier PDF]
    }
  ]
}
```

### Affecter un Élève à une Classe

```bash
POST /api/admin/affectations
Authorization: Bearer {token}

{
  "eleve_id": 1,
  "classe_id": 5,
  "commentaire": "Affectation initiale"
}
```

### Envoyer une Notification à une Classe

```bash
POST /api/admin/notifications/class
Authorization: Bearer {token}

{
  "classe_id": 5,
  "subject": "Réunion parents-professeurs",
  "body": "Une réunion est prévue le 15/01/2025 à 18h.",
  "type": "urgent_info"
}
```

### Générer une Carte de Scolarité

```bash
GET /api/admin/pdf/carte-scolarite/1
Authorization: Bearer {token}
```

---

## 🔒 Sécurité et Permissions

- ✅ Toutes les routes admin nécessitent l'authentification (`auth:sanctum`)
- ✅ Vérification des rôles (`ADMIN`, `RESPONSABLE`)
- ✅ Les parents ne peuvent accéder qu'aux données de leurs enfants
- ✅ Validation stricte des données d'entrée
- ✅ Transactions DB pour garantir l'intégrité

---

## 📊 Statuts et Workflow

### Workflow d'Inscription

1. **Inscription en ligne** → Statut: `en attente`
2. **Validation admin** → Statut: `inscrit`
3. **Affectation à une classe** → Élève assigné
4. **Génération des documents** → Fiche + Carte

### Statuts d'Affectation

- `affecte` - Élève actuellement dans la classe
- `desaffecte` - Élève retiré de la classe
- `transfere` - Élève transféré vers une autre classe

---

## 🎯 Points d'Attention

1. **Capacité des Classes**: Vérifiée automatiquement avant chaque affectation
2. **Matricules**: Générés automatiquement, format unique
3. **Documents**: Stockés dans `storage/app/public/eleves/`
4. **QR Codes**: Générés via API externe (peut être remplacé par une bibliothèque locale)
5. **Notifications**: Envoi asynchrone via queue (nécessite `php artisan queue:work`)

---

## 🔄 Prochaines Étapes (Optionnelles)

- [ ] Intégration SMS/WhatsApp pour les notifications
- [ ] Système de paiement en ligne intégré
- [ ] Export Excel des listes d'inscription
- [ ] Tableau de bord statistiques
- [ ] API de recherche avancée

---

## ✅ Conclusion

Le module est **complet et fonctionnel**. Toutes les fonctionnalités demandées ont été implémentées:
- ✅ Gestion de la structure académique
- ✅ Inscription complète Parent+Élève
- ✅ Affectation avec vérification de capacité
- ✅ Génération de PDFs (fiche + carte avec QR)
- ✅ Système de notifications aux parents
- ✅ Gestion des documents

Le code suit les standards Laravel et est prêt pour la production.

