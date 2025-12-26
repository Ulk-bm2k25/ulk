import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001/api/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api/remboursements';

export const useRemboursements = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistiques, setStatistiques] = useState({});

  const fetchRemboursements = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Ajouter les filtres
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${API_BASE_URL}?${params}`);
      setData(response.data.data);
      setStatistiques(response.data.statistiques || {});
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const createRemboursement = async (remboursementData) => {
    try {
      const response = await axios.post(API_BASE_URL, remboursementData);
      await fetchRemboursements();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.errors || err.response?.data?.message || 'Erreur de création'
      };
    }
  };

  const updateStatut = async (id, statut, commentaire = '') => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, { 
        statut, 
        commentaire 
      });
      await fetchRemboursements();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.errors || err.response?.data?.message || 'Erreur de mise à jour'
      };
    }
  };

  const uploadPieceJointe = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('piece_jointe', file);
      
      const response = await axios.post(`${API_BASE_URL}/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.errors || err.response?.data?.message || 'Erreur de téléchargement'
      };
    }
  };

  useEffect(() => {
    fetchRemboursements();
  }, [filters]);

  return {
    data,
    loading,
    error,
    statistiques,
    createRemboursement,
    updateStatut,
    uploadPieceJointe,
    refresh: fetchRemboursements
  };
};

// Hook pour les statistiques
export const useRemboursementsStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/statistiques`);
        setStats(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer globalement les erreurs (ex: 401 si le token expire)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionnel : Rediriger vers le login ou nettoyer le stockage
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
