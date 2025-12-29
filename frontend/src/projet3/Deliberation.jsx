import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Deliberation = () => {
    const [elevesResults, setElevesResults] = useState([]);
    const [classes, setClasses] = useState([]);
    const [semestres, setSemestres] = useState([]);
    const [selectedClasse, setSelectedClasse] = useState('');
    const [selectedSemestre, setSelectedSemestre] = useState('');

    const [loading, setLoading] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_classes.php`).then(res => res.json()).then(setClasses);
        fetch(`${API_BASE_URL}/get_semestres.php`).then(res => res.json()).then(setSemestres);
    }, []);

    const fetchResults = () => {
        if (!selectedClasse || !selectedSemestre) {
            alert("Veuillez choisir une classe et un semestre.");
            return;
        }

        setElevesResults([]);
        setIsClosed(false);
        fetch(`${API_BASE_URL}/get_deliberation.php?classe_id=${selectedClasse}&semestre_id=${selectedSemestre}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) alert("Erreur: " + data.error);
                else {
                    setElevesResults(data.results || []);
                    setIsClosed(data.est_clos);
                }
            });
    };

    const handleClore = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir clore ce conseil ? Cela verrouillera toutes les notes de ce semestre pour cette classe.")) return;

        const user = JSON.parse(localStorage.getItem('user'));
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/clore_conseil.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    classe_id: selectedClasse,
                    semestre_id: selectedSemestre,
                    responsable_id: user.id
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                setIsClosed(true);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Erreur de connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="slide-up">
            <header style={{ marginBottom: '48px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Espace de Délibération</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Validation officielle des moyennes et arrêtés de fin de cycle.</p>
            </header>

            <div className="glass-card" style={styles.filterBar}>
                <div style={styles.filterGroup}>
                    <div style={styles.field}>
                        <label style={styles.label}>Classe à délibérer</label>
                        <select onChange={e => setSelectedClasse(e.target.value)} style={styles.input}>
                            <option value="">-- Choisir Classe --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Semestre</label>
                        <select onChange={e => setSelectedSemestre(e.target.value)} style={styles.input}>
                            <option value="">-- Choisir Semestre --</option>
                            {semestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={fetchResults} className="btn-premium" style={{ background: 'var(--sidebar-bg)' }}>
                    CHARGER LE CONSEIL ⚖️
                </button>
            </div>

            {elevesResults.length > 0 && (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', opacity: isClosed ? 0.8 : 1 }}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Rang</th>
                                <th style={styles.th}>Identité</th>
                                <th style={styles.th}>Moyenne</th>
                                <th style={styles.th}>Décision</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {elevesResults.map((e, idx) => (
                                <tr key={idx} style={styles.tr}>
                                    <td style={{ ...styles.td, fontWeight: '800', color: 'var(--primary-dark)' }}>#{e.rang}</td>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>{e.nom} {e.prenom}</td>
                                    <td style={{ ...styles.td, color: 'var(--secondary)', fontWeight: '800' }}>{e.moyenne_generale}</td>
                                    <td style={styles.td}>
                                        <span className={e.decision === 'Admis' ? 'badge-success' : 'badge-danger'}>
                                            {e.decision.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button style={styles.btnLink}>Fiche Élève</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {elevesResults.length > 0 && (
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button
                        onClick={handleClore}
                        disabled={loading || isClosed}
                        className="btn-premium"
                        style={{
                            width: '100%', padding: '20px', borderRadius: '16px',
                            backgroundColor: isClosed ? '#10b981' : 'var(--primary)'
                        }}
                    >
                        {loading ? 'CHARGEMENT...' : isClosed ? 'CONSEIL CLOTURÉ AVEC SUCCÈS ✅' : 'VALIDER ET CLORE LE CONSEIL DE CLASSE 🔐'}
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '32px', marginBottom: '40px' },
    filterGroup: { display: 'flex', gap: '24px', flex: 1 },
    field: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
    label: { fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase' },
    input: {
        width: '100%', padding: '14px', backgroundColor: '#fff',
        border: '1px solid #e2e8f0', borderRadius: '12px', color: 'var(--secondary)', outline: 'none',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { backgroundColor: '#fcfdfe' },
    th: { padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '16px 24px' },
    btnLink: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }
};

export default Deliberation;
