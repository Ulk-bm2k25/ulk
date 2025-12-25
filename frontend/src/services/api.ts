// src/services/api.ts

import type { StatsResponse } from '../types';

const API_URL = 'http://localhost:8000/api';

export const statsApi = {
  /**
   * Récupérer toutes les statistiques d'une classe
   */
  getStats: async (
    classeId: number,
    periode: string,
    anneeScolaire: string
  ): Promise<StatsResponse> => {
    try {
      const response = await fetch(
        `${API_URL}/stats/${classeId}?periode=${periode}&annee_scolaire=${anneeScolaire}`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      throw error;
    }
  },

  /**
   * Test de connexion API
   */
  testConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/test`);
      return response.ok;
    } catch {
      return false;
    }
  },
};