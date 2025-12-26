import React from "react";
import Dashboard from "./projet4/Dashboard";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import projet1Routes from './projet1/projet1Routes.jsx';


// Simple Landing Page for development
const Home = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#1a2035] text-white">
    <div className="max-w-md w-full glass-card p-10 text-center space-y-8">
      {/* ... Le reste du contenu Home est parfait ... */}
      <div className="w-20 h-20 bg-[#eb8e3a] rounded-2xl flex items-center justify-center mx-auto text-[#1a2035]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      </div>
      <h1 className="text-4xl font-black">School<span className="text-[#eb8e3a]">Hub</span></h1>
      <p className="text-white/40">Bienvenue sur la plateforme de gestion scolaire.</p>

      <div className="space-y-4 pt-4">
        {/* Ces Links fonctionneront maintenant */}
        <Link
          to="/projet1-parent"
          className="block w-full py-4 px-6 bg-[#eb8e3a] text-[#1a2035] font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-orange-950/20"
        >
          Accéder à l'Espace Parent
        </Link>
        <Link
          to="/projet1"
          className="block w-full py-4 px-6 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5"
        >
          Portail Administration
        </Link>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
import { useState, useEffect } from 'react';
import ApiService from './utils/api';

function App() {
    const [remboursements, setRemboursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistiques, setStatistiques] = useState({});

    // Charger les données
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Test de connexion API
            const test = await ApiService.testConnection();
            console.log('API Test:', test);

            // Charger les remboursements
            const result = await ApiService.getRemboursements({
                statut: 'tous',
                per_page: 50
            });

            if (result.success) {
                setRemboursements(result.data.data);
                setStatistiques(result.data.statistiques);
            } else {
                setError(result.message);
            }

            // Charger les statistiques
            const stats = await ApiService.getStatistiques();
            if (stats.success) {
                setStatistiques(stats.data);
            }

        } catch (err) {
            setError('Erreur de connexion au serveur');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatut = async (id, newStatut) => {
        try {
            const result = await ApiService.changeStatut(id, newStatut);
            
            if (result.success) {
                // Mettre à jour localement
                setRemboursements(prev => 
                    prev.map(item => 
                        item.id === id ? result.data : item
                    )
                );
                alert('Statut mis à jour avec succès');
            } else {
                alert('Erreur: ' + result.message);
            }
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        }
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(montant);
    };

    if (loading) {
        return React.createElement('div', { className: 'loading' },
            React.createElement('div', null, 'Chargement des données...')
        );
    }

    if (error) {
        return React.createElement('div', { className: 'error' },
            React.createElement('h2', null, 'Erreur'),
            React.createElement('p', null, error),
            React.createElement('button', { onClick: loadData }, 'Réessayer')
        );
    }

    return React.createElement('div', { className: 'app' },
        // En-tête
        React.createElement('header', null,
            React.createElement('h1', null, 'Gestion des Remboursements'),
            React.createElement('div', { className: 'stats' },
                React.createElement('div', { className: 'stat' },
                    React.createElement('span', null, 'Total:'),
                    React.createElement('strong', null, statistiques.total || 0)
                ),
                React.createElement('div', { className: 'stat' },
                    React.createElement('span', null, 'Montant total:'),
                    React.createElement('strong', null, formatMontant(statistiques.montant_total || 0))
                )
            )
        ),

        // Tableau
        React.createElement('table', null,
            React.createElement('thead', null,
                React.createElement('tr', null,
                    ['N° Dossier', 'Étudiant', 'Montant', 'Motif', 'Date', 'Statut', 'Actions'].map(header =>
                        React.createElement('th', { key: header }, header)
                    )
                )
            ),
            React.createElement('tbody', null,
                remboursements.map(item =>
                    React.createElement('tr', { key: item.id },
                        React.createElement('td', null, item.numero_dossier),
                        React.createElement('td', null,
                            React.createElement('div', null,
                                React.createElement('strong', null, item.etudiant?.nom_complet),
                                React.createElement('small', null, item.etudiant?.matricule)
                            )
                        ),
                        React.createElement('td', null, formatMontant(item.montant)),
                        React.createElement('td', null, item.motif_label),
                        React.createElement('td', null, new Date(item.date_demande).toLocaleDateString()),
                        React.createElement('td', null,
                            React.createElement('span', {
                                className: `status status-${item.statut}`
                            }, item.statut_label)
                        ),
                        React.createElement('td', null,
                            item.statut === 'en_attente' && React.createElement('div', null,
                                React.createElement('button', {
                                    className: 'btn btn-success',
                                    onClick: () => handleChangeStatut(item.id, 'approuve')
                                }, 'Approuver'),
                                React.createElement('button', {
                                    className: 'btn btn-danger',
                                    onClick: () => handleChangeStatut(item.id, 'refuse')
                                }, 'Refuser')
                            ),
                            React.createElement('button', {
                                className: 'btn btn-info',
                                onClick: () => alert(`Détails: ${item.numero_dossier}`)
                            }, 'Détails')
                        )
                    )
                )
            )
        ),

        // Formulaire de nouveau remboursement (simplifié)
        React.createElement('div', { className: 'new-remboursement' },
            React.createElement('h2', null, 'Nouveau Remboursement'),
            React.createElement('button', {
                className: 'btn btn-primary',
                onClick: () => {
                    // Ouvrir formulaire modal
                    const etudiantId = prompt('ID Étudiant:');
                    const paiementId = prompt('ID Paiement:');
                    const montant = prompt('Montant:');
                    const motif = prompt('Motif:');
                    
                    if (etudiantId && paiementId && montant && motif) {
                        ApiService.createRemboursement({
                            etudiant_id: parseInt(etudiantId),
                            paiement_id: parseInt(paiementId),
                            montant: parseFloat(montant),
                            motif: motif
                        }).then(result => {
                            if (result.success) {
                                alert('Remboursement créé!');
                                loadData();
                            } else {
                                alert('Erreur: ' + result.message);
                            }
                        });
                    }
                }
            }, 'Créer un nouveau remboursement')
        )
    );
}

// Styles
const styles = `
    .app {
        padding: 20px;
        font-family: Arial, sans-serif;
    }
    
    header {
        background: #1976d2;
        color: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    
    .stats {
        display: flex;
        gap: 20px;
        margin-top: 10px;
    }
    
    .stat {
        background: rgba(255,255,255,0.2);
        padding: 10px 20px;
        border-radius: 4px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    
    th {
        background: #f5f5f5;
        font-weight: bold;
    }
    
    .status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .status-en_attente {
        background: #ff9800;
        color: white;
    }
    
    .status-approuve {
        background: #4caf50;
        color: white;
    }
    
    .status-refuse {
        background: #f44336;
        color: white;
    }
    
    .btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
    }
    
    .btn-success {
        background: #4caf50;
        color: white;
    }
    
    .btn-danger {
        background: #f44336;
        color: white;
    }
    
    .btn-info {
        background: #2196f3;
        color: white;
    }
    
    .btn-primary {
        background: #1976d2;
        color: white;
        padding: 10px 20px;
    }
    
    .new-remboursement {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
    }
    
    .loading, .error {
        padding: 40px;
        text-align: center;
    }
    
    .error {
        color: #d32f2f;
    }
`;

// Ajouter les styles au document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);



export default App
