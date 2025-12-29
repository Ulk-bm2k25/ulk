import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/login_api.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {

                localStorage.setItem('user', JSON.stringify(data.user));


                navigate('/notes');
                window.location.reload(); // Pour mettre à jour la Sidebar immédiatement
            } else {
                setError(data.message || 'Erreur de connexion');
            }
        } catch (err) {
            setError('Impossible de joindre le serveur.');
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <div className="glass-card fade-in" style={styles.card}>
                <h2 style={styles.title}>École+ Notes</h2>
                <p style={styles.subtitle}>Espace de gestion académique</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                            placeholder="nom@ecole.com"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn-premium" style={styles.button}>
                        Accéder au portail
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #2d3250 0%, #424769 100%)',
        position: 'relative',
        overflow: 'hidden',
    },
    card: {
        maxWidth: '420px',
        width: '90%',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    title: {
        marginBottom: '8px',
        fontSize: '2rem',
        fontWeight: '800',
        color: 'var(--secondary)',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        marginBottom: '32px',
        color: 'var(--text-dim)',
        fontSize: '0.95rem',
    },
    error: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '24px',
        fontSize: '0.9rem',
        fontWeight: '600',
        border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '2px solid rgba(0,0,0,0.05)',
        backgroundColor: 'rgba(255,255,255,0.5)',
        color: 'var(--secondary)',
        fontSize: '1rem',
        fontWeight: '500',
        outline: 'none',
        transition: 'all 0.2s ease',
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        marginTop: '12px',
        fontSize: '1rem',
    }
};

export default Login;
