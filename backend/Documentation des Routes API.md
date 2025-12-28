# 📚 Documentation API - Module Authentification & Sécurité

## 🌐 Configuration de base

**Base URL**: `http://localhost:8000/api`

**Headers requis pour les routes protégées**:
```json
{
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

---

## 🔓 Routes Publiques (Sans authentification)

### 1. Inscription Parent/Tuteur

**Endpoint**: `POST /api/auth/register/parent`

**Description**: Créer un compte parent/tuteur

**Body**:
```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "password": "MonP@ss123!",
  "password_confirmation": "MonP@ss123!",
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+22997123456",
  "adresse": "Akpakpa, Cotonou",
  "profession": "Ingénieur"
}
```

**Réponse Succès** (201):
```json
{
  "success": true,
  "message": "Inscription réussie. Veuillez vérifier votre email.",
  "data": {
    "user": {
      "id": 1,
      "name": "Jean Dupont",
      "email": "jean.dupont@example.com",
      "role": "parent",
      "email_verified": false
    },
    "profile": {
      "id": 1,
      "user_id": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "telephone": "+22997123456",
      "email": "jean.dupont@example.com",
      "adresse": "Akpakpa, Cotonou",
      "profession": "Ingénieur"
    },
    "token": "1|abcdef123456...",
    "token_type": "Bearer"
  }
}
```

**Règles de validation**:
- `name`: requis, max 255 caractères
- `email`: requis, format email valide, unique
- `password`: requis, min 8 caractères, doit contenir majuscule, minuscule, chiffre et caractère spécial
- `nom`, `prenom`: requis, max 255 caractères
- `telephone`: requis, max 20 caractères

---

### 2. Connexion

**Endpoint**: `POST /api/auth/login`

**Description**: Se connecter avec email et mot de passe

**Body**:
```json
{
  "email": "jean.dupont@example.com",
  "password": "MonP@ss123!",
  "device_name": "iPhone 13" // optionnel
}
```

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "name": "Jean Dupont",
      "email": "jean.dupont@example.com",
      "role": "parent",
      "email_verified": true
    },
    "profile": {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "telephone": "+22997123456"
    },
    "token": "2|xyz789abc...",
    "token_type": "Bearer"
  }
}
```

**Erreur - Email non vérifié** (403):
```json
{
  "success": false,
  "message": "Veuillez vérifier votre email avant de vous connecter",
  "email_verified": false
}
```

**Erreur - Identifiants incorrects** (401):
```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

---

### 3. Mot de passe oublié

**Endpoint**: `POST /api/auth/forgot-password`

**Description**: Envoyer un lien de réinitialisation par email

**Body**:
```json
{
  "email": "jean.dupont@example.com"
}
```

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Un email de réinitialisation a été envoyé"
}
```

---

### 4. Réinitialiser le mot de passe

**Endpoint**: `POST /api/auth/reset-password`

**Description**: Réinitialiser le mot de passe avec le token reçu par email

**Body**:
```json
{
  "token": "abcd1234...",
  "email": "jean.dupont@example.com",
  "password": "NewP@ss456!",
  "password_confirmation": "NewP@ss456!"
}
```

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Mot de passe réinitialisé avec succès"
}
```

---

### 5. Vérifier le token de réinitialisation

**Endpoint**: `POST /api/auth/verify-reset-token`

**Description**: Vérifier la validité d'un token de reset avant de réinitialiser

**Body**:
```json
{
  "token": "abcd1234...",
  "email": "jean.dupont@example.com"
}
```

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Token valide",
  "valid": true
}
```

---

## 🔐 Routes Protégées (Authentification requise)

### 6. Déconnexion

**Endpoint**: `POST /api/auth/logout`

**Headers**: `Authorization: Bearer {token}`

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

### 7. Déconnexion de tous les appareils

**Endpoint**: `POST /api/auth/logout-all`

**Headers**: `Authorization: Bearer {token}`

**Description**: Révoque tous les tokens d'accès de l'utilisateur

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Déconnexion de tous les appareils réussie"
}
```

---

### 8. Informations utilisateur connecté

**Endpoint**: `GET /api/auth/me`

**Headers**: `Authorization: Bearer {token}`

**Réponse Succès** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Jean Dupont",
      "email": "jean.dupont@example.com",
      "role": "parent",
      "email_verified": true,
      "created_at": "2025-12-19T10:30:00.000000Z"
    },
    "profile": {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "telephone": "+22997123456",
      "adresse": "Akpakpa, Cotonou",
      "profession": "Ingénieur"
    }
  }
}
```

---

### 9. Renvoyer l'email de vérification

**Endpoint**: `POST /api/email/verification-notification`

**Headers**: `Authorization: Bearer {token}`

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Email de vérification envoyé"
}
```

---

### 10. Statut de vérification de l'email

**Endpoint**: `GET /api/email/verification-status`

**Headers**: `Authorization: Bearer {token}`

**Réponse Succès** (200):
```json
{
  "success": true,
  "email_verified": true,
  "email_verified_at": "2025-12-19T10:35:00.000000Z"
}
```

---

### 11. Obtenir le profil

**Endpoint**: `GET /api/profile`

**Headers**: `Authorization: Bearer {token}`

**Réponse Succès** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Jean Dupont",
      "email": "jean.dupont@example.com",
      "role": "parent"
    },
    "profile": {
      "nom": "Dupont",
      "prenom": "Jean",
      "telephone": "+22997123456",
      "adresse": "Akpakpa, Cotonou",
      "profession": "Ingénieur"
    }
  }
}
```

---

### 12. Mettre à jour le profil

**Endpoint**: `PUT /api/profile`

**Headers**: `Authorization: Bearer {token}`

**Body** (tous les champs sont optionnels):
```json
{
  "name": "Jean-Claude Dupont",
  "telephone": "+22997654321",
  "adresse": "Nouvelle adresse",
  "profession": "Directeur"
}
```

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "data": {
    "user": {...},
    "profile": {...}
  }
}
```

---

### 13. Changer le mot de passe

**Endpoint**: `POST /api/profile/change-password`

**Headers**: `Authorization: Bearer {token}`

**Body**:
```json
{
  "current_password": "MonP@ss123!",
  "new_password": "NewP@ss456!",
  "new_password_confirmation": "NewP@ss456!"
}
```

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Mot de passe modifié avec succès"
}
```

---

### 14. Sessions actives

**Endpoint**: `GET /api/sessions`

**Headers**: `Authorization: Bearer {token}`

**Réponse Succès** (200):
```json
{
  "success": true,
  "data": {
    "current_token": {
      "id": 5,
      "name": "iPhone 13",
      "last_used_at": "2025-12-19T15:30:00.000000Z",
      "is_current": true
    },
    "other_sessions": [
      {
        "id": 3,
        "name": "Chrome on Windows",
        "last_used_at": "2025-12-18T10:20:00.000000Z",
        "is_current": false
      }
    ]
  }
}
```

---

### 15. Révoquer une session

**Endpoint**: `DELETE /api/sessions/{tokenId}`

**Headers**: `Authorization: Bearer {token}`

**Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Session révoquée avec succès"
}
```

---

## 🛡️ Routes Admin (Rôle admin requis)

### 16. Créer un administrateur

**Endpoint**: `POST /api/admin/register`

**Headers**: `Authorization: Bearer {admin_token}`

**Body**:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminP@ss123!",
  "password_confirmation": "AdminP@ss123!",
  "fonction": "Administrateur"
}
```

**Valeurs possibles pour `fonction`**:
- `Administrateur`
- `Directeur`
- `Super Administrateur`

**Réponse Succès** (201):
```json
{
  "success": true,
  "message": "Administrateur créé avec succès",
  "data": {
    "user": {
      "id": 10,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "email_verified": true
    },
    "profile": {
      "id": 2,
      "user_id": 10,
      "fonction": "Administrateur"
    }
  }
}
```

---

### 17. Liste des logs d'activité

**Endpoint**: `GET /api/logs`

**Headers**: `Authorization: Bearer {admin_token}`

**Query Parameters**:
- `page`: numéro de page (défaut: 1)
- `per_page`: nombre par page (défaut: 20)
- `action`: filtrer par type d'action
- `user_id`: filtrer par utilisateur

**Exemple**: `/api/logs?page=1&per_page=50&action=login`

**Réponse Succès** (200):
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "user_id": 1,
        "user_name": "Jean Dupont",
        "action": "login",
        "details": "Connexion réussie",
        "timestamp": "2025-12-19T15:30:00.000000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 100,
      "per_page": 20
    }
  }
}
```

---

## ⚠️ Codes d'erreur standard

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 400 | Bad Request | Requête mal formée |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Accès interdit (email non vérifié, rôle insuffisant) |
| 404 | Not Found | Ressource non trouvée |
| 422 | Unprocessable Entity | Erreur de validation |
| 500 | Internal Server Error | Erreur serveur |

---

## 🔒 Sécurité

### Format du Token
Tous les tokens suivent le format Sanctum standard:
```
{token_id}|{plain_text_token}
```

### Durée de vie des tokens
- **Token d'accès**: 24 heures
- **Token de reset password**: 60 minutes
- **Email de vérification**: pas d'expiration

### Révocation des tokens
Les tokens peuvent être révoqués:
- Manuellement via `/api/auth/logout`
- Automatiquement après 24h d'inactivité
- Via `/api/auth/logout-all` pour tous les appareils

---

## 📝 Exemples d'utilisation (JavaScript/Axios)

```javascript
// Configuration de base
const API_URL = 'http://localhost:8000/api';
let authToken = null;

// Inscription
async function register() {
  try {
    const response = await axios.post(`${API_URL}/auth/register/parent`, {
      name: "Jean Dupont",
      email: "jean@example.com",
      password: "MonP@ss123!",
      password_confirmation: "MonP@ss123!",
      nom: "Dupont",
      prenom: "Jean",
      telephone: "+22997123456"
    });
    
    authToken = response.data.data.token;
    localStorage.setItem('token', authToken);
    return response.data;
  } catch (error) {
    console.error('Erreur inscription:', error.response.data);
  }
}

// Connexion
async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
      device_name: 'Web Browser'
    });
    
    authToken = response.data.data.token;
    localStorage.setItem('token', authToken);
    return response.data;
  } catch (error) {
    console.error('Erreur connexion:', error.response.data);
  }
}

// Requête avec authentification
async function getProfile() {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur récupération profil:', error.response.data);
  }
}
```

---

## 🧪 Tests avec Postman

### Collection Postman
Importer la collection avec ces variables d'environnement:
- `base_url`: http://localhost:8000/api
- `token`: (sera rempli automatiquement après login)

### Tests automatiques
Ajouter dans les Tests Postman après login:
```javascript
if (pm.response.code === 200) {
    pm.environment.set("token", pm.response.json().data.token);
}
```

---

## 📞 Support

Pour toute question sur l'API:
- Vérifier d'abord cette documentation
- Consulter les logs d'erreur Laravel (`storage/logs/laravel.log`)
- Contacter l'équipe backend

**Version de l'API**: 1.0.0  
**Dernière mise à jour**: 19 Décembre 2025