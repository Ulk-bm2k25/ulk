import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const GestionEnseignants = () => {
    const [enseignants, setEnseignants] = useState([]);
    const [classes, setClasses] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '', prenom: '', email: '', matiere: '', selectedClasses: []
    });

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        fetch(`${API_BASE_URL}/get_enseignants.php`).then(res => res.json()).then(setEnseignants);
        fetch(`${API_BASE_URL}/get_classes.php`).then(res => res.json()).then(setClasses);
        fetch(`${API_BASE_URL}/get_matieres.php`).then(res => res.json()).then(setMatieres);
    };


    const handleClassToggle = (classeId) => {
        setFormData(prev => ({
            ...prev,
            selectedClasses: prev.selectedClasses.includes(classeId)
                ? prev.selectedClasses.filter(id => id !== classeId)
                : [...prev.selectedClasses, classeId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.selectedClasses.length === 0) {
            alert("Veuillez sélectionner au moins une classe.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/save_enseignant.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                alert("Enseignant créé avec succès !");
                setFormData({ nom: '', prenom: '', email: '', matiere: '', selectedClasses: [] });
                refreshData();
            } else {
                alert("Erreur: " + data.error);
            }
        } catch (err) {
            alert("Erreur de connexion.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        e.preventDefault();
        const allClassIds = classes.map(c => c.id);
        const isAllSelected = formData.selectedClasses.length === classes.length;

        setFormData(prev => ({
            ...prev,
            selectedClasses: isAllSelected ? [] : allClassIds
        }));
    };

    return (
        <div className="slide-up">
            <header style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Gestion du Corps Enseignant</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Créez les comptes et assignez les responsabilités pédagogiques.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
                {}
                <div className="glass-card" style={{ padding: '30px' }}>
                    <h2 style={styles.cardTitle}>Nouveau Compte Enseignant</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.field}>
                            <label style={styles.label}>Nom</label>
                            <input type="text" style={styles.input} value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} required />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Prénom</label>
                            <input type="text" style={styles.input} value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} required />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Email Professionnel</label>
                            <input type="email" style={styles.input} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Matière Principale</label>
                            <select
                                style={styles.input}
                                value={formData.matiere}
                                onChange={e => setFormData({ ...formData, matiere: e.target.value })}
                                required
                            >
                                <option value="">Choisir la matière...</option>
                                {(() => {
                                    const special = ["Communication écrite", "Lecture"];
                                    const filtered = matieres.filter(m => !special.includes(m.nom));
                                    const hasSpecial = matieres.some(m => special.includes(m.nom));
                                    return (
                                        <>
                                            {filtered.map(m => <option key={m.id} value={m.nom}>{m.nom}</option>)}
                                            {hasSpecial && <option value="Communication écrite et Lecture">Communication écrite et Lecture</option>}
                                        </>
                                    );
                                })()}
                            </select>

                        </div>

                        <div style={styles.field}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={styles.label}>Classes Affectées</label>
                                <button
                                    onClick={handleSelectAll}
                                    style={styles.selectAllBtn}
                                >
                                    {formData.selectedClasses.length === classes.length ? '❌ Tout déselectionner' : '✅ Tout sélectionner'}
                                </button>
                            </div>
                            <div style={styles.classList}>
                                {classes.map(c => (
                                    <div key={c.id} style={styles.classItem} onClick={() => handleClassToggle(c.id)}>
                                        <input
                                            type="checkbox"
                                            readOnly
                                            checked={formData.selectedClasses.includes(c.id)}
                                            style={{ marginRight: '10px' }}
                                        />
                                        <span style={{ fontSize: '0.9rem' }}>{c.nom}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-premium" style={{ width: '100%', marginTop: '20px' }}>
                            {loading ? 'CRÉATION...' : 'CRÉER LE COMPTE ENSEIGNANT ⚡'}
                        </button>
                    </form>
                </div>

                {}
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Enseignant</th>
                                <th style={styles.th}>Matière</th>
                                <th style={styles.th}>Affectations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enseignants.map((ens, idx) => (
                                <tr key={idx} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: '700', color: 'var(--secondary)' }}>{ens.prenom} {ens.nom}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{ens.email}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.matiereBadge}>{ens.matiere}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                            {ens.classes && ens.classes.map((cls, i) => (
                                                <span key={i} style={styles.classBadge}>{cls}</span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles = {
    cardTitle: { fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '24px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase' },
    selectAllBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--primary)',
        fontSize: '0.7rem',
        fontWeight: '800',
        cursor: 'pointer',
        padding: '0',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' },
    classList: {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
        maxHeight: '150px', overflowY: 'auto', padding: '10px',
        backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0'
    },
    classItem: { display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { backgroundColor: '#fcfdfe' },
    th: { padding: '16px 24px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '16px 24px' },
    matiereBadge: { padding: '4px 10px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' },
    classBadge: { padding: '2px 8px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }
};

export default GestionEnseignants;
