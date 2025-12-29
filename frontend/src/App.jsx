import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, GraduationCap, ClipboardList, Calendar } from 'lucide-react';

const App = () => {
  const navigate = useNavigate();
  const [hoveredPortal, setHoveredPortal] = useState(null);

  const portals = [
    {
      id: 1,
      title: "Inscription & Réinscription",
      description: "Gestion des inscriptions et réinscriptions des élèves",
      icon: UserPlus,
      path: "/admin",
      features: ["Nouveaux élèves", "Réinscriptions", "Dossiers"]
    },
    {
      id: 2,
      title: "Gestion de la Scolarité",
      description: "Administration de la scolarité et des programmes",
      icon: GraduationCap,
      path: "/gestion-scolarite",
      features: ["Classes", "Emplois du temps", "Paiements"]
    },
    {
      id: 3,
      title: "Gestion des Notes",
      description: "Évaluation et suivi des performances académiques",
      icon: ClipboardList,
      path: "/notes",
      features: ["Saisie notes", "Bulletins", "Statistiques"]
    },
    {
      id: 4,
      title: "Gestion des Présences",
      description: "Suivi et contrôle de l'assiduité des élèves",
      icon: Calendar,
      path: "/vie-scolaire",
      features: ["Pointage", "Absences", "Rapports"]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2d3250 0%, #363b5c 50%, #2d3250 100%)',
      padding: '3rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #f8b179 0%, #ff9a56 100%)',
          color: 'white',
          borderRadius: '1rem',
          padding: '1rem 2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 20px 60px rgba(248, 177, 121, 0.3)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: 0,
            letterSpacing: '-0.02em',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            School-Hub
          </h1>
        </div>
        <p style={{
          color: '#cbd5e1',
          fontSize: '1.25rem',
          margin: '0.5rem 0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Système de gestion scolaire intégré
        </p>
        <p style={{
          color: '#94a3b8',
          fontSize: '0.875rem',
          margin: '0.5rem 0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Sélectionnez un portail pour commencer
        </p>
      </div>

      {/* Grille des portails */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        {portals.map((portal) => {
          const Icon = portal.icon;
          const isHovered = hoveredPortal === portal.id;

          return (
            <div
              key={portal.id}
              onMouseEnter={() => setHoveredPortal(portal.id)}
              onMouseLeave={() => setHoveredPortal(null)}
            >
              <button
                onClick={() => navigate(portal.path)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: isHovered ? '1px solid rgba(248, 177, 121, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isHovered ? '0 20px 60px rgba(248, 177, 121, 0.2)' : 'none'
                }}
              >
                {/* Icône et titre */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f8b179 0%, #ff9a56 100%)',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isHovered ? 'scale(1.1) rotate(3deg)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <Icon style={{ width: '2rem', height: '2rem', color: 'white' }} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: isHovered ? '#f8b179' : 'white',
                      marginBottom: '0.5rem',
                      transition: 'color 0.3s ease',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      {portal.title}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#94a3b8',
                      lineHeight: '1.5',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      {portal.description}
                    </p>
                  </div>
                </div>

                {/* Fonctionnalités */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {portal.features.map((feature, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        background: '#f8b179',
                        borderRadius: '50%'
                      }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#cbd5e1', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Bouton d'action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <span style={{
                    color: '#f8b179',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'transform 0.3s ease'
                  }}>
                    Accéder au portail
                  </span>
                  <svg
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      color: '#f8b179',
                      transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                      transition: 'transform 0.3s ease'
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '4rem',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{ fontSize: '0.875rem', color: '#64748b', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          © 2025 School-Hub Management System. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default App;
