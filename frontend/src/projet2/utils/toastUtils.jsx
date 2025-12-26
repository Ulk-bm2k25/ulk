import React from 'react';
import { Check, X, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

// Composant pour afficher un toast personnalisé
const NotificationToast = ({ message, type = 'info' }) => {
  // Icône selon le type
  const getIcon = () => {
    switch (type) {
      case 'success': return <Check className="toast-icon" size={20} />;
      case 'error': return <X className="toast-icon" size={20} />;
      case 'warning': return <Clock className="toast-icon" size={20} />;
      default: return <AlertCircle className="toast-icon" size={20} />;
    }
  };

  return (
    <div className={`notification-toast ${type}`}>
      {getIcon()}
      <span className="toast-message">{message}</span>
    </div>
  );
};

// Options par défaut pour tous les toasts
const defaultToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Fonction pour afficher les toasts (exportée comme objet avec méthodes)
export const showNotificationToast = {
  success: (message, options = {}) => {
    toast.success(
      <NotificationToast message={message} type="success" />,
      { ...defaultToastOptions, ...options }
    );
  },
  
  error: (message, options = {}) => {
    toast.error(
      <NotificationToast message={message} type="error" />,
      { ...defaultToastOptions, ...options }
    );
  },
  
  warning: (message, options = {}) => {
    toast.warning(
      <NotificationToast message={message} type="warning" />,
      { ...defaultToastOptions, ...options }
    );
  },
  
  info: (message, options = {}) => {
    toast.info(
      <NotificationToast message={message} type="info" />,
      { ...defaultToastOptions, ...options }
    );
  }
};

export default NotificationToast;