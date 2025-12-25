import React, { useState, useEffect } from 'react';

// Import du composant Permissions
import Permissions from './Permissions';

// Composant Dashboard Principal
function Dashboard({ activeTab, setActiveTab }) {
  const [userInfo, setUserInfo] = useState({
    name: 'M. Diallo',
    role: 'Professeur Principal',
    avatar: 'MD'
  });
  const [notifications, setNotifications] = useState([]);
  const [currentClass, setCurrentClass] = useState('Terminale A');

  useEffect(() => {
    fetchUserInfo();
    fetchNotifications();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error('Erreur de récupération des données utilisateur:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Erreur de récupération des notifications:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
    { id: 'attendance', icon: '✓', label: 'Marquage présence' },
    { id: 'courses', icon: '📚', label: 'Gestion des cours' },
    { id: 'permissions', icon: '📋', label: 'Demandes permission' },
    { id: 'reports', icon: '📈', label: 'Rapports' }
  ];

  // Fonction pour afficher le contenu selon l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ padding: '2rem' }}>
            <h1>Tableau de bord</h1>
            <p>Bienvenue sur votre tableau de bord</p>
          </div>
        );
      case 'attendance':
        return (
          <div style={{ padding: '2rem' }}>
            <h1>Marquage de présence</h1>
            <p>Section en cours de développement</p>
          </div>
        );
      case 'courses':
        return (
          <div style={{ padding: '2rem' }}>
            <h1>Gestion des cours</h1>
            <p>Section en cours de développement</p>
          </div>
        );
      case 'permissions':
        return <Permissions />;
      case 'reports':
        return (
          <div style={{ padding: '2rem' }}>
            <h1>Rapports</h1>
            <p>Section en cours de développement</p>
          </div>
        );
      default:
        return (
          <div style={{ padding: '2rem' }}>
            <h1>Page non trouvée</h1>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background-color: #f5f5f5;
          color: #2d3250;
        }

        .dashboard-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .app-header {
          background-color: #2d3250;
          color: #fff;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
          background-color: #f8b179;
          color: #2d3250;
          width: 45px;
          height: 45px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .logo-subtext {
          font-size: 0.75rem;
          opacity: 0.8;
          font-weight: 400;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .notification-bell {
          position: relative;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          transition: background 0.2s;
        }

        .notification-bell:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .notification-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #f8b179;
          color: #2d3250;
          font-size: 0.7rem;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .user-avatar {
          width: 38px;
          height: 38px;
          background: #f8b179;
          color: #2d3250;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
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
          opacity: 0.8;
        }

        .btn-logout {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .btn-logout:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .main-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .sidebar {
          width: 260px;
          background-color: #fff;
          border-right: 1px solid #e5e5e5;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
        }

        .nav-menu {
          list-style: none;
          padding: 1.5rem 0;
          flex: 1;
        }

        .nav-item {
          padding: 0.875rem 1.5rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
          margin: 0.25rem 0;
          font-weight: 500;
          color: #666;
        }

        .nav-item:hover {
          background-color: #f5f5f5;
          color: #2d3250;
        }

        .nav-item.active {
          background-color: rgba(248, 177, 121, 0.1);
          color: #2d3250;
          border-left-color: #f8b179;
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
          border-top: 1px solid #e5e5e5;
          background-color: #fafafa;
        }

        .class-widget {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 1rem;
        }

        .widget-title {
          font-size: 0.75rem;
          color: #666;
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
          color: #2d3250;
          font-size: 0.95rem;
        }

        .class-change {
          color: #f8b179;
          font-size: 0.8rem;
          cursor: pointer;
          font-weight: 500;
        }

        .class-change:hover {
          text-decoration: underline;
        }

        .content-area {
          flex: 1;
          overflow-y: auto;
          background-color: #f5f5f5;
        }

        @media (max-width: 768px) {
          .main-container {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e5e5e5;
          }

          .nav-menu {
            display: flex;
            overflow-x: auto;
            padding: 0;
          }

          .nav-item {
            padding: 1rem;
            white-space: nowrap;
            border-left: none;
            border-bottom: 3px solid transparent;
          }

          .nav-item.active {
            border-left: none;
            border-bottom-color: #f8b179;
          }

          .sidebar-footer {
            display: none;
          }

          .header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .app-header {
            padding: 1rem;
          }
        }
      `}</style>

      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">SH</div>
            <div>
              <div className="logo-text">School Hub</div>
              <div className="logo-subtext">Gestion de Présence</div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="notification-bell" title="Notifications">
            <span>🔔</span>
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </div>

          <div className="user-info">
            <div className="user-avatar">{userInfo.avatar}</div>
            <div className="user-details">
              <div className="user-name">{userInfo.name}</div>
              <div className="user-role">{userInfo.role}</div>
            </div>
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="main-container">
        <nav className="sidebar">
          <ul className="nav-menu">
            {menuItems.map(item => (
              <li
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>

          <div className="sidebar-footer">
            <div className="class-widget">
              <div className="widget-title">Classe actuelle</div>
              <div className="class-display">
                <div className="class-name">{currentClass}</div>
                <div
                  className="class-change"
                  onClick={() => {
                    const classes = ['Terminale A', 'Terminale B', 'Première A', 'Seconde A'];
                    const currentIndex = classes.indexOf(currentClass);
                    setCurrentClass(classes[(currentIndex + 1) % classes.length]);
                  }}
                >
                  Changer
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
}

export default App;