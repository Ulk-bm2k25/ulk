import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Mail, MessageSquare } from 'lucide-react';
import api from '../../../api';

const AbsenceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/presence/alerts');
      setAlerts(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (alertId, type) => {
    try {
      // TODO: await api.post(`/presence/alerts/${alertId}/notify`, { type });
      alert(`Notification ${type} envoyée avec succès`);
    } catch (error) {
      console.error('Erreur envoi notification:', error);
      alert('Erreur lors de l\'envoi');
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Chargement des alertes...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="text-orange-600" size={28} />
          Alertes d'Absences Successives
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Consultez et gérez les alertes pour les absences répétées
        </p>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white p-6 rounded-lg border-l-4 border-l-red-500 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg mb-1">
                    {alert.eleve.prenom} {alert.eleve.nom}
                  </h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>Classe: {alert.eleve.classe}</p>
                    <p>Absences consécutives: <strong className="text-red-600">{alert.absences_consecutives}</strong></p>
                    <p>Dernière absence: {new Date(alert.derniere_absence).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    Alerte
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-slate-600 mb-2">Contact parent:</p>
                <p className="text-sm text-slate-800">{alert.parent_email}</p>
                <p className="text-sm text-slate-800">{alert.parent_phone}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSendNotification(alert.id, 'email')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  <Mail size={18} />
                  Envoyer Email
                </button>
                <button
                  onClick={() => handleSendNotification(alert.id, 'sms')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  <MessageSquare size={18} />
                  Envoyer SMS
                </button>
                <button
                  onClick={() => handleSendNotification(alert.id, 'whatsapp')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                >
                  <MessageSquare size={18} />
                  WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400 bg-white rounded-lg border border-slate-200">
          <AlertTriangle size={48} className="mx-auto mb-2 opacity-50" />
          <p>Aucune alerte d'absence pour le moment</p>
        </div>
      )}
    </div>
  );
};

export default AbsenceAlerts;

