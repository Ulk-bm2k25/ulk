import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import notificationService from '../services/notificationService';
import { showNotificationToast } from '../utils/toastUtils.jsx';
const useNotificationStore = create(
  devtools(
    (set, get) => ({
      // ===== ÉTAT =====
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
      
      // ===== ACTIONS =====
      
      // Charger les notifications
      fetchNotifications: async () => {
        set({ loading: true, error: null });
        
        try {
          const response = await notificationService.getAll();
          console.log("DEBUG1 : " , response.success)
          if (response.success) {
            console.log("DEBUG2 : " , response.success)
            console.log("DEBUG2 : " , response.data)
            console.log("DEBUG2 : " , response.unread_count)

            set({
              notifications: response.data,
              unreadCount: response.unread_count,
              loading: false
            });
          }
        } catch (error) {
          console.error('Erreur fetch notifications:', error);
          set({ 
            error: error.message, 
            loading: false 
          });
          showNotificationToast.error('Erreur de chargement des notifications');
        }
      },
      
      // Marquer une notification comme lue
      markAsRead: async (notificationId) => {
        try {
          await notificationService.markAsRead(notificationId);
          
            set((state) => ({
                notifications: state.notifications.map(notif =>
                 notif.id === notificationId
                 ? { ...notif, is_read: true }
                 : notif
            ),
            unreadCount: Math.max(0, state.unreadCount - 1)
     }));

        } catch (error) {
          console.error('Erreur mark as read:', error);
          showNotificationToast.error('Erreur lors du marquage');
        }
      },
      
      // Marquer toutes les notifications comme lues
      markAllAsRead: async () => {
        try {
          await notificationService.markAllAsRead();
          
          set((state) => ({
            notifications: state.notifications.map(notif => ({
              ...notif,
              is_read: true
            })),
            unreadCount: 0
          }));  
          
          showNotificationToast.success('Toutes les notifications ont été marquées comme lues');
        } catch (error) {
          console.error('Erreur mark all as read:', error);
          showNotificationToast.error('Erreur lors du marquage');
        }
      },
      
      // Supprimer une notification
      deleteNotification: async (notificationId) => {
        try {
          await notificationService.delete(notificationId);
          
          set((state) => {
            const notifToDelete = state.notifications.find(n => n.id === notificationId);
            const wasUnread = notifToDelete && !notifToDelete.is_read;

            
            return {
              notifications: state.notifications.filter(n => n.id !== notificationId),
              unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
            };
          });
          
          showNotificationToast.success('Notification supprimée');
        } catch (error) {
          console.error('Erreur delete:', error);
          showNotificationToast.error('Erreur lors de la suppression');
        }
      },
      
      // Ajouter une nouvelle notification (pour temps réel plus tard)
      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
        
        // Afficher un toast automatiquement
        const toastTypes = {
          payment_approved: 'success',
          payment_rejected: 'error',
          payment_pending: 'warning',
          info: 'info'
        };
        
        const toastType = toastTypes[notification.type] || 'info';
        showNotificationToast[toastType](notification.message, {
          autoClose: 5000,
        });
      },
      
      // Simuler une notification temps réel (pour tester)
      simulateRealtimeNotification: () => {
        const newNotif = {
          id: Date.now(),
          title: '🔔 Nouvelle notification',
          message: 'Ceci est une notification de test en temps réel',
          type: 'info',
          is_read: false,
          created_at: new Date().toISOString(),
        };
        
        get().addNotification(newNotif);
      },
      
      // Réinitialiser le store
      reset: () => {
        set({
          notifications: [],
          unreadCount: 0,
          loading: false,
          error: null
        });
      }
    }),
    { name: 'NotificationStore' } // Pour les Redux DevTools
  )
);

export default useNotificationStore;