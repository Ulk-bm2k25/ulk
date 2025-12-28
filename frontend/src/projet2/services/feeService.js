// src/services/feeService.js

import api from './api';

export const feeService = {
  // Admin : Gestion des frais
  getAllFees: () => api.get('/fees'),
  createFee: (data) => api.post('/fees', data),
  updateFee: (id, data) => api.put(`/fees/${id}`, data),
  deleteFee: (id) => api.delete(`/fees/${id}`),
  getFeeById: (id) => api.get(`/fees/${id}`),

  // Étudiant : Frais personnels
  getRegistrationFee: () => api.get('/student/registration-fee'),
  getScolariteFees: () => api.get('/student/scolarite-fees'),
};

export const trancheService = {
  // Admin : Gestion des tranches
  getAllTranches: () => api.get('/fee-tranches'),
  createTranche: (data) => api.post('/fee-tranches', data),
  createBulkTranches: (feeId, data) => api.post(`/fees/${feeId}/tranches/bulk`, data),
  updateTranche: (id, data) => api.put(`/fee-tranches/${id}`, data),
  deleteTranche: (id) => api.delete(`/fee-tranches/${id}`),
  getTranchesByFee: (feeId) => api.get(`/fees/${feeId}/tranches`),
};

export const paymentService = {
  // Étudiant : Paiements
  getMyPayments: (type = null) => {
    const params = type ? { params: { type } } : {};
    return api.get('/student/payments', params);
  },

  // Payer les frais d'inscription
  payRegistrationFee: () => api.post('/student/pay-registration'),

  // Payer une tranche de scolarité
  payTranche: (trancheId) => api.post(`/student/pay-tranche/${trancheId}`),

  // Confirmer l'inscription (étape obligatoire avant paiement)
  confirmRegistration: () => api.post('/student/confirm-registration'),

  // Admin : Gestion globale des paiements
  initiatePayment: (data) => api.post('/payments/initiate', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
  generateReceipt: (paymentId) =>
    api.get(`/payments/${paymentId}/receipt`, { responseType: 'blob' }),
};

// Export global pour compatibilité
export default {
  feeService,
  trancheService,
  paymentService,
};