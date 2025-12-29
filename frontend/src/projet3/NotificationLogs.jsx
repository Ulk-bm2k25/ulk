import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const NotificationLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_notifications.php`)
            .then(res => res.json())
            .then(setLogs);
    }, []);

    return (
        <div className="slide-up">
            <header style={{ marginBottom: '48px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Journal des Alertes</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Traçabilité complète des communications avec les familles.</p>
            </header>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Instantané</th>
                            <th style={styles.th}>Interlocuteur</th>
                            <th style={styles.th}>Canal</th>
                            <th style={styles.th}>Contenu du Message</th>
                            <th style={styles.th}>État</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? logs.map((log, i) => (
                            <tr key={i} style={styles.tr}>
                                <td style={{ ...styles.td, fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                    {new Date(log.date_envoi).toLocaleString()}
                                </td>
                                <td style={{ ...styles.td, fontWeight: '700' }}>{log.nom} {log.prenom}</td>
                                <td style={styles.td}>
                                    <div style={{
                                        ...styles.badgeType,
                                        background: log.type === 'MAIL' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(39, 174, 96, 0.1)',
                                        color: log.type === 'MAIL' ? '#3498db' : '#27ae60'
                                    }}>
                                        {log.type}
                                    </div>
                                </td>
                                <td style={{ ...styles.td, fontSize: '0.9rem', color: 'var(--text-dim)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {log.message}
                                </td>
                                <td style={styles.td}>
                                    <div style={{ ...styles.statusDot, background: log.statut === 'ENVOYE' ? 'var(--success)' : 'var(--warning)' }}></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{log.statut}</span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', opacity: 0.5 }}>Aucune transmission archivée.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { backgroundColor: 'rgba(255,255,255,0.03)' },
    th: { padding: '24px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--glass-border)' },
    tr: { borderBottom: '1px solid var(--glass-border)', transition: 'var(--transition-smooth)' },
    td: { padding: '24px' },
    badgeType: { padding: '6px 14px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', display: 'inline-block', letterSpacing: '1px' },
    statusDot: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '10px', boxShadow: '0 0 10px currentColor' }
};

export default NotificationLogs;
