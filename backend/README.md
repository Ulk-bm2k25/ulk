# 🎓 Système de Gestion Scolaire - Module Authentification & Sécurité

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-blue.svg)](https://php.net)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> Module d'authentification et de sécurité pour la plateforme de gestion des établissements scolaires (Projet 1 - Groupe 1)

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [Documentation](#documentation)
- [Contribution](#contribution)

---

## 🎯 À propos

Ce module fait partie du **Projet 1 : Module d'Inscription et de Réinscription** dans le cadre du cours d'Aspects Avancés des Technologies. Il gère toute la partie authentification et sécurité backend du système de gestion scolaire.

### Équipe Backend - Authentification & Sécurité
- **Développeur** : [Votre Nom]
- **Groupe** : Groupe 1
- **Module** : Authentification et Sécurité (Backend)

---

## ✨ Fonctionnalités

### ✅ Authentification
- 📝 Inscription parent/tuteur avec validation complète
- 🔐 Connexion sécurisée (email + mot de passe)
- 🚪 Déconnexion (simple et tous les appareils)
- 👤 Gestion de profil utilisateur
- 🔄 Refresh token automatique

### 🔒 Sécurité
- ✉️ Vérification d'email obligatoire
- 🔑 Réinitialisation de mot de passe sécurisée
- 🛡️ Authentification à deux facteurs (2FA) optionnelle
- 📱 Codes de récupération 2FA
- 🔐 Hachage de mot de passe (bcrypt)
- 🎫 Tokens API (Laravel Sanctum)

### 👥 Gestion des rôles
- 👪 Parents/Tuteurs
- 🏫 Administrateurs
- 📊 Système de permissions

### 📝 Logging & Audit
- 📋 Journal d'activité complet
- 🔍 Traçabilité des actions utilisateurs
- ⚠️ Alertes de sécurité

---

## 🛠️ Technologies

### Backend
- **Framework** : Laravel 12.x
- **Base de données** : SQLite (dev) / MySQL (prod)
- **Authentification** : Laravel Sanctum
- **2FA** : PragmaRX Google2FA
- **PHP** : 8.2+

### Packages principaux
```json
{
  "laravel/framework": "^12.0",
  "laravel/sanctum": "^4.0",
  "pragmarx/google2fa-laravel": "^2.0"
}
```

---

## 🚀 Installation

### Prérequis
- PHP >= 8.2
- Composer
- SQLite / MySQL
- Node.js (pour assets si nécessaire)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-organisation/gestion-scolaire-auth.git
cd gestion-scolaire-auth
```

2. **Installer les dépendances**
```bash
composer install
```

3. **Copier le fichier d'environnement**
```bash
cp .env.example .env
```

4. **Générer la clé d'application**
```bash
php artisan key:generate
```

5. **Configurer la base de données**

Éditez le fichier `.env` :
```env
DB_CONNECTION=sqlite
DB_DATABASE=/chemin/absolu/vers/database.sqlite
```

Ou pour MySQL :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_scolaire
DB_USERNAME=root
DB_PASSWORD=
```

6. **Créer la base de données**
```bash
# Pour SQLite
touch database/database.sqlite

# Pour MySQL, créez la base via phpMyAdmin ou :
mysql -u root -p -e "CREATE DATABASE gestion_scolaire;"
```

7. **Exécuter les migrations**
```bash
php artisan migrate
```

8. **Lancer le serveur**
```bash
php artisan serve
```

L'API sera accessible sur : `http://localhost:8000`

---

## ⚙️ Configuration

### Configuration email (.env)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre_email@gmail.com
MAIL_PASSWORD=votre_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@gestion-scolaire.com
MAIL_FROM_NAME="${APP_NAME}"
```

### URL Frontend (.env)

```env
FRONTEND_URL=http://localhost:3000
```

### Configuration Sanctum

Les tokens expirent après 24 heures par défaut. Pour modifier :

```php
// config/sanctum.php
'expiration' => 60 * 24, // en minutes
```

---

## 📖 Utilisation

### API Endpoints

#### Routes publiques

```http
POST /api/auth/register/parent    # Inscription parent
POST /api/auth/login               # Connexion
POST /api/auth/forgot-password     # Mot de passe oublié
POST /api/auth/reset-password      # Réinitialiser mot de passe
```

#### Routes protégées (nécessitent un token)

```http
GET  /api/auth/me                  # Info utilisateur
POST /api/auth/logout              # Déconnexion
POST /api/auth/logout-all          # Déconnexion tous appareils
POST /api/email/verification-notification  # Renvoyer email vérification
GET  /api/email/verification-status        # Statut vérification
```

#### Routes 2FA

```http
POST /api/2fa/enable               # Activer 2FA
POST /api/2fa/confirm              # Confirmer 2FA
POST /api/2fa/verify               # Vérifier code 2FA
POST /api/2fa/disable              # Désactiver 2FA
GET  /api/2fa/recovery-codes       # Obtenir codes de récupération
```

### Exemple d'utilisation (cURL)

**Inscription :**
```bash
curl -X POST http://localhost:8000/api/auth/register/parent \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "password": "Test@123456",
    "password_confirmation": "Test@123456",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "+22997123456"
  }'
```

**Connexion :**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "Test@123456"
  }'
```

**Requête authentifiée :**
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -H "Accept: application/json"
```

---

## 🧪 Tests

### Lancer tous les tests

```bash
php artisan test
```

### Lancer des tests spécifiques

```bash
# Tests d'authentification uniquement
php artisan test --filter AuthenticationTest

# Test spécifique
php artisan test --filter test_parent_can_register_successfully
```

### Tests avec couverture

```bash
php artisan test --coverage
```

### Tests disponibles

- ✅ **AuthenticationTest** : Inscription, connexion, déconnexion
- ✅ **PasswordResetTest** : Réinitialisation de mot de passe
- ✅ Tests de validation
- ✅ Tests de sécurité

---

## 📚 Documentation

### Documentation disponible

1. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentation complète de l'API
   - Tous les endpoints
   - Formats de requête/réponse
   - Codes d'erreur
   - Exemples

2. **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - Guide d'intégration frontend
   - Configuration Axios
   - Exemples React/Vue
   - Gestion des tokens
   - Bonnes pratiques

3. **[POSTMAN_COLLECTION.json](./POSTMAN_COLLECTION.json)** - Collection Postman
   - Toutes les requêtes prêtes à l'emploi
   - Variables d'environnement
   - Tests automatiques

### Structure du projet

```
gestion-scolaire-auth/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── PasswordResetController.php
│   │   │       ├── EmailVerificationController.php
│   │   │       └── TwoFactorAuthController.php
│   │   └── Middleware/
│   │       ├── CheckRole.php
│   │       ├── EnsureEmailIsVerified.php
│   │       └── CheckTwoFactorAuth.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── ParentTuteur.php
│   │   ├── Responsable.php
│   │   └── Enseignant.php
│   └── Notifications/
│       ├── ResetPasswordNotification.php
│       └── VerifyEmailNotification.php
├── database/
│   ├── migrations/
│   └── factories/
├── routes/
│   └── api.php
├── tests/
│   └── Feature/
│       ├── AuthenticationTest.php
│       └── PasswordResetTest.php
├── .env.example
├── API_DOCUMENTATION.md
├── FRONTEND_INTEGRATION.md
└── README.md
```

---

## 🤝 Contribution

### Intégration avec les autres modules

Ce module s'intègre avec :
- **Module 2** : Gestion des paiements
- **Module 3** : Gestion académique
- **Module 4** : Communication et notifications

### Workflow Git

```bash
# Créer une branche pour une nouvelle fonctionnalité
git checkout -b feature/nom-fonctionnalite

# Faire vos modifications et commits
git add .
git commit -m "Description de la modification"

# Pousser la branche
git push origin feature/nom-fonctionnalite

# Créer une Pull Request sur GitHub
```

### Standards de code

- Suivre les conventions PSR-12
- Commenter les fonctions complexes
- Écrire des tests pour les nouvelles fonctionnalités
- Respecter l'architecture MVC de Laravel

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 Contact & Support

### Équipe Backend
- **Email** : [votre-email@example.com]
- **Slack** : #backend-auth

### Ressources
- 📖 [Documentation Laravel](https://laravel.com/docs)
- 🔐 [Documentation Sanctum](https://laravel.com/docs/sanctum)
- 🎯 [Cahier des charges](./cahier_charges_projet1.pdf)

---

## 🏆 Statut du projet

- [x] Phase 1 : Configuration initiale ✅
- [x] Phase 2 : Modèles et Migrations ✅
- [x] Phase 3 : Controllers d'authentification ✅
- [x] Phase 4 : Sécurité avancée ✅
- [x] Phase 5 : Tests et Documentation ✅
- [ ] Phase 6 : Intégration avec modules 2, 3, 4 🚧

---

**Développé avec ❤️ par le Groupe 1 - Module Authentification & Sécurité**

*Version 1.0.0 - Décembre 2025*