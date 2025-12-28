import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const styles = {
    header: {
        marginBottom: '40px',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '900',
        color: 'var(--secondary)',
        marginBottom: '8px',
    },
    subtitle: {
        color: 'var(--text-dim)',
        fontSize: '1rem',
    },
    widgetRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
    },
    widget: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px',
        borderRadius: '12px',
    },
    widgetValue: {
        fontSize: '2rem',
        fontWeight: '900',
        color: 'var(--secondary)',
        marginBottom: '4px'
    },
    widgetLabel: {
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--text-dim)',
        fontWeight: '700',
    },
    podium: {
        display: 'flex',
        gap: '4px',
        fontSize: '1.2rem',
        marginBottom: '4px'
    },
    'dashboard-grid': {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginTop: '20px'
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '24px',
        textDecoration: 'none',
    },
    iconWrapper: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: '1.5rem',
    },
    content: {
        flex: 1,
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '4px',
        color: 'var(--secondary)',
    },
    cardDesc: {
        fontSize: '0.85rem',
        color: 'var(--text-dim)',
        lineHeight: '1.4',
    }
};

const DashboardCard = ({ to, icon, title, desc, color }) => (
    <Link to={to} className="glass-card" style={styles.card}>
        <div style={{ ...styles.iconWrapper, backgroundColor: `${color}15` }}>
            <span style={{ ...styles.icon, color: color }}>{icon}</span>
        </div>
        <div style={styles.content}>
            <h3 style={styles.cardTitle}>{title}</h3>
            <p style={styles.cardDesc}>{desc}</p>
        </div>
    </Link>
);

const ValidationSection = () => {
    const [notes, setNotes] = React.useState([]);

    const fetchPending = () => {
        fetch(`${API_BASE_URL}/get_notes_en_attente.php`)
            .then(res => res.json())
            .then(setNotes);
    };

    React.useEffect(() => {
        fetchPending();
    }, []);

    const handleValidate = (id) => {
        const formData = new FormData();
        formData.append('id', id);

        fetch(`${API_BASE_URL}/valider_note.php`, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Note validée !');
                    fetchPending();
                    window.location.reload();
                } else {
                    alert('Erreur: ' + data.error);
                }
            });
    };

    const handleApproveAll = () => {
        if (!window.confirm("Voulez-vous vraiment approuver TOUTES les notes en attente ?")) return;

        fetch(`${API_BASE_URL}/valider_toutes_les_notes.php`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    fetchPending();
                    window.location.reload();
                } else {
                    alert('Erreur: ' + data.error);
                }
            });
    };

    return (
        <div className="glass-card" style={{ marginBottom: '40px', borderLeft: '4px solid var(--warning)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>⚠️</span> Validation en attente
                </h3>
                {notes.length > 0 && (
                    <button
                        onClick={handleApproveAll}
                        className="btn-premium"
                        style={{ backgroundColor: '#10b981', fontSize: '0.75rem', padding: '8px 16px' }}
                    >
                        ✅ APPROUVER TOUT
                    </button>
                )}
            </div>

            {notes.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                    ✅ Toutes les notes ont été traitées. Aucune validation en attente.
                </div>
            ) : (
                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px' }}>Élève</th>
                                <th>Matière</th>
                                <th>Type</th>
                                <th>Note</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notes.map(n => (
                                <tr key={n.id}>
                                    <td style={{ padding: '14px 12px', fontWeight: '600' }}>{n.nom} {n.prenom}</td>
                                    <td>{n.matiere}</td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: n.type_evaluation === 'DEVOIR' ? '#dbeafe' : '#fef3c7',
                                            color: n.type_evaluation === 'DEVOIR' ? '#1e40af' : '#92400e'
                                        }}>
                                            {n.type_evaluation === 'DEVOIR' ? 'D' : 'I'}{n.numero_evaluation}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: '800', color: 'var(--secondary)' }}>{n.valeur}/20</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleValidate(n.id)}
                                            className="btn-premium"
                                            style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                                        >
                                            APPROUVER
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const DashboardNotes = () => {
    const [stats, setStats] = React.useState({ taux_reussite: 0, nb_brouillons: 0, top_eleves: [] });
    const [user, setUser] = React.useState(null);
    const [showPodium, setShowPodium] = React.useState(false);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        fetch(`${API_BASE_URL}/get_dashboard_stats.php`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStats(data);
            });
    }, []);

    const isAdmin = user?.role === 'RESPONSABLE' || user?.role === 'ADMIN';

    return (
        <div className="slide-up">
            <header style={styles.header}>
                <h1 style={styles.title}>Cockpit Décisionnel</h1>
                <p style={styles.subtitle}>{isAdmin ? "Pilotez votre établissement avec précision et élégance." : "Gérez vos classes et vos notes simplement."}</p>
            </header>

            {}
            <div style={styles.widgetRow}>
                <div className="glass-card" style={{ ...styles.widget, borderLeft: '4px solid var(--primary)' }}>
                    <span style={styles.widgetValue}>{stats.taux_reussite}%</span>
                    <span style={styles.widgetLabel}>Taux de Réussite Global</span>
                </div>
                {isAdmin && (
                    <div className="glass-card" style={{ ...styles.widget, borderLeft: '4px solid var(--danger)' }}>
                        <span style={{ ...styles.widgetValue, color: 'var(--danger)' }}>{stats.nb_brouillons}</span>
                        <span style={styles.widgetLabel}>Notes en Attente (Brouillons)</span>
                    </div>
                )}
                <div
                    className="glass-card"
                    style={{ ...styles.widget, borderLeft: '4px solid #10b981', cursor: 'pointer', position: 'relative' }}
                    onMouseEnter={() => setShowPodium(true)}
                    onMouseLeave={() => setShowPodium(false)}
                >
                    <div style={styles.podium}>
                        {stats.top_eleves.length > 0 ? stats.top_eleves.map((e, i) => (
                            <span key={i} style={{ fontSize: i === 0 ? '1.8rem' : '1.4rem' }}>
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                            </span>
                        )) : <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Pas de données</span>}
                    </div>
                    <span style={styles.widgetLabel}>Podium Excellence (Top 3)</span>

                    {}
                    {showPodium && stats.top_eleves.length > 0 && (
                        <div className="glass-card slide-up" style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            right: '0',
                            marginTop: '10px',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                            padding: '16px',
                            zIndex: 100,
                            border: '1px solid #e2e8f0'
                        }}>
                            <h4 style={{ fontSize: '0.7rem', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                🏆 TOP MOYENNES
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {stats.top_eleves.map((e, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>{e.prenom} {e.nom}</span>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                            {parseFloat(e.moyenne).toFixed(3)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div >

            {isAdmin && <ValidationSection />}

            <div style={styles['dashboard-grid']}>
                {!isAdmin && <DashboardCard to="/notes/saisie" icon="📝" title="Saisir Note" desc="Notes par classe & matière." color="#6366f1" />}
                {!isAdmin && <DashboardCard to="/notes" icon="⚡" title="Soumettre Note" desc="Validez vos brouillons." color="#3b82f6" />}
                {!isAdmin && <DashboardCard to="/notes/matieres" icon="📊" title="Consulter Classe" desc="Analyse des résultats." color="#8b5cf6" />}

                {isAdmin && <DashboardCard to="/bulletins" icon="📜" title="Générer Bulletin" desc="Génération officielle." color="#f59e0b" />}
                {isAdmin && <DashboardCard to="/stats" icon="📈" title="Consulter Statistiques" desc="Statistiques et tendances." color="#10b981" />}
                {isAdmin && <DashboardCard to="/deliberation" icon="⚖️" title="Délibération" desc="Décisions de fin de cycle." color="#ef4444" />}
            </div>
        </div >
    );
};

export default DashboardNotes;
