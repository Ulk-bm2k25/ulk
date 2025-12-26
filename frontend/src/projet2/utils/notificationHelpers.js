// utils/notificationHelpers.js

// Formater une date relative 
export const formatRelativeDate = (dateString) => {
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

// Valider si une notification est valide
export const isValidNotification = (notification) => {
  return notification && notification.title && notification.message;
};

// Calculer le nombre de notifications non lues
export const countUnread = (notifications) => {
  return notifications.filter(n => !n.read_at).length;
};

// Grouper les notifications par type
export const groupByType = (notifications) => {
  return notifications.reduce((groups, notif) => {
    const type = notif.type || 'info';
    if (!groups[type]) groups[type] = [];
    groups[type].push(notif);
    return groups;
  }, {});
};

