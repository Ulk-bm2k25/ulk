import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);


    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
            return;
        }

        if (passwords.new.length < 6) {
            setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('old_password', passwords.old);
            formData.append('new_password', passwords.new);

            const res = await fetch(`${API_BASE_URL}/update_password.php`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
                setPasswords({ old: '', new: '', confirm: '' });


                const updatedUser = { ...storedUser, doit_changer_mdp: 0 };
                localStorage.setItem('user', JSON.stringify(updatedUser));


                setTimeout(() => {
                    window.location.href = '/notes'; // Go to dashboard
                }, 1500);
            } else {

                setMessage({ type: 'error', text: data.error || 'Une erreur est survenue.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="slide-up">
            <header style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Sécurité du Compte</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Protégez vos accès avec un mot de passe robuste.</p>
            </header>

            <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
                <div style={styles.iconCircle}>🔒</div>

                <h2 style={styles.formTitle}>Changer le mot de passe</h2>
                <p style={styles.formHint}>Veuillez vérifier votre identité en saisissant votre mot de passe actuel.</p>

                {message.text && (
                    <div style={{
                        ...styles.alert,
                        backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: message.type === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message.type === 'success' ? '✅ ' : '⚠️ '} {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Mot de passe actuel</label>
                        <input
                            type="password"
                            style={styles.input}
                            placeholder="••••••••"
                            value={passwords.old}
                            onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Nouveau mot de passe</label>
                        <input
                            type="password"
                            style={styles.input}
                            placeholder="••••••••"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Confirmez le nouveau mot de passe</label>
                        <input
                            type="password"
                            style={styles.input}
                            placeholder="••••••••"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium"
                        style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? 'MISE À JOUR...' : 'ENREGISTRER LES MODIFICATIONS ⚡'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    iconCircle: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        margin: '0 auto 24px'
    },
    formTitle: {
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--secondary)',
        marginBottom: '8px'
    },
    formHint: {
        textAlign: 'center',
        fontSize: '0.9rem',
        color: 'var(--text-dim)',
        marginBottom: '32px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
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
        transition: 'all 0.2s'
    },
    alert: {
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '0.9rem',
        marginBottom: '24px',
        textAlign: 'center'
    }
};

export default ChangePassword;