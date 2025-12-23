import React, { useState, useEffect } from 'react';

// Composants icônes SVG
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
);

const AttendanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const CoursesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const PermissionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 20V10"></path>
    <path d="M12 20V4"></path>
    <path d="M6 20v-6"></path>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const PresentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const PdfIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M10 9H8"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
  </svg>
);

const StatsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const StudentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

function SchoolHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentClass, setCurrentClass] = useState('Terminale A');
  const [attendanceData, setAttendanceData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Données simulées pour les élèves
  const initialStudents = [
    { id: 1, name: 'Koffi Agbéssi', present: true, absences: 1, parentEmail: 'parent1@email.bj', parentPhone: '+229 60 12 34 56' },
    { id: 2, name: 'Amina Adékambi', present: true, absences: 0, parentEmail: 'parent2@email.bj', parentPhone: '+229 61 23 45 67' },
    { id: 3, name: 'Simplice Ahouandjinou', present: false, absences: 3, parentEmail: 'parent3@email.bj', parentPhone: '+229 62 34 56 78' },
    { id: 4, name: 'Félicité Dossou', present: true, absences: 2, parentEmail: 'parent4@email.bj', parentPhone: '+229 63 45 67 89' },
    { id: 5, name: 'Médard Gbaguidi', present: false, absences: 4, parentEmail: 'parent5@email.bj', parentPhone: '+229 64 56 78 90' },
    { id: 6, name: 'Rosalie Houngbo', present: true, absences: 0, parentEmail: 'parent6@email.bj', parentPhone: '+229 65 67 89 01' },
    { id: 7, name: 'Gérard Kakpo', present: true, absences: 1, parentEmail: 'parent7@email.bj', parentPhone: '+229 66 78 90 12' },
    { id: 8, name: 'Patricia Lawson', present: false, absences: 2, parentEmail: 'parent8@email.bj', parentPhone: '+229 67 89 01 23' },
  ];

  // Données simulées pour les cours
  const initialCourses = [
    { id: 1, subject: 'Mathématiques', class: 'Terminale A', day: 'Lundi', time: '08:00-10:00', teacher: 'M. Adébayo' },
    { id: 2, subject: 'Physique-Chimie', class: 'Terminale A', day: 'Lundi', time: '10:15-12:15', teacher: 'Mme. Akpédjé' },
    { id: 3, subject: 'Français', class: 'Terminale A', day: 'Mardi', time: '08:00-10:00', teacher: 'M. Gnonlonfoun' },
    { id: 4, subject: 'Histoire-Géographie', class: 'Terminale A', day: 'Mardi', time: '10:15-12:15', teacher: 'Mme. Zinsou' },
    { id: 5, subject: 'Anglais', class: 'Terminale A', day: 'Mercredi', time: '08:00-10:00', teacher: 'M. Johnson' },
    { id: 6, subject: 'Philosophie', class: 'Terminale A', day: 'Mercredi', time: '10:15-12:15', teacher: 'M. Agossou' },
    { id: 7, subject: 'SVT', class: 'Terminale A', day: 'Jeudi', time: '08:00-10:00', teacher: 'Mme. Attolou' },
  ];

  // Données simulées pour les demandes de permission
  const initialRequests = [
    { id: 1, student: 'Simplice Ahouandjinou', studentId: 3, date: '2024-03-15', reason: 'Rendez-vous médical', status: 'En attente' },
    { id: 2, student: 'Médard Gbaguidi', studentId: 5, date: '2024-03-14', reason: 'Cérémonie familiale', status: 'Approuvé' },
    { id: 3, student: 'Patricia Lawson', studentId: 8, date: '2024-03-13', reason: 'Compétition scolaire', status: 'Refusé' },
  ];

  // Notifications simulées
  const initialNotifications = [
    { id: 1, message: 'Simplice Ahouandjinou a 3 absences consécutives', type: 'warning', time: '10:30', read: false },
    { id: 2, message: 'Nouvelle demande de permission de Médard Gbaguidi', type: 'info', time: '09:15', read: false },
    { id: 3, message: 'Rapport de présence du 12 Mars généré', type: 'success', time: 'Hier', read: true },
    { id: 4, message: 'Réunion des enseignants prévue vendredi', type: 'info', time: '08:00', read: false },
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
      prevData.map(student => ({ ...student, present: false }))
    );
    addNotification('Tous les élèves marqués absents', 'warning');
  };

  const generateReport = () => {
    addNotification('Rapport de présence généré au format PDF', 'success');
    const reportData = {
      date: new Date().toLocaleDateString('fr-BJ'),
      class: currentClass,
      totalStudents: attendanceData.length,
      present: attendanceData.filter(s => s.present).length,
      absent: attendanceData.filter(s => !s.present).length,
      attendanceRate: Math.round((attendanceData.filter(s => s.present).length / attendanceData.length) * 100)
    };
    
    alert(`Rapport généré avec succès!\n\nClasse: ${reportData.class}\nDate: ${reportData.date}\nTaux de présence: ${reportData.attendanceRate}%\nPrésents: ${reportData.present}/${reportData.totalStudents}\n\nLe rapport PDF est prêt au téléchargement.`);
  };

  const addNotification = (message, type) => {
    const newNotification = {
      id: notifications.length + 1,
      message,
      type,
      time: new Date().toLocaleTimeString('fr-BJ', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const Dashboard = () => (
    <div className="dashboard">
      <h2>Tableau de Bord de Présence</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <StudentsIcon />
          </div>
          <div className="stat-content">
            <h3>Présence d'aujourd'hui</h3>
            <div className="stat-number">
              {attendanceData.filter(s => s.present).length} / {attendanceData.length}
            </div>
            <div className="stat-subtitle">
              {Math.round((attendanceData.filter(s => s.present).length / attendanceData.length) * 100)}% de présence
            </div>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">
            <WarningIcon />
          </div>
          <div className="stat-content">
            <h3>Absences successives</h3>
            <div className="stat-number">
              {attendanceData.filter(s => s.absences >= 3).length}
            </div>
            <div className="stat-subtitle">Élèves avec 3+ absences</div>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">
            <ClockIcon />
          </div>
          <div className="stat-content">
            <h3>Demandes en attente</h3>
            <div className="stat-number">
              {permissionRequests.filter(r => r.status === 'En attente').length}
            </div>
            <div className="stat-subtitle">À traiter</div>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">
            <CalendarIcon />
          </div>
          <div className="stat-content">
            <h3>Cours aujourd'hui</h3>
            <div className="stat-number">3</div>
            <div className="stat-subtitle">Maths, Physique, Français</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Actions Rapides</h3>
        <div className="action-buttons">
          <button className="btn primary" onClick={() => setActiveTab('attendance')}>
            <span className="btn-icon"><AttendanceIcon /></span>
            Marquer la présence
          </button>
          <button className="btn secondary" onClick={() => setActiveTab('courses')}>
            <span className="btn-icon"><CoursesIcon /></span>
            Voir les cours
          </button>
          <button className="btn warning" onClick={generateReport}>
            <span className="btn-icon"><PdfIcon /></span>
            Générer rapport PDF
          </button>
          <button className="btn info" onClick={() => addNotification('Fonctionnalité à venir', 'info')}>
            <span className="btn-icon"><StatsIcon /></span>
            Statistiques détaillées
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <div className="activity-header">
          <h3>Activité Récente</h3>
          <span className="activity-count">{notifications.length} activités</span>
        </div>
        <div className="activity-list">
          {notifications.slice(0, 5).map(notification => (
            <div key={notification.id} className={`activity-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}>
              <div className="activity-icon">
                {notification.type === 'warning' && <WarningIcon />}
                {notification.type === 'success' && <CheckIcon />}
                {notification.type === 'info' && <BellIcon />}
              </div>
              <div className="activity-content">
                <div className="activity-message">{notification.message}</div>
                <div className="activity-time">{notification.time}</div>
              </div>
              {!notification.read && (
                <button 
                  className="btn small" 
                  onClick={() => markNotificationAsRead(notification.id)}
                  title="Marquer comme lu"
                >
                  <CheckIcon />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="students-alert">
        <h3>Élèves nécessitant attention</h3>
        <div className="students-list">
          {attendanceData
            .filter(student => student.absences >= 3)
            .map(student => (
              <div key={student.id} className="student-alert-card">
                <div className="student-info">
                  <div className="student-name">{student.name}</div>
                  <div className="student-details">
                    <span className="badge warning">{student.absences} absences</span>
                    <span className="student-class">{currentClass}</span>
                  </div>
                </div>
                <div className="student-actions">
                  <button className="btn small">
                    <EmailIcon /> Contacter
                  </button>
                </div>
              </div>
            ))}
          
          {attendanceData.filter(student => student.absences >= 3).length === 0 && (
            <div className="no-alert">
              <CheckIcon />
              <p>Tous les élèves ont un bon taux de présence</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="schoolhub-platform">
      <style jsx="true">{`
        /* Variables de couleurs */
        :root {
          --white: #ffffff;
          --primary: #676fd4;
          --secondary: #424769;
          --dark: #2d3250;
          --accent: #f8b17a;
          --light-bg: #f8f9fa;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --info: #06b6d4;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
        }

        /* Reset et base */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          background-color: var(--white);
          color: var(--secondary);
          line-height: 1.6;
          font-size: 14px;
        }

        /* Layout principal */
        .schoolhub-platform {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Header */
        .app-header {
          background: linear-gradient(135deg, var(--dark) 0%, var(--secondary) 100%);
          color: var(--white);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(45, 50, 80, 0.15);
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
          background: var(--accent);
          color: var(--dark);
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          box-shadow: 0 4px 8px rgba(248, 177, 122, 0.3);
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -0.5px;
        }

        .logo-subtext {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .header-center {
          flex: 1;
          text-align: center;
        }

        .platform-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--white);
        }

        .platform-subtitle {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
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
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: var(--accent);
          color: var(--dark);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
        }

        .user-avatar svg {
          width: 20px;
          height: 20px;
          color: var(--dark);
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .notification-bell {
          position: relative;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.2s;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-bell:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .notification-bell svg {
          width: 20px;
          height: 20px;
          color: var(--white);
        }

        .notification-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--accent);
          color: var(--dark);
          font-size: 0.75rem;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          border: 2px solid var(--dark);
        }

        .btn.logout {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--white);
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn.logout:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .btn.logout svg {
          width: 16px;
          height: 16px;
        }

        /* Conteneur principal */
        .app-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: var(--dark);
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 12px rgba(45, 50, 80, 0.1);
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
          border-left: 4px solid transparent;
          margin: 0.25rem 0;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .nav-menu li:hover {
          background: rgba(103, 111, 212, 0.1);
          color: var(--white);
          border-left-color: var(--primary);
        }

        .nav-menu li.active {
          background: linear-gradient(90deg, rgba(103, 111, 212, 0.2) 0%, rgba(103, 111, 212, 0.1) 100%);
          color: var(--white);
          border-left-color: var(--accent);
          font-weight: 600;
        }

        .nav-icon {
          margin-right: 0.875rem;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-icon svg {
          width: 100%;
          height: 100%;
          color: currentColor;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(45, 50, 80, 0.9);
        }

        .current-class-widget {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .widget-title {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .class-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .class-name {
          font-weight: 700;
          color: var(--white);
          font-size: 1.1rem;
        }

        .class-change {
          color: var(--accent);
          font-size: 0.875rem;
          cursor: pointer;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .class-change:hover {
          background: rgba(248, 177, 122, 0.1);
        }

        /* Contenu principal */
        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background: var(--light-bg);
        }

        .coming-soon {
          background: var(--white);
          border-radius: 16px;
          padding: 4rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(45, 50, 80, 0.08);
          border: 1px solid var(--gray-200);
        }

        .coming-soon h2 {
          margin-bottom: 1rem;
          color: var(--secondary);
          font-size: 2rem;
          font-weight: 700;
        }

        .coming-soon p {
          color: var(--gray-500);
          font-size: 1.1rem;
        }

        /* Dashboard */
        .dashboard h2 {
          margin-bottom: 1.5rem;
          color: var(--secondary);
          font-size: 1.75rem;
          font-weight: 700;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--white);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(45, 50, 80, 0.08);
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border: 1px solid var(--gray-200);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(45, 50, 80, 0.12);
          border-color: var(--primary);
        }

        .stat-card.warning {
          border-left: 5px solid var(--warning);
        }

        .stat-card.info {
          border-left: 5px solid var(--info);
        }

        .stat-card.success {
          border-left: 5px solid var(--success);
        }

        .stat-card:not(.warning):not(.info):not(.success) {
          border-left: 5px solid var(--primary);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary) 0%, #858bff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
        }

        .stat-card.warning .stat-icon {
          background: linear-gradient(135deg, var(--warning) 0%, #fbbf24 100%);
        }

        .stat-card.info .stat-icon {
          background: linear-gradient(135deg, var(--info) 0%, #22d3ee 100%);
        }

        .stat-card.success .stat-icon {
          background: linear-gradient(135deg, var(--success) 0%, #34d399 100%);
        }

        .stat-icon svg {
          width: 24px;
          height: 24px;
          color: var(--white);
        }

        .stat-content {
          flex: 1;
        }

        .stat-card h3 {
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--secondary);
          margin-bottom: 0.25rem;
          line-height: 1;
        }

        .stat-subtitle {
          font-size: 0.875rem;
          color: var(--gray-500);
          font-weight: 500;
        }

        .quick-actions {
          background: var(--white);
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(45, 50, 80, 0.08);
          margin-bottom: 2rem;
          border: 1px solid var(--gray-200);
        }

        .quick-actions h3 {
          margin-bottom: 1.5rem;
          color: var(--secondary);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-family: inherit;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn.primary {
          background: linear-gradient(135deg, var(--primary) 0%, #858bff 100%);
          color: var(--white);
        }

        .btn.primary:hover {
          background: linear-gradient(135deg, #5c63d2 0%, #747aff 100%);
        }

        .btn.secondary {
          background: linear-gradient(135deg, var(--secondary) 0%, #5a5f8a 100%);
          color: var(--white);
        }

        .btn.secondary:hover {
          background: linear-gradient(135deg, #3a3f61 0%, #4a4f7a 100%);
        }

        .btn.success {
          background: linear-gradient(135deg, var(--success) 0%, #34d399 100%);
          color: var(--white);
        }

        .btn.success:hover {
          background: linear-gradient(135deg, #0da271 0%, #2bbf8a 100%);
        }

        .btn.warning {
          background: linear-gradient(135deg, var(--warning) 0%, #fbbf24 100%);
          color: var(--white);
        }

        .btn.warning:hover {
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
        }

        .btn.info {
          background: linear-gradient(135deg, var(--info) 0%, #22d3ee 100%);
          color: var(--white);
        }

        .btn.info:hover {
          background: linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%);
        }

        .btn.small {
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          border-radius: 8px;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon svg {
          width: 16px;
          height: 16px;
        }

        .recent-activity {
          background: var(--white);
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(45, 50, 80, 0.08);
          margin-bottom: 2rem;
          border: 1px solid var(--gray-200);
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .recent-activity h3 {
          color: var(--secondary);
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .activity-count {
          font-size: 0.875rem;
          color: var(--gray-500);
          background: var(--gray-100);
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 12px;
          background: var(--gray-100);
          border: 1px solid var(--gray-200);
          transition: all 0.2s;
        }

        .activity-item:hover {
          background: var(--white);
          border-color: var(--primary);
        }

        .activity-item.warning {
          border-left: 4px solid var(--warning);
          background: #fef3c7;
        }

        .activity-item.info {
          border-left: 4px solid var(--info);
          background: #cffafe;
        }

        .activity-item.success {
          border-left: 4px solid var(--success);
          background: #d1fae5;
        }

        .activity-item.read {
          opacity: 0.6;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .activity-icon svg {
          width: 18px;
          height: 18px;
          color: currentColor;
        }

        .activity-content {
          flex: 1;
        }

        .activity-message {
          font-weight: 500;
          margin-bottom: 0.25rem;
          color: var(--gray-700);
        }

        .activity-time {
          font-size: 0.875rem;
          color: var(--gray-500);
          font-weight: 500;
        }

        .students-alert {
          background: var(--white);
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(45, 50, 80, 0.08);
          border: 1px solid var(--gray-200);
        }

        .students-alert h3 {
          margin-bottom: 1.5rem;
          color: var(--secondary);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .students-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .student-alert-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background: linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%);
          border-radius: 12px;
          border: 1px solid #fed7aa;
          border-left: 4px solid var(--warning);
          transition: all 0.2s;
        }

        .student-alert-card:hover {
          transform: translateX(4px);
          border-color: var(--warning);
        }

        .student-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .student-name {
          font-weight: 600;
          color: var(--gray-800);
          font-size: 1rem;
        }

        .student-details {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .badge {
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .badge.warning {
          background: var(--warning);
          color: var(--white);
        }

        .student-class {
          font-size: 0.875rem;
          color: var(--gray-600);
          font-weight: 500;
        }

        .student-actions .btn.small {
          background: var(--white);
          color: var(--secondary);
          border: 1px solid var(--gray-300);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .student-actions .btn.small:hover {
          background: var(--primary);
          color: var(--white);
          border-color: var(--primary);
        }

        .student-actions .btn.small svg {
          width: 14px;
          height: 14px;
        }

        .no-alert {
          text-align: center;
          padding: 3rem;
          color: var(--gray-500);
        }

        .no-alert svg {
          width: 48px;
          height: 48px;
          color: var(--success);
          margin-bottom: 1rem;
        }

        .no-alert p {
          font-weight: 500;
          font-size: 1rem;
          color: var(--gray-600);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .action-buttons {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .nav-menu {
            display: flex;
            overflow-x: auto;
            padding: 0;
            white-space: nowrap;
          }
          
          .nav-menu li {
            padding: 1rem 1.25rem;
            white-space: nowrap;
            border-left: none;
            border-bottom: 3px solid transparent;
            flex-shrink: 0;
          }
          
          .nav-menu li.active {
            border-left: none;
            border-bottom-color: var(--accent);
          }
          
          .nav-menu li:hover {
            border-left: none;
            border-bottom-color: var(--primary);
          }
          
          .sidebar-footer {
            display: none;
          }
          
          .main-content {
            padding: 1.25rem;
          }
          
          .stats-container {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            grid-template-columns: 1fr;
          }
          
          .app-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          
          .header-left, .header-center, .header-right {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
          
          .logo {
            justify-content: center;
          }
          
          .user-info {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .stat-card {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .stat-icon {
            width: 48px;
            height: 48px;
          }
          
          .stat-icon svg {
            width: 20px;
            height: 20px;
          }
          
          .btn {
            padding: 0.625rem 1.25rem;
            font-size: 0.8125rem;
          }
          
          .activity-item {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }
          
          .student-alert-card {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .student-details {
            justify-content: center;
          }
        }
      `}</style>

      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">SH</div>
            <div>
              <div className="logo-text">SchoolHub</div>
              <div className="logo-subtext">Gestion Scolaire Intelligente</div>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="platform-title">Plateforme de Gestion de Présence</div>
          <div className="platform-subtitle">Système Éducatif SchoolHub</div>
        </div>
        
        <div className="header-right">
          <div className="notification-bell" title="Notifications">
            <BellIcon />
            {unreadNotifications > 0 && (
              <span className="notification-count">{unreadNotifications}</span>
            )}
          </div>
          
          <div className="user-info">
            <div className="user-avatar">
              <UserIcon />
            </div>
            <div className="user-details">
              <div className="user-name">M. Adébayo</div>
              <div className="user-role">Professeur Principal</div>
            </div>
          </div>
          
          <button className="btn logout">
            <LogoutIcon /> Déconnexion
          </button>
        </div>
      </header>

      <div className="app-container">
        <nav className="sidebar">
          <ul className="nav-menu">
            <li 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon"><DashboardIcon /></span>
              Tableau de bord
            </li>
            <li 
              className={activeTab === 'attendance' ? 'active' : ''}
              onClick={() => setActiveTab('attendance')}
            >
              <span className="nav-icon"><AttendanceIcon /></span>
              Marquage présence
            </li>
            <li 
              className={activeTab === 'courses' ? 'active' : ''}
              onClick={() => setActiveTab('courses')}
            >
              <span className="nav-icon"><CoursesIcon /></span>
              Gestion des cours
            </li>
            <li 
              className={activeTab === 'permissions' ? 'active' : ''}
              onClick={() => setActiveTab('permissions')}
            >
              <span className="nav-icon"><PermissionsIcon /></span>
              Demandes permission
            </li>
            <li 
              className={activeTab === 'reports' ? 'active' : ''}
              onClick={() => setActiveTab('reports')}
            >
              <span className="nav-icon"><ReportsIcon /></span>
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
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'attendance' && (
            <div className="coming-soon">
              <h2>Marquage de Présence</h2>
              <p>Cette fonctionnalité sera disponible prochainement.</p>
            </div>
          )}
          {activeTab === 'courses' && (
            <div className="coming-soon">
              <h2>Gestion des Cours</h2>
              <p>Cette fonctionnalité sera disponible prochainement.</p>
            </div>
          )}
          {activeTab === 'permissions' && (
            <div className="coming-soon">
              <h2>Demandes de Permission</h2>
              <p>Cette fonctionnalité sera disponible prochainement.</p>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="coming-soon">
              <h2>Rapports</h2>
              <p>Cette fonctionnalité sera disponible prochainement.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default SchoolHub;
