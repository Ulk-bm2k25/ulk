import React, { useState, useEffect } from 'react';

// IMPORTANT : Le nom de la fonction doit commencer par une majuscule
function Permissions({ initialClassId }) {
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentClassId, setCurrentClassId] = useState(initialClassId || null);

  const [formData, setFormData] = useState({
    student_id: '',
    absence_date: '',
    course_id: '',
    reason: '',
    attachment: null,
    notify_email: false,
    notify_sms: false
  });

  const API_BASE_URL = 'http://localhost:8000/api';
  const TOKEN = localStorage.getItem('token');

  useEffect(() => {
    fetchPermissionRequests();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchPermissionRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/permissions`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erreur de récupération des demandes');

      const data = await response.json();
      setPermissionRequests(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erreur de récupération des élèves');

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erreur de récupération des cours');

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handlePermissionAction = async (requestId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/permissions/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Erreur de traitement de la demande');

      await fetchPermissionRequests();

      alert(`Demande ${status === 'approved' ? 'approuvée' : 'refusée'} avec succès`);
    } catch (err) {
      alert('Erreur: ' + err.message);
      console.error('Erreur:', err);
    }
  };

  const resendNotification = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/permissions/${requestId}/notify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erreur d\'envoi de notification');

      alert('Notification envoyée avec succès');
    } catch (err) {
      alert('Erreur: ' + err.message);
      console.error('Erreur:', err);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        },
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Erreur de création de la demande');

      setFormData({
        student_id: '',
        absence_date: '',
        course_id: '',
        reason: '',
        attachment: null,
        notify_email: false,
        notify_sms: false
      });

      await fetchPermissionRequests();

      alert('Demande créée avec succès');
    } catch (err) {
      alert('Erreur: ' + err.message);
      console.error('Erreur:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>❌ Erreur: {error}</p>
        <button onClick={fetchPermissionRequests}>Réessayer</button>
      </div>
    );
  }

  const pendingRequests = permissionRequests.filter(r => r.status === 'pending');
  const processedRequests = permissionRequests.filter(r => r.status !== 'pending');

  return (
    <div className="permissions-container">
      <style>{`
        .permissions-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .permissions-header {
          margin-bottom: 2rem;
        }

        .permissions-header h1 {
          color: #2d3250;
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .permissions-header p {
          color: #666;
          font-size: 0.95rem;
        }

        .loading-container, .error-container {
          text-align: center;
          padding: 3rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #f8b179;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .requests-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .requests-section {
          background: #fff;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          color: #2d3250;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .badge {
          background: #f8b179;
          color: #2d3250;
          font-size: 0.8rem;
          min-width: 24px;
          height: 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .request-card {
          background: #fafafa;
          border-radius: 8px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          border-left: 4px solid #f8b179;
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .student-info h3 {
          color: #2d3250;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .request-date {
          color: #666;
          font-size: 0.85rem;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.approved {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .request-body {
          margin-bottom: 1rem;
        }

        .request-reason {
          background: #fff;
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid #e5e5e5;
          margin-bottom: 1rem;
          color: #2d3250;
          line-height: 1.6;
        }

        .request-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-weight: 600;
          color: #2d3250;
        }

        .request-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-success:hover {
          background: #218838;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-small {
          padding: 0.375rem 0.75rem;
          font-size: 0.8rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #999;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .history-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #fafafa;
          padding: 0.875rem;
          text-align: left;
          font-weight: 600;
          color: #2d3250;
          border-bottom: 2px solid #e5e5e5;
          font-size: 0.85rem;
        }

        td {
          padding: 0.875rem;
          border-bottom: 1px solid #e5e5e5;
          color: #2d3250;
        }

        .new-request-form {
          background: #fff;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .new-request-form h2 {
          color: #2d3250;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          color: #2d3250;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.625rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
          font-family: inherit;
          color: #2d3250;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #f8b179;
        }

        .checkbox-group {
          display: flex;
          gap: 1.5rem;
          margin-top: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #2d3250;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .btn-primary {
          background: #f8b179;
          color: #2d3250;
          font-weight: 600;
        }

        .btn-primary:hover {
          background: #f5a05e;
        }

        @media (max-width: 1024px) {
          .requests-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="permissions-header">
        <h1>Demandes de Permission</h1>
        <p>Gérez les demandes d'absence et de permission des élèves</p>
      </div>

      <div className="requests-grid">
        <div className="requests-section">
          <div className="section-header">
            <h2>En attente</h2>
            {pendingRequests.length > 0 && (
              <span className="badge">{pendingRequests.length}</span>
            )}
          </div>

          {pendingRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>Aucune demande en attente</p>
            </div>
          ) : (
            pendingRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="student-info">
                    <h3>{request.student?.name || 'Élève inconnu'}</h3>
                    <div className="request-date">Date: {request.absence_date}</div>
                  </div>
                  <span className="status-badge pending">En attente</span>
                </div>

                <div className="request-body">
                  <div className="request-reason">
                    <strong>Raison:</strong> {request.reason}
                  </div>

                  <div className="request-details">
                    <div className="detail-item">
                      <span className="detail-label">Classe</span>
                      <span className="detail-value">{request.student?.class || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Cours concerné</span>
                      <span className="detail-value">{request.course?.subject || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="request-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handlePermissionAction(request.id, 'approved')}
                  >
                    ✓ Approuver
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handlePermissionAction(request.id, 'rejected')}
                  >
                    ✗ Refuser
                  </button>
                  <button className="btn btn-secondary">
                    💬 Contacter parent
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="requests-section">
          <div className="section-header">
            <h2>Historique</h2>
          </div>

          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Élève</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.student?.name || 'N/A'}</td>
                    <td>{request.absence_date}</td>
                    <td>
                      <span className={`status-badge ${request.status}`}>
                        {request.status === 'approved' ? 'Approuvé' : 'Refusé'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => resendNotification(request.id)}
                      >
                        Renvoyer notification
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="new-request-form">
        <h2>Nouvelle demande de permission</h2>
        <form onSubmit={handleSubmitRequest}>
          <div className="form-grid">
            <div className="form-group">
              <label>Élève *</label>
              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un élève</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date d'absence *</label>
              <input
                type="date"
                name="absence_date"
                value={formData.absence_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cours concerné *</label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un cours</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Raison de l'absence *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Décrivez la raison de l'absence..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Pièce jointe (optionnel)</label>
              <input
                type="file"
                name="attachment"
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Notifier les parents</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="notify_email"
                    checked={formData.notify_email}
                    onChange={handleInputChange}
                  />
                  Par email
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="notify_sms"
                    checked={formData.notify_sms}
                    onChange={handleInputChange}
                  />
                  Par SMS
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Soumettre la demande
          </button>
        </form>
      </div>
    </div>
  );
}

export default Permissions;