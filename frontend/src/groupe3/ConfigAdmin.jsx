import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const ConfigAdmin = () => {
    const [classes, setClasses] = useState([]);
    const [series, setSeries] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [selectedClasse, setSelectedClasse] = useState('');
    const [coeffs, setCoeffs] = useState([]);
    const [newMatiere, setNewMatiere] = useState({ nom: '', coefficient: 1 });
    const [newClasse, setNewClasse] = useState({ nom: '', annee_scolaire: '2023-2024' });

    const fetchData = () => {
        fetch(`${API_BASE_URL}/get_classes.php`).then(res => res.json()).then(setClasses);
        fetch(`${API_BASE_URL}/get_series.php`).then(res => res.json()).then(setSeries);
        fetch(`${API_BASE_URL}/get_matieres.php`).then(res => res.json()).then(setMatieres);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedClasse) {
            fetch(`${API_BASE_URL}/get_coefficients.php?classe_id=${selectedClasse}`)
                .then(res => res.json())
                .then(setCoeffs);
        } else {
            setCoeffs([]);
        }
    }, [selectedClasse]);

    const handleSaveMatiere = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (newMatiere.id) formData.append('id', newMatiere.id);
        formData.append('nom', newMatiere.nom);
        formData.append('coefficient', newMatiere.coefficient);

        fetch(`${API_BASE_URL}/save_matiere.php`, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchData();
                    setNewMatiere({ nom: '', coefficient: 1 });
                }
            });
    };

    const handleDeleteMatiere = (id) => {
        if (!window.confirm("Supprimer cette matière ? Tout ce qui lui est lié (notes, coefficients) sera définitivement effacé. Continuer ?")) return;
        const formData = new FormData();
        formData.append('id', id);
        fetch(`${API_BASE_URL}/delete_matiere.php`, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchData();
                } else {
                    alert("Erreur lors de la suppression : " + (data.error || "Inconnu"));
                }
            })
            .catch(err => alert("Erreur réseau : " + err.message));
    };

    const handleSaveClasse = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (newClasse.id) formData.append('id', newClasse.id);
        formData.append('nom', newClasse.nom);
        formData.append('annee_scolaire', newClasse.annee_scolaire);

        fetch(`${API_BASE_URL}/save_classe.php`, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchData();
                    setNewClasse({ nom: '', annee_scolaire: '2023-2024' });
                } else {
                    alert("Erreur lors de l'enregistrement de la classe : " + data.error);
                }
            });
    };

    const handleDeleteClasse = (id) => {
        if (!window.confirm("Supprimer cette classe ? Tous les élèves et leurs notes seront perdus. Continuer ?")) return;
        const formData = new FormData();
        formData.append('id', id);
        fetch(`${API_BASE_URL}/delete_classe.php`, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchData();
                    if (selectedClasse === id) setSelectedClasse('');
                } else {
                    alert("Erreur lors de la suppression : " + data.error);
                }
            })
            .catch(err => alert("Erreur réseau : " + err.message));
    };

    const handleUpdateCoeff = (matiereId, val) => {
        const formData = new FormData();
        formData.append('classe_id', selectedClasse);
        formData.append('matiere_id', matiereId);
        formData.append('coefficient', val);

        fetch(`${API_BASE_URL}/update_coefficient.php`, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCoeffs(coeffs.map(c => c.matiere_id === matiereId ? { ...c, coefficient: val } : c));
                }
            });
    };

    const handleToggleAssignment = (matiereId, isAssigned, currentCoeff) => {
        const formData = new FormData();
        formData.append('classe_id', selectedClasse);
        formData.append('matiere_id', matiereId);

        if (isAssigned) {
            fetch(`${API_BASE_URL}/remove_matiere_from_classe.php`, { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setCoeffs(coeffs.map(c => c.matiere_id === matiereId ? { ...c, is_assigned: 0 } : c));
                    }
                });
        } else {
            formData.append('coefficient', currentCoeff);
            fetch(`${API_BASE_URL}/update_coefficient.php`, { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setCoeffs(coeffs.map(c => c.matiere_id === matiereId ? { ...c, is_assigned: 1 } : c));
                    }
                });
        }
    };

    return (
        <div className="slide-up">
            <header style={{ marginBottom: '48px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Configuration Académique</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Gérez les classes, les matières et leurs coefficients.</p>
            </header>

            <div style={styles.container}>
                <div style={styles.sidebar}>
                    {}
                    <div className="glass-card" style={{ marginBottom: '24px' }}>
                        <h2 style={styles.sectionTitle}>🏫 Gestion des Classes</h2>
                        <form onSubmit={handleSaveClasse} style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                            <input
                                placeholder="Nom Classe (ex: 6ème A)"
                                value={newClasse.nom}
                                onChange={e => setNewClasse({ ...newClasse, nom: e.target.value })}
                                style={styles.input}
                                required
                            />
                            <button className="btn-premium" style={{ padding: '8px 16px' }}>
                                {newClasse.id ? '✓' : '+'}
                            </button>
                        </form>
                        <div style={styles.scrollList}>
                            {classes.map(c => (
                                <div key={c.id} style={styles.itemCard}>
                                    <span style={{ flex: 1, cursor: 'pointer' }} onClick={() => setSelectedClasse(c.id)}>
                                        {c.nom}
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setNewClasse(c)} style={styles.miniBtn}>✏️</button>
                                        <button onClick={() => handleDeleteClasse(c.id)} style={styles.deleteBtn}>🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="glass-card">
                        <h2 style={styles.sectionTitle}>📋 Gestion des Matières</h2>
                        <form onSubmit={handleSaveMatiere} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                                placeholder="Nom de la matière"
                                value={newMatiere.nom}
                                onChange={e => setNewMatiere({ ...newMatiere, nom: e.target.value })}
                                style={styles.input}
                                required
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="number"
                                    placeholder="Coeff"
                                    value={newMatiere.coefficient}
                                    onChange={e => setNewMatiere({ ...newMatiere, coefficient: e.target.value })}
                                    style={{ ...styles.input, width: '80px' }}
                                />
                                <button className="btn-premium" style={{ flex: 1 }}>
                                    {newMatiere.id ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                        <div style={styles.scrollList}>
                            {matieres.map(m => (
                                <div key={m.id} style={styles.itemCard}>
                                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setNewMatiere(m)}>
                                        <div style={{ fontWeight: '700' }}>{m.nom}</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Coeff par défaut: {m.coefficient}</div>
                                    </div>
                                    <button onClick={() => handleDeleteMatiere(m.id)} style={styles.deleteBtn}>🗑️</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {}
                <div className="glass-card" style={styles.mainSection}>
                    <div style={styles.headerRow}>
                        <h2 style={styles.sectionTitle}>
                            {selectedClasse ? `⚖️ Matières : ${classes.find(c => c.id == selectedClasse)?.nom}` : '⚖️ Sélectionnez une classe pour configurer ses matières'}
                        </h2>
                    </div>

                    {selectedClasse ? (
                        <div style={{ marginTop: '24px' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Inclure</th>
                                        <th style={styles.th}>Matière</th>
                                        <th style={styles.th}>Coefficient</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coeffs.map(c => (
                                        <tr key={c.matiere_id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!c.is_assigned}
                                                    onChange={() => handleToggleAssignment(c.matiere_id, !!c.is_assigned, c.coefficient)}
                                                    style={styles.checkbox}
                                                />
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{ fontWeight: 600 }}>{c.matiere_nom}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.inputGroup}>
                                                    <input
                                                        type="number"
                                                        step="0.5"
                                                        style={{
                                                            ...styles.miniInput,
                                                            border: c.is_assigned ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                                            background: c.is_assigned ? '#fff' : '#f8fafc'
                                                        }}
                                                        defaultValue={c.coefficient}
                                                        onBlur={(e) => handleUpdateCoeff(c.matiere_id, e.target.value)}
                                                    />
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <button
                                                    onClick={() => handleToggleAssignment(c.matiere_id, !!c.is_assigned, c.coefficient)}
                                                    style={{
                                                        ...styles.actionBtn,
                                                        background: c.is_assigned ? 'var(--danger-bg)' : 'var(--primary)',
                                                        color: c.is_assigned ? '#dc2626' : 'var(--secondary)',
                                                    }}
                                                >
                                                    {c.is_assigned ? '❌ Retirer de la classe' : '➕ Ajouter à cette classe'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={styles.placeholder}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⬅️</div>
                            <p>Cliquez sur une classe dans la liste à gauche pour commencer la configuration.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px' },
    sidebar: { display: 'flex', flexDirection: 'column' },
    mainSection: { padding: '40px' },
    sectionTitle: { fontSize: '1.2rem', marginBottom: '20px', color: 'var(--secondary)', fontWeight: '800' },
    scrollList: { maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '8px' },
    itemCard: {
        padding: '12px 16px',
        background: '#f8fafc',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s',
        '&:hover': { borderColor: 'var(--primary)', background: '#fff' }
    },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', transition: 'border 0.2s' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '16px', borderBottom: '2px solid #f1f5f9', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' },
    tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' },
    td: { padding: '16px' },
    miniInput: { width: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', outline: 'none' },
    inputGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
    placeholder: { padding: '100px 40px', textAlign: 'center', opacity: 0.4, color: 'var(--secondary)' },
    miniBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '4px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '4px', transition: 'transform 0.2s', opacity: 0.6 },

    checkbox: { width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' },
    actionBtn: { border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }
};

export default ConfigAdmin;
