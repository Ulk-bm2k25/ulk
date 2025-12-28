# 🎨 Guide d'Intégration Frontend - Module Authentification

## 📋 Table des matières
1. [Configuration initiale](#configuration-initiale)
2. [Flux d'authentification](#flux-dauthentification)
3. [Gestion des tokens](#gestion-des-tokens)
4. [Exemples de code](#exemples-de-code)
5. [Gestion des erreurs](#gestion-des-erreurs)
6. [Bonnes pratiques](#bonnes-pratiques)

---

## 🔧 Configuration initiale

### Variables d'environnement

Créez un fichier `.env` dans votre projet frontend :

```bash
VITE_API_URL=http://localhost:8000/api
# ou pour React
REACT_APP_API_URL=http://localhost:8000/api
```

### Configuration Axios (Recommandé)

```javascript
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs 401 (déconnexion auto)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Flux d'authentification

### 1. Inscription Parent

```javascript
// src/services/authService.js
import api from '../api/axios';

export const registerParent = async (userData) => {
  try {
    const response = await api.post('/auth/register/parent', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.passwordConfirmation,
      nom: userData.nom,
      prenom: userData.prenom,
      telephone: userData.telephone,
      adresse: userData.adresse,
      profession: userData.profession,
    });

    // Sauvegarder le token et les infos utilisateur
    localStorage.setItem('auth_token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    localStorage.setItem('profile', JSON.stringify(response.data.data.profile));

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

**Composant React - Exemple :**

```jsx
// src/pages/Register.jsx
import { useState } from 'react';
import { registerParent } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    profession: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const result = await registerParent(formData);
      
      // Afficher message de succès
      alert(result.message);
      
      // Rediriger vers le tableau de bord
      navigate('/dashboard');
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        alert(error.message || 'Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Vos champs de formulaire */}
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Nom complet"
      />
      {errors.name && <span className="error">{errors.name[0]}</span>}
      
      {/* ... autres champs ... */}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  );
}
```

### 2. Connexion

```javascript
// src/services/authService.js
export const login = async (email, password, deviceName = 'Web Browser') => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
      device_name: deviceName,
    });

    const { token, user, profile } = response.data.data;

    // Vérifier si 2FA est requis
    if (response.data.requires_2fa) {
      // Sauvegarder le token temporaire
      sessionStorage.setItem('temp_token', response.data.temp_token);
      return { requires2FA: true };
    }

    // Sauvegarder les données
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('profile', JSON.stringify(profile));

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

**Composant Login :**

```jsx
// src/pages/Login.jsx
import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);

      // Si 2FA est requis
      if (result.requires2FA) {
        navigate('/verify-2fa');
        return;
      }

      // Si email non vérifié
      if (result.data?.user?.email_verified === false) {
        navigate('/verify-email');
        return;
      }

      // Connexion réussie
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
      
      <a href="/forgot-password">Mot de passe oublié ?</a>
    </form>
  );
}
```

### 3. Déconnexion

```javascript
// src/services/authService.js
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    // Nettoyer le localStorage même en cas d'erreur
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  }
};
```

### 4. Récupération mot de passe

```javascript
// src/services/authService.js
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, email, password, passwordConfirmation) => {
  const response = await api.post('/auth/reset-password', {
    token,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });
  return response.data;
};
```

**Composant Reset Password :**

```jsx
// src/pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword(token, email, password, passwordConfirmation);
      alert('Mot de passe réinitialisé avec succès !');
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nouveau mot de passe"
        required
      />
      
      <input
        type="password"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        placeholder="Confirmer le mot de passe"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Réinitialisation...' : 'Réinitialiser'}
      </button>
    </form>
  );
}
```

### 5. Vérification d'email

```javascript
// src/services/authService.js
export const resendVerificationEmail = async () => {
  const response = await api.post('/email/verification-notification');
  return response.data;
};

export const checkVerificationStatus = async () => {
  const response = await api.get('/email/verification-status');
  return response.data;
};
```

---

## 🔑 Gestion des tokens

### Hook personnalisé React

```javascript
// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      setUser(response.data.user);
      setAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, authenticated };
};
```

### Route protégée

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, authenticated } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
```

**Utilisation :**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## ⚠️ Gestion des erreurs

### Gestionnaire d'erreurs global

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data.message || 'Requête invalide';
      case 401:
        return 'Session expirée. Veuillez vous reconnecter.';
      case 403:
        return data.message || 'Accès refusé';
      case 404:
        return 'Ressource non trouvée';
      case 422:
        // Erreurs de validation
        if (data.errors) {
          return Object.values(data.errors).flat().join(', ');
        }
        return data.message || 'Données invalides';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      default:
        return data.message || 'Une erreur est survenue';
    }
  } else if (error.request) {
    // Pas de réponse du serveur
    return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
  } else {
    // Erreur lors de la configuration de la requête
    return error.message || 'Une erreur est survenue';
  }
};
```

---

## ✅ Bonnes pratiques

### 1. Sécurité

```javascript
// ❌ Mauvais : stocker des infos sensibles
localStorage.setItem('password', password);

// ✅ Bon : ne stocker que le token et infos non sensibles
localStorage.setItem('auth_token', token);
localStorage.setItem('user', JSON.stringify({ id, name, email, role }));
```

### 2. Expiration des tokens

```javascript
// Vérifier l'expiration du token (si vous avez un timestamp)
const isTokenExpired = () => {
  const tokenTimestamp = localStorage.getItem('token_timestamp');
  if (!tokenTimestamp) return true;
  
  const expirationTime = 24 * 60 * 60 * 1000; // 24 heures
  return Date.now() - parseInt(tokenTimestamp) > expirationTime;
};
```

### 3. Rafraîchissement automatique

```javascript
// Si vous implémentez le refresh token
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token');
    localStorage.setItem('auth_token', response.data.token);
    return response.data.token;
  } catch (error) {
    // Si le refresh échoue, déconnecter l'utilisateur
    logout();
    window.location.href = '/login';
  }
};
```

### 4. Validation côté client

```javascript
// src/utils/validation.js
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#]/.test(password);

  if (password.length < minLength) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  if (!hasUpperCase) {
    return 'Le mot de passe doit contenir au moins une majuscule';
  }
  if (!hasLowerCase) {
    return 'Le mot de passe doit contenir au moins une minuscule';
  }
  if (!hasNumber) {
    return 'Le mot de passe doit contenir au moins un chiffre';
  }
  if (!hasSpecialChar) {
    return 'Le mot de passe doit contenir au moins un caractère spécial';
  }
  
  return null; // Valide
};
```

---

## 📞 Support et Contact

- **Documentation API complète** : Voir `API_DOCUMENTATION.md`
- **Collection Postman** : Importer le fichier JSON fourni
- **Backend GitHub** : [lien-repo]
- **Contact Backend** : [email-backend-team]

---

**Version** : 1.0.0  
**Dernière mise à jour** : 19 Décembre 2025