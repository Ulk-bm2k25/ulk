import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AjoutEleve = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '', prenom: '', email_eleve: '', email_parent: '', classe_id: ''
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_classes.php`)
            .then(res => res.json())
            .then(setClasses)
            .catch(err => console.error("Erreur chargement classes:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const dataToSend = new FormData();
        Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));

        try {
            const res = await fetch(`${API_BASE_URL}/save_eleve.php`, {
                method: 'POST',
                body: dataToSend
            });
            const result = await res.json();
            if (result.success) {
                alert("✅ Comptes créés ! Les accès ont été générés pour l'élève et le parent.");
                setFormData({ nom: '', prenom: '', email_eleve: '', email_parent: '', classe_id: '' });
            } else {
                alert("❌ Erreur: " + result.error);
            }
        } catch (err) {
            alert("❌ Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="slide-up">
            <header style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Gestion des Inscriptions</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Créez les identifiants pour les nouveaux élèves et leurs parents.</p>
            </header>

            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
                <div style={styles.formHeader}>
                    <div style={styles.headerIcon}>🎓</div>
                    <div>
                        <h2 style={styles.formTitle}>Fiche d'inscription numérique</h2>
                        <p style={styles.formDesc}>Remplissez les informations pour générer les accès automatiques.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Nom de l'élève</label>
                            <input
                                type="text" style={styles.input} placeholder="Ex: SOW"
                                value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Prénom de l'élève</label>
                            <input
                                type="text" style={styles.input} placeholder="Ex: Moussa"
                                value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} required
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email personnel de l'élève</label>
                        <input
                            type="email" style={styles.input} placeholder="eleve@ecole.sn"
                            value={formData.email_eleve} onChange={e => setFormData({ ...formData, email_eleve: e.target.value })} required
                        />
                        <p style={styles.hint}>L'élève utilisera cet email pour se connecter.</p>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email du parent / tuteur</label>
                        <input
                            type="email" style={styles.input} placeholder="parent@domaine.com"
                            value={formData.email_parent} onChange={e => setFormData({ ...formData, email_parent: e.target.value })} required
                        />
                        <p style={styles.hint}>Le parent recevra les notifications de notes sur cet email.</p>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Classe d'affectation</label>
                        <select
                            style={styles.select} value={formData.classe_id}
                            onChange={e => setFormData({ ...formData, classe_id: e.target.value })} required
                        >
                            <option value="">Sélectionner une classe...</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                    </div>

                    <div style={styles.actionArea}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium"
                            style={{ padding: '16px 32px', fontSize: '1rem' }}
                        >
                            {loading ? 'CRÉATION EN COURS...' : 'GÉNÉRER LES COMPTES & ACCÈS ⚡'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    formHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '1px solid #f1f5f9'
    },
    headerIcon: {
        fontSize: '2.5rem',
        backgroundColor: '#f8fafc',
        width: '72px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        border: '1px solid #e2e8f0'
    },
    formTitle: {
        fontSize: '1.4rem',
        fontWeight: '800',
        color: 'var(--secondary)',
        marginBottom: '4px'
    },
    formDesc: {
        fontSize: '0.9rem',
        color: 'var(--text-dim)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    input: {
        padding: '14px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        outline: 'none',
        fontSize: '1rem',
        transition: 'all 0.2s',
        '&:focus': { borderColor: 'var(--primary)', backgroundColor: '#fff' }
    },
    select: {
        padding: '14px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        outline: 'none',
        fontSize: '1rem',
        cursor: 'pointer'
    },
    hint: {
        fontSize: '0.75rem',
        color: 'var(--text-dim)',
        fontStyle: 'italic'
    },
    actionArea: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'flex-end'
    }
};

export default AjoutEleve;