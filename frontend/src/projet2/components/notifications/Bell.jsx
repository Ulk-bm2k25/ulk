import React from 'react';
import { Bell } from 'lucide-react';
import  "/src/projet2/styles/notification.css";

export const NotificationBell = ({ unreadCount, onClick, loading }) => {
  return (
    <button
      className={`notification-bell-btn ${loading ? 'loading' : ''}`}
      onClick={onClick}
      aria-label="Notifications"
      disabled={loading}
    >
      <Bell size={24} className={unreadCount > 0 ? 'has-unread' : ''} />

      {unreadCount > 0 && (
        <span className="notification-badge animate-bounce">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      {loading && (
        <span className="loading-spinner"></span>
      )}
    </button>
  );
};