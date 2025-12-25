import React from 'react';
import { Check, X, AlertCircle, Clock, Trash2, Eye } from 'lucide-react';
import  "/src/projet2/styles/notification.css";

export const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) => {
  // Icône selon le type de notification
  const getIcon = () => {
    const icons = {
      payment_success: <Check className="icon-success" size={20} />,
      payment_failed: <X className="icon-error" size={20} />,
      payment_pending: <Clock className="icon-warning" size={20} />,
      info: <AlertCircle className="icon-info" size={20} />
    };
    return icons[notification.type] || icons.info;
  };

  // Classe CSS selon le type
  const getTypeClass = () => {
    const classes = {
      payment_success: 'notif-success',
      payment_failed: 'notif-error',
      payment_pending: 'notif-warning',
      info: 'notif-info'
    };
    return classes[notification.type] || 'notif-info';
  };

  // Formatage de la date en relatif (il y a X min/h/j)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUnread = !notification.is_read;

  return (
    <div 
      className={`notification-item ${getTypeClass()} ${isUnread ? 'unread' : ''}`}
    >
      <div className="notif-icon">
        {getIcon()}
      </div>
      
      <div className="notif-content">
        <div className="notif-header-row">
          <h4 className="notif-title">{notification.title}</h4>
          {isUnread && <span className="unread-dot"></span>}
        </div>
        
        <p className="notif-message">{notification.content}</p>
        
        {notification.student_name && (
          <div className="notif-meta">
            <span className="meta-item">👤 {notification.student_name}</span>
            {notification.amount && (
              <span className="meta-item">💰 {notification.amount.toLocaleString()} FCFA</span>
            )}
          </div>
        )}
        
        <span className="notif-time">{formatDate(notification.created_at)}</span>
      </div>
      
      <div className="notif-actions">
        {isUnread && (
          <button
            className="notif-action-btn mark-read-btn"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            title="Marquer comme lu"
          >
            <Eye size={16} />
          </button>
        )}
        
        <button
          className="notif-action-btn delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Supprimer cette notification ?')) {
              onDelete(notification.id);
            }
          }}
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};