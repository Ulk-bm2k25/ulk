# 🚀 Guide de Lancement - School HUB ERP

Ce guide vous permettra de lancer l'application School HUB de manière propre et fonctionnelle.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **PHP** >= 8.2
- **Composer** (gestionnaire de dépendances PHP)
- **Node.js** >= 18.x et **npm**
- **SQLite** (généralement inclus avec PHP)

---

## 🔧 Installation

### Étape 1 : Installation des dépendances Backend

```bash
cd backend
composer install
```

### Étape 2 : Configuration de l'environnement

Créez le fichier `.env` à partir de `.env.example` si nécessaire :

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Générez la clé d'application Laravel :

```bash
php artisan key:generate
```

### Étape 3 : Configuration de la base de données

La base de données SQLite est déjà configurée par défaut. Assurez-vous que le fichier existe :

```bash
# Vérifier que le fichier existe
ls database/database.sqlite

# Si le fichier n'existe pas, créez-le :
touch database/database.sqlite
```

### Étape 4 : Exécuter les migrations

Créez les tables de la base de données :

```bash
php artisan migrate
```

### Étape 5 : Peupler la base de données avec les données par défaut

```bash
php artisan db:seed
```

Cette commande va créer :
- ✅ Une année scolaire active (2025-2026)
- ✅ Des niveaux scolaires (Maternelle, Primaire, Collège, Lycée)
- ✅ Des classes d'exemple
- ✅ **Un compte administrateur** (voir identifiants ci-dessous)
- ✅ **Un compte parent** (voir identifiants ci-dessous)
- ✅ Des types de frais de scolarité

### Étape 6 : Créer le lien symbolique pour le stockage

```bash
php artisan storage:link
```

Cela permet d'accéder aux fichiers uploadés (photos, documents) via l'URL publique.

### Étape 7 : Installation des dépendances Frontend

```bash
cd ../frontend
npm install
```

---

## 🔑 Identifiants par Défaut

### 👨‍💼 Compte Administrateur

- **Email** : `admin@schoolhub.local`
- **Mot de passe** : `admin123`
- **Rôle** : ADMIN
- **Accès** : Interface d'administration complète

### 👨‍👩‍👧 Compte Parent

- **Email** : `parent@schoolhub.local`
- **Mot de passe** : `parent123`
- **Rôle** : PARENT
- **Accès** : Espace parent (suivi des enfants, paiements, notifications)

---

## 🚀 Lancement de l'Application

### Terminal 1 : Backend Laravel

```bash
cd backend
php artisan serve
```

Le serveur backend sera accessible sur : **http://localhost:8000**

### Terminal 2 : Frontend React

```bash
cd frontend
npm run dev
```

Le serveur frontend sera accessible sur : **http://localhost:5173** (ou un autre port si 5173 est occupé)

---

## 📱 Accès à l'Application

### Interface Web

1. Ouvrez votre navigateur
2. Accédez à : **http://localhost:5173**
3. Vous verrez la page d'accueil avec deux options :
   - **Espace Parent** : Pour se connecter en tant que parent
   - **Espace Admin** : Pour se connecter en tant qu'administrateur

### API Backend

L'API REST est accessible sur : **http://localhost:8000/api**

Documentation des routes disponible dans : `backend/Documentation des Routes API.md`

---

## 🧪 Test de l'Application

### Test de Connexion Admin

1. Cliquez sur **"Espace Admin"**
2. Connectez-vous avec :
   - Email : `admin@schoolhub.local`
   - Mot de passe : `admin123`
3. Vous devriez accéder au tableau de bord administrateur

### Test de Connexion Parent

1. Cliquez sur **"Espace Parent"**
2. Connectez-vous avec :
   - Email : `parent@schoolhub.local`
   - Mot de passe : `parent123`
3. Vous devriez accéder à l'espace parent

---

## 🔄 Réinitialisation de la Base de Données

Si vous souhaitez réinitialiser complètement la base de données :

```bash
cd backend
php artisan migrate:fresh --seed
```

⚠️ **Attention** : Cette commande supprime toutes les données existantes et recrée les tables avec les données par défaut.

---

## 🛠️ Dépannage

### Problème : "SQLSTATE[HY000] [14] unable to open database file"

**Solution** : Vérifiez les permissions du fichier `database/database.sqlite`

```bash
# Linux/Mac
chmod 664 database/database.sqlite
chmod 775 database/

# Windows : Vérifiez que le fichier n'est pas en lecture seule
```

### Problème : "Class not found" ou erreurs de namespace

**Solution** : Régénérez l'autoloader Composer

```bash
cd backend
composer dump-autoload
```

### Problème : Frontend ne se connecte pas au backend

**Solution** : Vérifiez que :
1. Le backend est bien lancé sur le port 8000
2. Le fichier `frontend/src/api.js` contient bien `baseURL: "http://localhost:8000/api/"`
3. Il n'y a pas d'erreurs CORS (vérifiez `backend/config/cors.php`)

### Problème : Erreur 500 sur les routes API

**Solution** : Vérifiez les logs Laravel

```bash
cd backend
tail -f storage/logs/laravel.log
```

---

## 📁 Structure du Projet

```
School-HUB/
├── backend/                 # Application Laravel (API)
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── database.sqlite
│   ├── routes/
│   │   └── api.php
│   └── .env
│
└── frontend/                # Application React
    ├── src/
    │   ├── api.js           # Configuration API
    │   ├── projet1/
    │   │   ├── admin/       # Interface Admin
    │   │   └── parent/      # Interface Parent
    └── package.json
```

---

## 🔐 Sécurité

⚠️ **Important pour la production** :

1. Changez les mots de passe par défaut
2. Configurez un vrai serveur SMTP pour les emails
3. Activez HTTPS
4. Configurez les variables d'environnement de production
5. Désactivez le mode debug : `APP_DEBUG=false` dans `.env`

---

## 📞 Support

Pour toute question ou problème, consultez :
- `RAPPORT_TRAVAIL.md` : Documentation technique complète
- `backend/PLAN_IMPLEMENTATION_MODULE_INSCRIPTION.md` : Documentation du module d'inscription
- Les logs Laravel : `backend/storage/logs/laravel.log`

---

**Bon développement ! 🎉**

