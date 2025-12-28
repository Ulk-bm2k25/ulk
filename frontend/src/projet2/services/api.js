import axios from 'axios';

// ===== CONFIGURATION VITE =====
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TIMEOUT = parseInt(import.meta.env.VITE_TIMEOUT) || 10000;
const IS_DEBUG = import.meta.env.VITE_DEBUG === 'true';

// Log de configuration
if (IS_DEBUG) {
  console.log('🔧 Configuration API (Vite):', {
    API_URL,
    TIMEOUT,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
  });
}

// ===== INSTANCE AXIOS =====
const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// ===== INTERCEPTEUR REQUÊTE =====
api.interceptors.request.use(
  (config) => {
    if (IS_DEBUG) {
      console.log('📤 Requête:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullUrl: `${config.baseURL}${config.url}`,
      });
    }

    // Ajouter le token si présent
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (IS_DEBUG) console.log('🔐 Token ajouté');
    }

    return config;
  },
  (error) => {
    console.error('❌ Erreur requête:', error);
    return Promise.reject(error);
  }
);

// ===== INTERCEPTEUR RÉPONSE =====
api.interceptors.response.use(
  (response) => {
    if (IS_DEBUG) {
      console.log('📥 Réponse:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    console.error('❌ Erreur réponse:', error);

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error('🚫 Non authentifié');
          localStorage.removeItem('auth_token');
          // Redirection optionnelle
          // window.location.href = '/login';
          break;

        case 403:
          console.error('🚫 Accès interdit');
          break;

        case 404:
          console.error('🔍 Non trouvé');
          break;

        case 422:
          console.error('📝 Validation échouée:', data?.errors);
          break;

        case 500:
        case 502:
        case 503:
          console.error('🔥 Erreur serveur');
          break;
      }
    } else if (error.request) {
      console.error('🌐 Pas de réponse du serveur');
      console.error('Vérifiez que Laravel tourne sur http://localhost:8000');
    } else {
      console.error('⚠️ Erreur:', error.message);
    }

    return Promise.reject(error);
  }
);

// ===== FONCTIONS UTILITAIRES =====

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    if (IS_DEBUG) console.log('✅ Token sauvegardé');
  } else {
    localStorage.removeItem('auth_token');
    if (IS_DEBUG) console.log('🗑️ Token supprimé');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  console.log('👋 Déconnexion');
};
export default api;