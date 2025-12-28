import React, { useState, useEffect } from 'react';

function Reports({ initialClassId, classesList }) {
  const [selectedClass, setSelectedClass] = useState(initialClassId || 'all');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api';

  const getAuthToken = () => localStorage.getItem('token');

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedClass, selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/presence/stats?classe_id=${selectedClass}&period=${selectedPeriod}`,
        { headers: getHeaders() }
      );
      if (!response.ok) throw new Error('Erreur chargement stats');
      const data = await response.json();
      setReportData(data.students || []);
    } catch (err) {
      console.error(err);
      // Données de démonstration si l'API échoue
      setReportData([
        { name: 'Jean Dupont', presences: 18, absences: 2, retards: 1, rate: 90 },
        { name: 'Marie Martin', presences: 20, absences: 0, retards: 0, rate: 100 },
        { name: 'Pierre Bernard', presences: 15, absences: 5, retards: 2, rate: 75 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/presence/report`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          classe_id: selectedClass === 'all' ? null : selectedClass,
          period: selectedPeriod,
          format: selectedFormat,
          date_debut: new Date().toISOString().split('T')[0]
        })
      });

      if (!response.ok) throw new Error('Erreur rapport');
      const data = await response.json();
      if (data.report_url) {
        window.open(data.report_url, '_blank');
        alert('Rapport généré avec succès !');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur génération rapport');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        .reports-container {
          width: 100%;
          padding: 0;
        }

        .reports-container h2 {
          margin-bottom: 1.5rem;
          color: #303950;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .report-controls {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(48, 57, 80, 0.08);
          margin-bottom: 2rem;
          border: 1px solid rgba(87, 149, 148, 0.1);
        }

        .report-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 600;
          color: #404769;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-group select {
          padding: 0.625rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background-color: white;
          font-size: 0.875rem;
          color: #404769;
        }

        .filter-group select:focus {
          outline: none;
          border-color: #579594;
          box-shadow: 0 0 0 2px rgba(87, 149, 148, 0.2);
        }

        .report-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.625rem 1.25rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(48, 57, 80, 0.15);
        }

        .btn.primary {
          background: #579594;
          color: white;
          font-weight: 600;
        }

        .btn.primary:hover {
          background: #4a8483;
        }

        .btn.secondary {
          background: #404769;
          color: white;
          font-weight: 600;
        }

        .btn.secondary:hover {
          background: #303950;
        }

        .btn.small {
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
        }

        .report-preview {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(48, 57, 80, 0.08);
          border: 1px solid rgba(87, 149, 148, 0.1);
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .preview-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #303950;
          font-weight: 600;
        }

        .preview-actions {
          display: flex;
          gap: 0.75rem;
        }

        .report-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .report-stat {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          border-top: 4px solid #579594;
        }

        .report-stat:nth-child(2) {
          border-top-color: #f5b7b1;
        }

        .report-stat:nth-child(3) {
          border-top-color: #404769;
        }

        .report-stat:nth-child(4) {
          border-top-color: #303950;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #404769;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #303950;
          margin-bottom: 0.5rem;
        }

        .stat-value.warning {
          color: #404769;
        }

        .stat-trend {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
          font-weight: 500;
        }

        .stat-trend.up {
          background: rgba(87, 149, 148, 0.15);
          color: #579594;
        }

        .stat-trend.down {
          background: rgba(245, 183, 177, 0.2);
          color: #404769;
        }

        .stat-trend.stable {
          background: rgba(64, 71, 105, 0.1);
          color: #404769;
        }

        .report-table {
          overflow-x: auto;
        }

        .report-table h4 {
          margin-bottom: 1.25rem;
          color: #303950;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .report-table table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .report-table thead {
          background: #f8fafc;
        }

        .report-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #404769;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .report-table td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #404769;
        }

        .report-table tbody tr:hover {
          background: rgba(87, 149, 148, 0.05);
        }

        .attendance-rate {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .rate-bar {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .rate-fill {
          height: 100%;
          background: linear-gradient(90deg, #579594, #404769);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .rate-value {
          font-weight: 600;
          color: #303950;
          min-width: 45px;
          font-size: 0.875rem;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }

        .status-badge.warning {
          background: rgba(245, 183, 177, 0.3);
          color: #404769;
        }

        .status-badge.success {
          background: rgba(87, 149, 148, 0.15);
          color: #579594;
        }

        .status-badge.info {
          background: rgba(64, 71, 105, 0.1);
          color: #404769;
        }

        .loading-state {
          text-align: center;
          padding: 3rem;
          color: #404769;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .report-filters {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="reports-container">
        <h2>Rapports de Présence</h2>

        <div className="report-controls">
          <div className="report-filters">
            <div className="filter-group">
              <label>Période:</label>
              <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="custom">Personnalisée</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Classe:</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="all">Toutes les classes</option>
                {classesList?.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.nom}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Cours:</label>
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="all">Tous les cours</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Physique-Chimie">Physique-Chimie</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Format:</label>
              <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <div className="report-actions">
            <button className="btn primary" onClick={generateReport}>
              Générer rapport
            </button>
          </div>
        </div>

        <div className="report-preview">
          <div className="preview-header">
            <h3>Aperçu du rapport</h3>
            <div className="preview-actions">
              <button className="btn small secondary" onClick={generateReport}>
                Exporter
              </button>
            </div>
          </div>

          <div className="report-stats">
            <div className="report-stat">
              <div className="stat-label">Taux de présence global</div>
              <div className="stat-value">87%</div>
              <div className="stat-trend up">+2% vs semaine dernière</div>
            </div>
            <div className="report-stat">
              <div className="stat-label">Absences totales</div>
              <div className="stat-value">42</div>
              <div className="stat-trend down">-5 vs semaine dernière</div>
            </div>
            <div className="report-stat">
              <div className="stat-label">Retards</div>
              <div className="stat-value">18</div>
              <div className="stat-trend stable">Stable</div>
            </div>
            <div className="report-stat">
              <div className="stat-label">Élèves à risque</div>
              <div className="stat-value warning">5</div>
              <div className="stat-trend">(3+ absences)</div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">Chargement des données...</div>
          ) : (
            <div className="report-table">
              <h4>Détail par élève</h4>
              <table>
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>Présences</th>
                    <th>Absences</th>
                    <th>Retards</th>
                    <th>Taux</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.length > 0 ? (
                    reportData.map((student, idx) => (
                      <tr key={idx}>
                        <td>{student.name}</td>
                        <td>{student.presences}</td>
                        <td>{student.absences}</td>
                        <td>{student.retards}</td>
                        <td>
                          <div className="attendance-rate">
                            <div className="rate-bar">
                              <div
                                className="rate-fill"
                                style={{ width: `${student.rate}%` }}
                              ></div>
                            </div>
                            <span className="rate-value">{student.rate}%</span>
                          </div>
                        </td>
                        <td>
                          {student.absences >= 3 ? (
                            <span className="status-badge warning">À risque</span>
                          ) : student.absences === 0 ? (
                            <span className="status-badge success">Excellent</span>
                          ) : (
                            <span className="status-badge info">Bon</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                        Aucune donnée disponible pour la période sélectionnée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;