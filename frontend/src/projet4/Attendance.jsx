import React, { useState, useEffect } from 'react';

function Attendance() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [currentClass, setCurrentClass] = useState('Terminale A');
  const [currentCourse, setCurrentCourse] = useState('Mathématiques');
  const [attendanceData, setAttendanceData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Voici votre code de base amélioré

  // Données simulées pour les étudiants
  const initialStudents = [
    { id: 1, name: 'Jean Dupont', present: false, absences: 2, parentEmail: 'parent1@email.com', parentPhone: '+1234567890' },
    { id: 2, name: 'Marie Martin', present: true, absences: 0, parentEmail: 'parent2@email.com', parentPhone: '+1234567891' },
    { id: 3, name: 'Pierre Bernard', present: false, absences: 3, parentEmail: 'parent3@email.com', parentPhone: '+1234567892' },
    { id: 4, name: 'Sophie Petit', present: true, absences: 1, parentEmail: 'parent4@email.com', parentPhone: '+1234567893' },
    { id: 5, name: 'Luc Dubois', present: true, absences: 0, parentEmail: 'parent5@email.com', parentPhone: '+1234567894' },
    { id: 6, name: 'Emma Laurent', present: false, absences: 5, parentEmail: 'parent6@email.com', parentPhone: '+1234567895' },
  ];

  // Données simulées pour les cours 
  const initialCourses = [
    { id: 1, subject: 'Mathématiques', class: 'Terminale A', day: 'Lundi', time: '08:00-10:00', teacher: 'M. Diallo' },
    { id: 2, subject: 'Physique-Chimie', class: 'Terminale A', day: 'Lundi', time: '10:15-12:15', teacher: 'Mme. Koné' },
    { id: 3, subject: 'Français', class: 'Terminale A', day: 'Mardi', time: '08:00-10:00', teacher: 'M. Traoré' },
    { id: 4, subject: 'Histoire-Géographie', class: 'Terminale A', day: 'Mardi', time: '10:15-12:15', teacher: 'Mme. Diop' },
    { id: 5, subject: 'Anglais', class: 'Terminale A', day: 'Mercredi', time: '08:00-10:00', teacher: 'M. Smith' },
  ];

  // Données simulées pour les demandes de permission
  const initialRequests = [
    { id: 1, student: 'Pierre Bernard', studentId: 3, date: '2025-03-15', reason: 'Rendez-vous médical', status: 'En attente' },
    { id: 2, student: 'Emma Laurent', studentId: 6, date: '2025-03-14', reason: 'Problème familial', status: 'Approuvé' },
    { id: 3, student: 'Sophie Petit', studentId: 4, date: '2025-03-13', reason: 'Compétition sportive', status: 'Refusé' },
  ];

  // Notifications simulées
  const initialNotifications = [
    { id: 1, message: 'Pierre Bernard a 3 absences consécutives', type: 'warning', time: '10:30', read: false },
    { id: 2, message: 'Nouvelle demande de permission de Jean Dupont', type: 'info', time: '09:15', read: false },
    { id: 3, message: 'Rapport de présence généré avec succès', type: 'success', time: 'Hier', read: true },
  ];

  useEffect(() => {
    setAttendanceData(initialStudents);
    setCourses(initialCourses);
    setPermissionRequests(initialRequests);
    setNotifications(initialNotifications);
  }, []);

  const toggleAttendance = (studentId) => {
    setAttendanceData(prevData => 
      prevData.map(student => {
        if (student.id === studentId) {
          const newPresentState = !student.present;
          if (!newPresentState) {
            addNotification(`Absence enregistrée pour ${student.name}`, 'warning');
            sendParentNotification(student, 'absence');
          }
          return { ...student, present: newPresentState };
        }
        return student;
      })
    );
  };

  const markAllPresent = () => {
    setAttendanceData(prevData => 
      prevData.map(student => ({ ...student, present: true }))
    );
    addNotification('Tous les élèves marqués présents', 'success');
  };

  const markAllAbsent = () => {
    setAttendanceData(prevData => 
      prevData.map(student => {
        if (!student.present) {
          sendParentNotification(student, 'absence');
        }
        return { ...student, present: false };
      })
    );
    addNotification('Tous les élèves marqués absents', 'warning');
  };

  const generateReport = () => {
    addNotification('Rapport de présence généré au format PDF', 'success');
    const reportData = {
      date: new Date().toLocaleDateString(),
      class: currentClass,
      course: currentCourse,
      totalStudents: attendanceData.length,
      present: attendanceData.filter(s => s.present).length,
      absent: attendanceData.filter(s => !s.present).length,
      attendanceRate: Math.round((attendanceData.filter(s => s.present).length / attendanceData.length) * 100)
    };
    
    alert(`Rapport généré avec succès!\n\nClasse: ${reportData.class}\nCours: ${reportData.course}\nTaux de présence: ${reportData.attendanceRate}%\nPrésents: ${reportData.present}/${reportData.totalStudents}\n\nLe rapport PDF est prêt au téléchargement.`);
  };

  const sendParentNotification = (student, type) => {
    let message = '';
    if (type === 'absence') {
      message = `Votre enfant ${student.name} est absent en cours de ${currentCourse} aujourd'hui.`;
    } else if (type === 'permission') {
      message = `Demande de permission pour ${student.name} a été traitée.`;
    }
    
    console.log(`Email envoyé à: ${student.parentEmail}`);
    console.log(`Message WhatsApp envoyé à: ${student.parentPhone}`);
    
    addNotification(`Notification envoyée aux parents de ${student.name}`, 'info');
  };

  const handlePermissionAction = (requestId, action) => {
    setPermissionRequests(prev => 
      prev.map(request => {
        if (request.id === requestId) {
          const student = attendanceData.find(s => s.id === request.studentId);
          if (student && action === 'Approuvé') {
            sendParentNotification(student, 'permission');
          }
          addNotification(`Demande de permission ${action.toLowerCase()} pour ${request.student}`, 'info');
          return { ...request, status: action };
        }
        return request;
      })
    );
  };

  const addNotification = (message, type) => {
    const newNotification = {
      id: notifications.length + 1,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const AttendanceMarking = () => (
    <div className="attendance-marking">
      <div className="section-header">
        <h2>Marquage de Présence</h2>
        <div className="course-selector">
          <div className="selector-group">
            <span className="selector-label">Cours:</span>
            <select value={currentCourse} onChange={(e) => setCurrentCourse(e.target.value)}>
              {courses.map(course => (
                <option key={course.id} value={course.subject}>{course.subject}</option>
              ))}
            </select>
          </div>
          <div className="selector-group">
            <span className="selector-label">Classe:</span>
            <select value={currentClass} onChange={(e) => setCurrentClass(e.target.value)}>
              <option value="Terminale A">Terminale A</option>
              <option value="Terminale B">Terminale B</option>
              <option value="Première A">Première A</option>
              <option value="Seconde A">Seconde A</option>
            </select>
          </div>
          <div className="selector-group">
            <span className="selector-label">Date:</span>
            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>
      </div>

      <div className="attendance-controls">
        <div className="control-group">
          <button className="btn primary" onClick={markAllPresent}>
            <span className="btn-icon">✓</span> Tous présents
          </button>
          <button className="btn secondary" onClick={markAllAbsent}>
            <span className="btn-icon">✗</span> Tous absents
          </button>
          <button className="btn warning" onClick={() => {
            const absentStudents = attendanceData.filter(s => !s.present);
            absentStudents.forEach(student => sendParentNotification(student, 'absence'));
            addNotification(`Notifications envoyées aux ${absentStudents.length} parents`, 'info');
          }}>
            Notifier tous les absents
          </button>
        </div>
        <div className="control-group">
          <button className="btn success" onClick={generateReport}>
            Générer PDF
          </button>
        </div>
      </div>

      <div className="attendance-list-container">
        <div className="list-header">
          <h3>Liste des élèves - {currentClass}</h3>
          <div className="list-stats">
            <span className="stat present">{attendanceData.filter(s => s.present).length} Présents</span>
            <span className="stat absent">{attendanceData.filter(s => !s.present).length} Absents</span>
            <span className="stat total">{attendanceData.length} Total</span>
          </div>
        </div>
        <div className="attendance-list">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Nom de l'élève</th>
                <th>Présent(e)</th>
                <th>Absences totales</th>
                <th>Dernière absence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student, index) => (
                <tr key={student.id} className={`${student.present ? 'present-row' : 'absent-row'} ${student.absences >= 3 ? 'warning-row' : ''}`}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="student-info">
                      <span className="student-name">{student.name}</span>
                      {student.absences >= 3 && <span className="warning-badge">⚠️ 3+ absences</span>}
                    </div>
                  </td>
                  <td>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={student.present}
                        onChange={() => toggleAttendance(student.id)}
                      />
                      <span className="checkmark"></span>
                      <span className="status-label">{student.present ? 'Présent' : 'Absent'}</span>
                    </label>
                  </td>
                  <td>
                    <span className={`absence-count ${student.absences === 0 ? 'none' : student.absences < 3 ? 'low' : 'high'}`}>
                      {student.absences}
                    </span>
                  </td>
                  <td>
                    {student.absences > 0 ? 'Aujourd\'hui' : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn small accent" 
                        onClick={() => sendParentNotification(student, 'absence')}
                        disabled={student.present}
                        title="Notifier les parents"
                      >
                        Notifier
                      </button>
                      <button 
                        className="btn small secondary"
                        onClick={() => {
                          alert(`SMS envoyé à ${student.parentPhone}\nMessage: Urgent: ${student.name} absent en cours.`);
                        }}
                        disabled={student.present}
                        title="Envoyer SMS"
                      >
                        SMS
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="attendance-summary">
        <h4>Résumé de la séance</h4>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-title">Taux de présence</div>
            <div className="summary-value">
              {Math.round((attendanceData.filter(s => s.present).length / attendanceData.length) * 100)}%
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Absences notifiées</div>
            <div className="summary-value">
              {attendanceData.filter(s => !s.present).length}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-title">À risque</div>
            <div className="summary-value warning">
              {attendanceData.filter(s => s.absences >= 3).length}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Heure d'enregistrement</div>
            <div className="summary-value">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Reports = () => (
    <div className="reports">
      <h2>Rapports de Présence</h2>
      
      <div className="report-controls">
        <div className="report-filters">
          <div className="filter-group">
            <label>Période:</label>
            <select>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="custom">Personnalisée</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Classe:</label>
            <select>
              <option value="all">Toutes les classes</option>
              <option value="Terminale A">Terminale A</option>
              <option value="Terminale B">Terminale B</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Cours:</label>
            <select>
              <option value="all">Tous les cours</option>
              <option value="Mathématiques">Mathématiques</option>
              <option value="Physique-Chimie">Physique-Chimie</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Format:</label>
            <select>
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
            <button className="btn small secondary">Exporter</button>
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
              {attendanceData.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{Math.floor(Math.random() * 20) + 15}</td>
                  <td>{student.absences}</td>
                  <td>{Math.floor(Math.random() * 5)}</td>
                  <td>
                    <div className="attendance-rate">
                      <div className="rate-bar">
                        <div 
                          className="rate-fill" 
                          style={{width: `${Math.max(70, 100 - student.absences * 5)}%`}}
                        ></div>
                      </div>
                      <span className="rate-value">{Math.max(70, 100 - student.absences * 5)}%</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="ifri-presence-platform">
      <style jsx="true">{`
        /* Import de la police Raleway */
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Raleway', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        }

        body {
          background-color: #ffffff;
          color: #404769;
          line-height: 1.6;
        }

        .ifri-presence-platform {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Header Styles avec les nouvelles couleurs */
        .app-header {
          background: #303950;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(48, 57, 80, 0.2);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          font-size: 1.8rem;
          background: #579594;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 600;
          font-family: 'Raleway', sans-serif;
        }

        .logo-subtext {
          font-size: 0.75rem;
          opacity: 0.9;
          font-weight: 400;
        }

        .header-center {
          flex: 1;
          text-align: center;
        }

        .platform-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-family: 'Raleway', sans-serif;
        }

        .platform-subtitle {
          font-size: 0.875rem;
          opacity: 0.9;
          font-weight: 400;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(87, 149, 148, 0.3);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: #579594;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-role {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .notification-bell {
          position: relative;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(87, 149, 148, 0.3);
          transition: background 0.2s;
        }

        .notification-bell:hover {
          background: rgba(87, 149, 148, 0.2);
        }

        .notification-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #f5b7b1;
          color: #404769;
          font-size: 0.75rem;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .btn.logout {
          background: #579594;
          border: 1px solid #579594;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-family: 'Raleway', sans-serif;
        }

        .btn.logout:hover {
          background: #4a8483;
          border-color: #4a8483;
        }

        /* Main Container */
        .app-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 250px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 8px rgba(48, 57, 80, 0.1);
          z-index: 90;
        }

        .nav-menu {
          list-style: none;
          padding: 1.5rem 0;
          flex: 1;
        }

        .nav-menu li {
          padding: 0.875rem 1.5rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
          margin: 0.25rem 0;
          font-weight: 500;
          color: #404769;
          font-family: 'Raleway', sans-serif;
        }

        .nav-menu li:hover {
          background-color: rgba(87, 149, 148, 0.1);
          color: #303950;
          border-left-color: #579594;
        }

        .nav-menu li.active {
          background-color: rgba(87, 149, 148, 0.15);
          color: #579594;
          border-left-color: #579594;
          font-weight: 600;
        }

        .nav-icon {
          margin-right: 0.875rem;
          font-size: 1.25rem;
          width: 24px;
          text-align: center;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .current-class-widget {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          border-left: 4px solid #579594;
        }

        .widget-title {
          font-size: 0.75rem;
          color: #404769;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .class-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .class-name {
          font-weight: 600;
          color: #303950;
          font-size: 0.875rem;
        }

        .class-change {
          color: #579594;
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 500;
        }

        .class-change:hover {
          text-decoration: underline;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background: #f8fafc;
        }

        /* Common Components - Boutons avec nouvelles couleurs */
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
          font-family: 'Raleway', sans-serif;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(48, 57, 80, 0.15);
        }

        .btn:active {
          transform: translateY(0);
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

        .btn.success {
          background: #579594;
          color: white;
          font-weight: 600;
        }

        .btn.success:hover {
          background: #4a8483;
        }

        .btn.warning {
          background: #f5b7b1;
          color: #404769;
          font-weight: 600;
        }

        .btn.warning:hover {
          background: #f0a59d;
        }

        .btn.accent {
          background: #579594;
          color: white;
          font-weight: 600;
        }

        .btn.accent:hover {
          background: #4a8483;
        }

        .btn.small {
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
        }

        .btn-icon {
          font-size: 1rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        /* Dashboard Styles */
        .dashboard h2, .attendance-marking h2, .courses-management h2, 
        .permission-requests h2, .reports h2 {
          margin-bottom: 1.5rem;
          color: #303950;
          font-size: 1.75rem;
          font-weight: 700;
          font-family: 'Raleway', sans-serif;
        }

        /* Attendance Marking Styles */
        .section-header {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(48, 57, 80, 0.08);
          margin-bottom: 1.5rem;
          border: 1px solid rgba(87, 149, 148, 0.1);
        }

        .section-header h2 {
          margin-bottom: 1.25rem;
          color: #303950;
        }

        .course-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-items: center;
        }

        .selector-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .selector-label {
          font-weight: 600;
          color: #404769;
          font-size: 0.875rem;
        }

        .course-selector select, .course-selector input {
          padding: 0.625rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background-color: white;
          font-size: 0.875rem;
          min-width: 150px;
          color: #404769;
          font-family: 'Raleway', sans-serif;
        }

        .course-selector select:focus, .course-selector input:focus {
          outline: none;
          border-color: #579594;
          box-shadow: 0 0 0 2px rgba(87, 149, 148, 0.2);
        }

        .attendance-controls {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .control-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .attendance-list-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(48, 57, 80, 0.08);
          margin-bottom: 1.5rem;
          overflow: hidden;
          border: 1px solid rgba(87, 149, 148, 0.1);
        }

        .list-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .list-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #303950;
          font-weight: 600;
        }

        .list-stats {
          display: flex;
          gap: 1.5rem;
        }

        .list-stats .stat {
          font-weight: 600;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
        }

        .stat.present {
          background: rgba(87, 149, 148, 0.15);
          color: #579594;
        }

        .stat.absent {
          background: rgba(245, 183, 177, 0.2);
          color: #404769;
        }

        .stat.total {
          background: rgba(64, 71, 105, 0.1);
          color: #404769;
        }

        .attendance-list {
          overflow-x: auto;
        }

        .attendance-list table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .attendance-list thead {
          background: #f8fafc;
        }

        .attendance-list th {
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 600;
          color: #404769;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .attendance-list td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          color: #404769;
        }

        .attendance-list tbody tr:hover {
          background: rgba(87, 149, 148, 0.05);
        }

        .present-row {
          background: rgba(87, 149, 148, 0.05);
        }

        .absent-row {
          background: rgba(245, 183, 177, 0.05);
        }

        .warning-row {
          background: rgba(245, 183, 177, 0.1);
        }

        .student-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .student-name {
          font-weight: 600;
          color: #303950;
        }

        .warning-badge {
          font-size: 0.75rem;
          background: rgba(245, 183, 177, 0.3);
          color: #404769;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
          font-weight: 500;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-container input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #e2e8f0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .checkbox-container input:checked ~ .checkmark {
          background: #579594;
          border-color: #579594;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          content: "✓";
          color: white;
          font-weight: bold;
          font-size: 0.875rem;
        }

        .status-label {
          font-weight: 500;
          font-size: 0.875rem;
        }

        .absence-count {
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          display: inline-block;
        }

        .absence-count.none {
          background: rgba(87, 149, 148, 0.15);
          color: #579594;
        }

        .absence-count.low {
          background: rgba(245, 183, 177, 0.2);
          color: #404769;
        }

        .absence-count.high {
          background: rgba(245, 183, 177, 0.4);
          color: #303950;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .attendance-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(48, 57, 80, 0.08);
          border: 1px solid rgba(87, 149, 148, 0.1);
        }

        .attendance-summary h4 {
          margin-bottom: 1.25rem;
          color: #303950;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .summary-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.25rem;
          border-left: 4px solid #579594;
          border: 1px solid rgba(87, 149, 148, 0.1);
        }

        .summary-title {
          font-size: 0.75rem;
          color: #404769;
          margin-bottom: 0.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #303950;
        }

        .summary-value.warning {
          color: #404769;
        }

        /* Reports Styles */
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
          font-family: 'Raleway', sans-serif;
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
          border: 1px solid rgba(87, 149, 148, 0.1);
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

        .report-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #404769;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.75rem;
          background: #f8fafc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .report-table td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #404769;
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .nav-menu {
            display: flex;
            overflow-x: auto;
            padding: 0;
          }
          
          .nav-menu li {
            padding: 1rem;
            white-space: nowrap;
            border-left: none;
            border-bottom: 3px solid transparent;
          }
          
          .nav-menu li.active {
            border-left: none;
            border-bottom-color: #579594;
          }
          
          .nav-menu li:hover {
            border-left: none;
            border-bottom-color: #579594;
          }
          
          .sidebar-footer {
            display: none;
          }
          
          .main-content {
            padding: 1rem;
          }
          
          .attendance-controls {
            flex-direction: column;
          }
          
          .control-group {
            width: 100%;
            justify-content: stretch;
          }
          
          .control-group .btn {
            flex: 1;
          }
          
          .list-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .list-stats {
            width: 100%;
            justify-content: space-between;
          }
          
          .report-filters {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .app-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          
          .header-left, .header-center, .header-right {
            width: 100%;
            justify-content: center;
          }
          
          .user-info {
            justify-content: center;
          }
          
          .summary-cards {
            grid-template-columns: 1fr;
          }
          
          .report-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">IFRI</div>
            <div>
              <div className="logo-text">Institut de Formation</div>
              <div className="logo-subtext">Projet 4 - Gestion de Présence</div>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="platform-title">Plateforme de Gestion de Présence</div>
          <div className="platform-subtitle">Enseignement Général et Technique - 2025</div>
        </div>
        
        <div className="header-right">
          <div className="notification-bell" title="Notifications">
            <span>🔔</span>
            {unreadNotifications > 0 && (
              <span className="notification-count">{unreadNotifications}</span>
            )}
          </div>
          
          <div className="user-info">
            <div className="user-avatar">MD</div>
            <div className="user-details">
              <div className="user-name">M. Diallo</div>
              <div className="user-role">Professeur Principal</div>
            </div>
          </div>
          
          <button className="btn logout">Déconnexion</button>
        </div>
      </header>

      <div className="app-container">
        <nav className="sidebar">
          <ul className="nav-menu">
            <li 
              className={activeTab === 'attendance' ? 'active' : ''}
              onClick={() => setActiveTab('attendance')}
            >
              <span className="nav-icon"></span>
              Marquage présence
            </li>
            
            <li 
              className={activeTab === 'reports' ? 'active' : ''}
              onClick={() => setActiveTab('reports')}
            >
              <span className="nav-icon"></span>
              Rapports
            </li>
          </ul>
          
          <div className="sidebar-footer">
            <div className="current-class-widget">
              <div className="widget-title">Classe actuelle</div>
              <div className="class-display">
                <div className="class-name">{currentClass}</div>
                <div className="class-change" onClick={() => setCurrentClass(
                  currentClass === 'Terminale A' ? 'Terminale B' : 
                  currentClass === 'Terminale B' ? 'Première A' :
                  currentClass === 'Première A' ? 'Seconde A' : 'Terminale A'
                )}>
                  Changer
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {activeTab === 'attendance' && <AttendanceMarking />}
          {activeTab === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
}

export default Attendance;