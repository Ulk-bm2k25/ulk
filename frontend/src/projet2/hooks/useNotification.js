import { useEffect } from 'react';
import useNotificationStore from '../store/notificationStore';

/**
 * Hook personnalisé pour simplifier l'utilisation des notifications
 */
export const useNotifications = () => {
  // Sélectionner les données du store
  const notifications = useNotificationStore(state => state.notifications);
  const unreadCount = useNotificationStore(state => state.unreadCount);
  const loading = useNotificationStore(state => state.loading);
  const error = useNotificationStore(state => state.error);
  
  // Sélectionner les actions
  const fetchNotifications = useNotificationStore(state => state.fetchNotifications);
  const markAsRead = useNotificationStore(state => state.markAsRead);
  const markAllAsRead = useNotificationStore(state => state.markAllAsRead);
  const deleteNotification = useNotificationStore(state => state.deleteNotification);
  const addNotification = useNotificationStore(state => state.addNotification);
  const simulateRealtimeNotification = useNotificationStore(state => state.simulateRealtimeNotification);
  
  // Charger les notifications au montage du composant
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  // Fonctions utilitaires
  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.is_read);
  };
  
  const getReadNotifications = () => {
    return notifications.filter(n => n.is_read);
  };
  
  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };
  
  const getRecentNotifications = (limit = 5) => {
    return notifications.slice(0, limit);
  };
  
  return {
    // Données
    notifications,
    unreadCount,
    loading,
    error,
    
    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    refetch: fetchNotifications,
    simulateRealtimeNotification,
    
    // Utilitaires
    getUnreadNotifications,
    getReadNotifications,
    getNotificationsByType,
    getRecentNotifications
  };
};

export default useNotifications;