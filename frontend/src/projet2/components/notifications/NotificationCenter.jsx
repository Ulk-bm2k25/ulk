import React, { useState } from 'react';
import { X, CheckCheck, RefreshCw } from 'lucide-react';
import { NotificationBell } from './Bell';
import { NotificationItem } from './NotificationItem';
import useNotifications from '../../hooks/useNotification';
import  "/src/projet2/styles/notification.css";

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, read
  
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
    simulateRealtimeNotification
  } = useNotifications();
// pour vérifier les valeurs du store 
console.log("UnreadCount:", unreadCount);
console.log("Notifications:", notifications);


  // Filtrer les notifications selon le filtre actif
  const getFilteredNotifications = () => {
  switch (filter) {
    case 'unread':
      return notifications.filter(n => !n.is_read);
    case 'read':
      return notifications.filter(n => n.is_read);
    default:
      return notifications;
  }
};


  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notification-center">
      {/* Bouton cloche */}
      <NotificationBell 
        unreadCount={unreadCount}
        onClick={() => setIsOpen(!isOpen)}
        loading={loading}
      />

      {isOpen && (
        <>
          {/* Overlay pour fermer en cliquant à l'extérieur */}
          <div 
            className="notification-overlay"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panneau des notifications */}
          <div className="notification-panel">
            {/* En-tête */}
            <div className="notif-header">
              <div className="notif-header-left">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <span className="unread-badge-header">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="notif-actions-header">
                {/* Bouton rafraîchir */}
                <button
                  className="icon-btn"
                  onClick={refetch}
                  title="Rafraîchir"
                  disabled={loading}
                >
                  <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                </button>
                
                {/* Bouton tout marquer comme lu */}
                {unreadCount > 0 && (
                  <button
                    className="icon-btn"
                    onClick={markAllAsRead}
                    title="Tout marquer comme lu"
                  >
                    <CheckCheck size={18} />
                  </button>
                )}
                
                {/* Bouton fermer */}
                <button
                  className="icon-btn close-btn"
                  onClick={() => setIsOpen(false)}
                  title="Fermer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filtres */}
            <div className="notif-filters">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Toutes ({notifications.length})
              </button>
              <button
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Non lues ({unreadCount})
              </button>
              <button
                className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
                onClick={() => setFilter('read')}
              >
                Lues ({notifications.length - unreadCount})
              </button>
            </div>

            {/* Liste des notifications */}
            <div className="notif-list">
              {loading && notifications.length === 0 ? (
                <div className="notif-loading">
                  <div className="spinner"></div>
                  <p>Chargement des notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="notif-empty">
                  <p>
                    {filter === 'unread' 
                      ? 'Aucune notification non lue' 
                      : filter === 'read'
                      ? 'Aucune notification lue'
                      : 'Aucune notification'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notif => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              )}
            </div>

            {/* Footer avec bouton test (uniquement en développement) */}
            {import.meta.env.NODE_ENV === 'development' && (
              <div className="notif-footer">
                <button
                  className="test-btn"
                  onClick={simulateRealtimeNotification}
                >
                  🧪 Simuler notification temps réel
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};