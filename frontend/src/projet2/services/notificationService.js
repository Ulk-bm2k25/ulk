import api from './api';
import { mockNotifications, generateRandomNotification } from '../mockData/notifications';

// ===== CONFIGURATION =====
const USE_MOCK = import.meta.env.VITE_USE_MOCK ;
//const IS_DEBUG = import.meta.env.VITE_DEBUG;
const IS_DEBUG = true;
console.log('🔧 DEBug:',IS_DEBUG );
if (IS_DEBUG) {
  console.log('🔧 NotificationService - Mode:', USE_MOCK ? 'MOCK' : 'API');
}

// ===== SERVICE =====
class NotificationService {
  
  // Récupérer toutes les notifications
  async getAll() {
    if (IS_DEBUG) console.log('📋 Récupération notifications...');
    
    if (USE_MOCK) {
      if (IS_DEBUG) console.log('🎭 Mode MOCK');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Adapter les mocks aussi pour cohérence
      const adaptedMocks = mockNotifications.map(notification => ({
        ...notification,
        content: notification.content || notification.message, // Assurer content
        is_read: notification.is_read !== undefined ? notification.is_read : !notification.read_at,
      }));
      
      return {
        success: true,
        data: adaptedMocks,
        unread_count: adaptedMocks.filter(n => !n.is_read).length,
        total: adaptedMocks.length
      };
    }
    
    try {
      if (IS_DEBUG) console.log('🌐 GET /notifications_payment');
      
      const response = await api.get('/notifications_payment');
      
      if (IS_DEBUG) console.log('✅ Notifications reçues:', response.data);
      
      // Adapter les données du backend aux noms attendus par le frontend
      const adaptedNotifications = response.data.map(notification => ({
        ...notification,
        content: notification.content || notification.message, // Assurer que content est présent
        is_read: notification.is_read, // Assurer que c'est un boolean
       
      }));
      
      return {
        success: true,
        data: adaptedNotifications,
        unread_count: adaptedNotifications.filter(n => !n.is_read).length
      };
      
    } catch (error) {
      console.error('❌ Erreur getAll:', error);
      throw error;
    }
  }

  // Marquer comme lue
  async markAsRead(notificationId) {
    if (IS_DEBUG) console.log(`👁️ Marquer ${notificationId} comme lue`);
    
    if (USE_MOCK) {
      if (IS_DEBUG) console.log('🎭 Mode MOCK');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    
    try {
      if (IS_DEBUG) console.log(`🌐 POST /notifications_payment/${notificationId}/read`);
      const response = await api.post(`/notifications_payment/${notificationId}/read`);
      
      if (IS_DEBUG) console.log('✅ Marquée comme lue');
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur markAsRead:', error);
      throw error;
    }
  }

  // Marquer toutes comme lues
  async markAllAsRead() {
    if (IS_DEBUG) console.log('👁️👁️ Marquer toutes comme lues');
    
    if (USE_MOCK) {
      if (IS_DEBUG) console.log('🎭 Mode MOCK');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }
    
    try {
      if (IS_DEBUG) console.log('🌐 POST /notifications_payment/mark-all-read');
      const response = await api.post('/notifications_payment/mark-all-read');
      
      if (IS_DEBUG) console.log('✅ Toutes marquées');
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur markAllAsRead:', error);
      throw error;
    }
  }

  // Supprimer
  async delete(notificationId) {
    if (IS_DEBUG) console.log(`🗑️ Suppression ${notificationId}`);
    
    if (USE_MOCK) {
      if (IS_DEBUG) console.log('🎭 Mode MOCK');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    
    try {
      if (IS_DEBUG) console.log(`🌐 DELETE /notifications_payment/${notificationId}`);
      await api.delete(`/notifications_payment/${notificationId}`);
      
      if (IS_DEBUG) console.log('✅ Supprimée');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur delete:', error);
      throw error;
    }
  }

  // Envoyer (admin)
  async send(notificationData) {
    if (IS_DEBUG) console.log('📤 Envoi notification', notificationData);
    
    if (USE_MOCK) {
      if (IS_DEBUG) console.log('🎭 Mode MOCK');
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        success: true,
        data: generateRandomNotification()
      };
    }
    
    try {
      if (IS_DEBUG) console.log('🌐 POST /notifications_payment/send');
      const response = await api.post('/notifications_payment/send', notificationData);
      
      if (IS_DEBUG) console.log('✅ Envoyée');
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur send:', error);
      throw error;
    }
  }
}

export default new NotificationService();