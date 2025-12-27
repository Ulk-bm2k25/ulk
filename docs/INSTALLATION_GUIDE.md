# Guide d'Installation - School-HUB

## 🚀 Installation Rapide

### Prérequis
- PHP 8.5+ avec extensions : pdo_mysql, mbstring, xml, gd, dom
- Composer
- Node.js 18+ et npm
- MySQL 8.0+
- XAMPP/WAMP (optionnel, pour MySQL)

---

## 📦 Installation Backend (Laravel)

### 1. Installer les dépendances
```bash
cd backend
composer install
```

### 2. Configuration de l'environnement
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Configurer la base de données
Éditer `.env` :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=school_hub
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Exécuter les migrations
```bash
php artisan migrate
```

### 5. Installer le package PDF (optionnel)
```bash
composer require barryvdh/laravel-dompdf
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
```

### 6. Démarrer le serveur
```bash
php artisan serve
```
Le backend sera accessible sur `http://localhost:8000`

---

## ⚛️ Installation Frontend (React)

### 1. Installer les dépendances
```bash
cd frontend
npm install
```

### 2. Installer le scanner QR (optionnel, pour Projet 4)
```bash
npm install html5-qrcode
```

### 3. Configurer l'URL de l'API
Éditer `frontend/src/api.js` :
```javascript
const api = axios.create({
  baseURL: "http://localhost:8000/api/", // Ajuster selon votre configuration
  // ...
});
```

### 4. Démarrer le serveur de développement
```bash
npm run dev
```
Le frontend sera accessible sur `http://localhost:5173` (ou autre port selon Vite)

---

## 🗄️ Configuration de la Base de Données

### Créer la base de données
```sql
CREATE DATABASE school_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Importer les données (si vous avez un export SQL)
```bash
mysql -u root -p school_hub < backend/export.sql
```

---

## 🔐 Configuration de l'Authentification

### Créer un utilisateur admin (via Tinker)
```bash
php artisan tinker
```
```php
$user = \App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@school.com',
    'password' => bcrypt('password'),
]);
$user->createToken('admin-token')->plainTextToken;
```

---

## 🧪 Test de l'Installation

### 1. Tester le backend
```bash
curl http://localhost:8000/api/test
```
Devrait retourner :
```json
{
  "status": "success",
  "message": "API Laravel fonctionne correctement !"
}
```

### 2. Tester le frontend
Ouvrir `http://localhost:5173` dans le navigateur

### 3. Tester l'authentification
- Aller sur `/login`
- Se connecter avec les identifiants créés
- Vérifier que le token est stocké dans localStorage

---

## 🐛 Résolution de Problèmes

### Erreur CORS
Si vous avez des erreurs CORS, vérifier `backend/config/cors.php` :
```php
'allowed_origins' => ['http://localhost:5173'],
```

### Erreur de connexion à la base de données
- Vérifier que MySQL est démarré
- Vérifier les credentials dans `.env`
- Vérifier que la base de données existe

### Erreur "Class not found"
```bash
composer dump-autoload
php artisan config:clear
php artisan cache:clear
```

### Erreur de migration
```bash
php artisan migrate:fresh
# ⚠️ Attention : cela supprime toutes les données
```

---

## 📚 Structure des Routes

### Backend API
- `/api/test` - Test de l'API
- `/api/classes` - Gestion des classes
- `/api/eleves` - Gestion des élèves
- `/api/matieres` - Gestion des matières (Projet 3)
- `/api/semestres` - Gestion des semestres (Projet 3)
- `/api/notes` - Gestion des notes (Projet 3)
- `/api/presence` - Gestion de présence (Projet 4)
- `/api/cours` - Programme des cours (Projet 4)
- `/api/presence/reports` - Rapports de présence (Projet 4)

### Frontend
- `/` - Page d'accueil
- `/login` - Connexion
- `/admin` - Dashboard admin
- `/admin/notes/*` - Module gestion des notes (Projet 3)
- `/admin/vie-scolaire/*` - Module vie scolaire (Projet 4)
- `/admin/finance` - Module financier (Projet 2)
- `/projet1/*` - Module inscription (Projet 1)

---

## 🔄 Mise à Jour

### Backend
```bash
cd backend
composer update
php artisan migrate
```

### Frontend
```bash
cd frontend
npm update
```

---

## 📝 Notes

1. **Port Backend** : Par défaut Laravel utilise le port 8000. Si occupé, utiliser `php artisan serve --port=8001`
2. **Port Frontend** : Vite utilise généralement le port 5173. Vérifier dans la console au démarrage
3. **HTTPS** : Pour la production, configurer HTTPS et mettre à jour les URLs dans `.env` et `api.js`

---

*Guide créé le : Décembre 2025*

