import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Statistiques = () => {
    const [stats, setStats] = useState([]);
    const [summary, setSummary] = useState(null);
    const [classes, setClasses] = useState([]);
    const [semestres, setSemestres] = useState([]);
    const [selectedClasse, setSelectedClasse] = useState('');
    const [selectedSemestre, setSelectedSemestre] = useState('');

    const [type, setType] = useState('semestre');

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_classes.php`).then(res => res.json()).then(setClasses);
        fetch(`${API_BASE_URL}/get_semestres.php`).then(res => res.json()).then(setSemestres);
    }, []);

    const fetchStats = () => {
        if (type === 'semestre' && !selectedSemestre) {
            alert("Veuillez choisir un semestre.");
            return;
        }
        let url = `${API_BASE_URL}/get_statistiques_eleves.php?type=${type}`;
        if (selectedClasse) url += `&classe_id=${selectedClasse}`;
        if (type === 'semestre') url += `&semestre_id=${selectedSemestre}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    setStats(data.eleves || []);
                    setSummary(data.summary || null);
                }
            });
    };

    return (
        <div className="slide-up">
            <header style={{ marginBottom: '48px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Classement & Résultats</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Suivez les performances individuelles et les admissions.</p>
            </header>

            <div className="glass-card" style={{ ...styles.filterBar, flexDirection: window.innerWidth <= 768 ? 'column' : 'row', alignItems: window.innerWidth <= 768 ? 'stretch' : 'flex-end' }}>
                <div style={{ ...styles.filterGroup, flexDirection: window.innerWidth <= 768 ? 'column' : 'row' }}>
                    <div style={styles.field}>
                        <label style={styles.label}>Période</label>
                        <select value={type} onChange={e => setType(e.target.value)} style={styles.input}>
                            <option value="semestre">Semestriel</option>
                            <option value="annuel">Annuel</option>
                        </select>
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Classe</label>
                        <select value={selectedClasse} onChange={e => setSelectedClasse(e.target.value)} style={styles.input}>
                            <option value="">Toutes les classes</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                    </div>
                    {type === 'semestre' && (
                        <div style={styles.field}>
                            <label style={styles.label}>Semestre</label>
                            <select value={selectedSemestre} onChange={e => setSelectedSemestre(e.target.value)} style={styles.input}>
                                <option value="">Choisir...</option>
                                {semestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                            </select>
                        </div>
                    )}
                </div>
                <button onClick={fetchStats} className="btn-premium" style={{ borderRadius: '30px', marginTop: window.innerWidth <= 768 ? '20px' : '0' }}>
                    VOIR LES STATISTIQUES 📊
                </button>
            </div>

            {summary && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #3b82f6' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--secondary)', marginBottom: '8px' }}>
                            {summary.total_eleves}
                        </div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: '700' }}>
                            Élèves Inscrits
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10b981', marginBottom: '8px' }}>
                            {summary.total_admis}
                        </div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: '700' }}>
                            Admis (≥ 10)
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #ef4444' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ef4444', marginBottom: '8px' }}>
                            {summary.total_refuses}
                        </div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: '700' }}>
                            Refusés (&lt; 10)
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '8px' }}>
                            {summary.taux_reussite}%
                        </div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: '700' }}>
                            Taux de Réussite
                        </div>
                    </div>
                </div>
            )}

            {stats.length > 0 && selectedClasse ? (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={styles.th}>Rang</th>
                                    <th style={styles.th}>Élève</th>
                                    <th style={styles.th}>Classe</th>
                                    <th style={styles.th}>Moyenne</th>
                                    <th style={styles.th}>Décision</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.map((s, i) => (
                                    <tr key={i} style={styles.tr}>
                                        <td style={{ ...styles.td, fontWeight: '900', color: 'var(--primary)' }}>
                                            {s.rang === 1 ? '1er' : `${s.rang}è`}
                                        </td>
                                        <td style={{ ...styles.td, fontWeight: '700', textTransform: 'uppercase' }}>{s.nom} {s.prenom}</td>
                                        <td style={styles.td}>{s.classe}</td>
                                        <td style={{ ...styles.td, color: 'var(--secondary)', fontWeight: '800' }}>
                                            {s.moyenne} / 20
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.badge,
                                                background: s.statut === 'ADMIS' ? '#dcfce7' : '#fee2e2',
                                                color: s.statut === 'ADMIS' ? '#166534' : '#991b1b',
                                                padding: '8px 16px',
                                                borderRadius: '20px'
                                            }}>
                                                {s.statut}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : summary && !selectedClasse ? (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)', fontWeight: '800' }}>📊 Répartition par Classe</h3>
                    </div>
                    <div className="table-responsive">
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={styles.th}>Classe</th>
                                    <th style={styles.th}>Total Élèves</th>
                                    <th style={styles.th}>Admis</th>
                                    <th style={styles.th}>Refusés</th>
                                    <th style={styles.th}>Taux de Réussite</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.classes.map((c, i) => (
                                    <tr key={i} style={styles.tr}>
                                        <td style={{ ...styles.td, fontWeight: '700' }}>{c.classe}</td>
                                        <td style={styles.td}>{c.total} inscrits</td>
                                        <td style={{ ...styles.td, color: '#166534', fontWeight: '700' }}>{c.admis} admis</td>
                                        <td style={{ ...styles.td, color: '#991b1b', fontWeight: '700' }}>{c.refuses} refusés</td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ height: '8px', background: '#e2e8f0', flex: 1, borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', background: 'var(--primary)', width: `${c.taux}%` }}></div>
                                                </div>
                                                <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>{c.taux}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div style={styles.empty}>
                    <div style={styles.emptyIcon}>🏆</div>
                    <p>Définissez les filtres pour générer le tableau d'excellence.</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '32px', marginBottom: '40px', padding: '32px' },
    filterGroup: { display: 'flex', gap: '24px', flex: 1 },
    field: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
    label: { fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' },
    input: { width: '100%', padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: 'var(--secondary)', outline: 'none' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { textAlign: 'left', background: '#fcfdfe' },
    th: { padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '16px 24px' },
    badge: { background: '#f1f5f9', color: 'var(--secondary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' },
    empty: { textAlign: 'center', padding: '100px', opacity: 0.5 },
    emptyIcon: { fontSize: '4rem', marginBottom: '20px' }
};

export default Statistiques;
