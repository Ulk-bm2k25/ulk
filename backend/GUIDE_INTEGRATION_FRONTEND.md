# 📚 Guide d'Intégration Frontend - Module Notifications

Ce guide explique comment intégrer le module de notifications dans votre application React.

---

## 🔗 Configuration de base

### Base URL de l'API

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Authentification

Toutes les requêtes nécessitent un token Sanctum. Incluez-le dans les headers :

```javascript
const token = localStorage.getItem('auth_token'); // Ou votre système de gestion de token

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
};
```

---

## 📋 Endpoints disponibles

### Pour les Administrateurs (rôle admin requis)

#### 1. Envoyer un rappel de paiement

```javascript
POST /api/notifications/payment-reminder

Body:
{
  "recipient_id": 1,
  "amount": 150000,
  "due_date": "2024-01-15",
  "tranche": "Tranche 1",
  "student_name": "Jean Dupont",
  "scheduled_at": "2024-01-10 10:00:00" // Optionnel
}

Response (201):
{
  "success": true,
  "message": "Rappel de paiement créé avec succès",
  "data": {
    "notification": { ... }
  }
}
```

#### 2. Envoyer une notification urgente

```javascript
POST /api/notifications/urgent

Body:
{
  "recipient_id": 1,
  "subject": "Information urgente concernant votre enfant",
  "body": "Nous vous informons que...",
  "metadata": {
    "priority": "high"
  }
}
```

#### 3. Envoyer une notification générale

```javascript
POST /api/notifications/general

Body:
{
  "recipient_id": 1,
  "subject": "Information générale de l'école",
  "body": "Nous vous informons que...",
  "metadata": {},
  "scheduled_at": "2024-01-10 10:00:00" // Optionnel
}
```

#### 4. Lister toutes les notifications

```javascript
GET /api/notifications?status=sent&type=payment_reminder&per_page=20

Query Parameters:
- status (optionnel): draft, scheduled, sent, failed
- type (optionnel): payment_reminder, urgent_info, general
- recipient_id (optionnel): ID du destinataire
- per_page (optionnel): Nombre d'éléments par page (défaut: 15)

Response (200):
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ... ],
    "total": 50,
    "per_page": 15,
    "last_page": 4
  }
}
```

#### 5. Obtenir une notification spécifique

```javascript
GET /api/notifications/{id}

Response (200):
{
  "success": true,
  "data": {
    "notification": { ... },
    "stats": {
      "sent": 1,
      "delivered": 1,
      "opened": 1,
      "clicked": 0,
      ...
    }
  }
}
```

#### 6. Relancer une notification échouée

```javascript
POST /api/notifications/{id}/retry

Response (200):
{
  "success": true,
  "message": "Notification relancée avec succès",
  "data": { ... }
}
```

#### 7. Lister les templates disponibles

```javascript
GET /api/notifications/templates/list

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "payment_reminder_tranche_1",
      "subject": "Rappel de paiement - Tranche 1",
      "type": "payment_reminder",
      ...
    }
  ]
}
```

---

### Pour les Parents

#### 1. Mes notifications

```javascript
GET /api/notifications/me/list?status=sent&type=payment_reminder&per_page=15

Response (200):
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ... ],
    "total": 10,
    "per_page": 15
  }
}
```

---

## 💻 Exemples d'implémentation React

### 1. Service API pour les notifications

Créez un fichier `src/services/notificationService.js` :

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };
};

export const notificationService = {
  // Envoyer un rappel de paiement
  sendPaymentReminder: async (data) => {
    const response = await fetch(`${API_BASE_URL}/notifications/payment-reminder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Envoyer une notification urgente
  sendUrgentNotification: async (data) => {
    const response = await fetch(`${API_BASE_URL}/notifications/urgent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Envoyer une notification générale
  sendGeneralNotification: async (data) => {
    const response = await fetch(`${API_BASE_URL}/notifications/general`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Lister les notifications (admin)
  getNotifications: async (filters = {}) => {
    const params = new URLSearchParams({
      ...filters,
      per_page: filters.per_page || 15
    });
    const response = await fetch(`${API_BASE_URL}/notifications?${params}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Obtenir une notification spécifique
  getNotification: async (id) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Relancer une notification
  retryNotification: async (id) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/retry`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Lister les templates
  getTemplates: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/templates/list`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Mes notifications (parent)
  getMyNotifications: async (filters = {}) => {
    const params = new URLSearchParams({
      ...filters,
      per_page: filters.per_page || 15
    });
    const response = await fetch(`${API_BASE_URL}/notifications/me/list?${params}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};
```

---

### 2. Hook React personnalisé

Créez un fichier `src/hooks/useNotifications.js` :

```javascript
import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = (filters = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(filters);
      if (response.success) {
        setNotifications(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          per_page: response.data.per_page
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [JSON.stringify(filters)]);

  return {
    notifications,
    loading,
    error,
    pagination,
    refetch: fetchNotifications
  };
};
```

---

### 3. Composant d'envoi de notification

```javascript
import React, { useState } from 'react';
import { notificationService } from '../services/notificationService';

const SendNotificationForm = ({ recipientId, onSuccess }) => {
  const [formData, setFormData] = useState({
    recipient_id: recipientId,
    amount: '',
    due_date: '',
    tranche: '',
    student_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await notificationService.sendPaymentReminder(formData);
      if (response.success) {
        onSuccess(response.data.notification);
        // Réinitialiser le formulaire
        setFormData({
          recipient_id: recipientId,
          amount: '',
          due_date: '',
          tranche: '',
          student_name: ''
        });
      } else {
        setError(response.message || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="number"
        placeholder="Montant"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
      />
      
      <input
        type="date"
        placeholder="Date d'échéance"
        value={formData.due_date}
        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
      />
      
      <input
        type="text"
        placeholder="Tranche"
        value={formData.tranche}
        onChange={(e) => setFormData({ ...formData, tranche: e.target.value })}
      />
      
      <input
        type="text"
        placeholder="Nom de l'élève"
        value={formData.student_name}
        onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer le rappel'}
      </button>
    </form>
  );
};

export default SendNotificationForm;
```

---

### 4. Liste des notifications

```javascript
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationsList = ({ filters = {} }) => {
  const { notifications, loading, error, pagination } = useNotifications(filters);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id} className="notification-card">
          <h3>{notification.subject}</h3>
          <p>Type: {notification.type}</p>
          <p>Statut: {notification.status}</p>
          <p>Date: {new Date(notification.created_at).toLocaleDateString()}</p>
        </div>
      ))}
      
      {pagination && (
        <div className="pagination">
          Page {pagination.current_page} sur {pagination.last_page}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
```

---

## 🔐 Gestion des erreurs

### Codes de réponse HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide (validation échouée)
- `401` - Non authentifié (token manquant/invalide)
- `403` - Accès interdit (rôle insuffisant)
- `404` - Ressource non trouvée
- `500` - Erreur serveur

### Gestion d'erreur exemple

```javascript
const handleApiCall = async (apiFunction) => {
  try {
    const response = await apiFunction();
    
    if (response.success) {
      return response.data;
    } else {
      // Erreur retournée par l'API
      throw new Error(response.message || 'Une erreur est survenue');
    }
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers la connexion
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Accès interdit
      alert('Vous n\'avez pas les permissions nécessaires');
    } else {
      // Autre erreur
      console.error('Erreur API:', error);
      alert('Erreur: ' + error.message);
    }
    throw error;
  }
};
```

---

## 📊 Types de notifications

### Statuts

- `draft` - Brouillon, pas encore envoyé
- `scheduled` - Programmée pour envoi
- `sent` - Envoyée avec succès
- `failed` - Échec d'envoi

### Types

- `payment_reminder` - Rappel de paiement
- `urgent_info` - Information urgente
- `general` - Notification générale

---

## 🎨 Exemple d'interface complète

```javascript
import React, { useState } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const loadNotifications = async () => {
    const filters = {};
    if (selectedStatus !== 'all') filters.status = selectedStatus;
    if (selectedType !== 'all') filters.type = selectedType;
    
    const response = await notificationService.getNotifications(filters);
    if (response.success) {
      setNotifications(response.data.data);
    }
  };

  const handleSendPaymentReminder = async (data) => {
    const response = await notificationService.sendPaymentReminder(data);
    if (response.success) {
      alert('Rappel de paiement envoyé avec succès!');
      loadNotifications(); // Recharger la liste
    }
  };

  return (
    <div>
      <h1>Gestion des Notifications</h1>
      
      {/* Filtres */}
      <div>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="scheduled">Programmée</option>
          <option value="sent">Envoyée</option>
          <option value="failed">Échouée</option>
        </select>
        
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="all">Tous les types</option>
          <option value="payment_reminder">Rappel de paiement</option>
          <option value="urgent_info">Urgent</option>
          <option value="general">Générale</option>
        </select>
        
        <button onClick={loadNotifications}>Filtrer</button>
      </div>
      
      {/* Liste des notifications */}
      <div>
        {notifications.map((notification) => (
          <div key={notification.id}>
            <h3>{notification.subject}</h3>
            <p>Statut: {notification.status}</p>
            {notification.status === 'failed' && (
              <button onClick={() => notificationService.retryNotification(notification.id)}>
                Relancer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDashboard;
```

---

## 🔗 Variables d'environnement

Ajoutez dans votre `.env` React :

```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

## 📝 Notes importantes

1. **Authentification** : Toutes les routes nécessitent un token Bearer valide
2. **Rôles** : Les routes admin nécessitent le rôle `admin`
3. **Format de date** : Utilisez le format ISO 8601 pour les dates (YYYY-MM-DD HH:mm:ss)
4. **Pagination** : Les listes sont paginées, utilisez `per_page` pour contrôler le nombre d'éléments
5. **Queues** : Les emails sont envoyés de manière asynchrone via des queues, ils peuvent prendre quelques secondes à être traités

---

## 🚀 Prochaines étapes

1. Créer le service API (`notificationService.js`)
2. Créer les hooks React si nécessaire
3. Intégrer les composants dans votre application
4. Tester avec l'API backend
5. Gérer les erreurs et les états de chargement

---

## 📞 Support

Pour toute question ou problème, consultez :
- Les logs du backend : `storage/logs/laravel.log`
- La console du navigateur pour les erreurs réseau
- Les réponses de l'API (vérifier `response.success` et `response.message`)

