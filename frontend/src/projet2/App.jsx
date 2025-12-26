import React from 'react';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import './styles/notification.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>School-HUB Notifications</h1>
        {/* NotificationCenter contient déjà NotificationBell */}
        <NotificationCenter />
      </header>
      
      <main>
        <div className="container">
          <h2>Bienvenue dans le système de gestion</h2>
          <p>Vos notifications s'affichent en haut à droite.</p>
        </div>
      </main>
    </div>
  );
}

export default App;