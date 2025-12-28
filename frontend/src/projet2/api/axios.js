import axios from 'axios';
import { APP_CONFIG } from '../../config'; // Ajuste le chemin selon ton projet

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    // On utilise la clé partagée définie dans la config
    const token = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si 401 et qu'on n'est PAS en simulation, alors on redirige
    if (error.response?.status === 401 && !APP_CONFIG.USE_SIMULATION) {
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
      window.location.href = './admin/login';
    }
    return Promise.reject(error);
  }
)

export default api;