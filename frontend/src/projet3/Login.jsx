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
            <div style={styles.card}>
                <h2 style={styles.title}>Connexion École+</h2>
                <p style={styles.subtitle}>Accédez à votre espace de gestion</p>

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
                            placeholder="votre@email.com"
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

                    <button type="submit" style={styles.button}>
                        Se connecter
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
        backgroundColor: 'var(--bg-main)',
    },
    card: {
        backgroundColor: '#fff',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
    },
    title: {
        marginBottom: '4px',
        fontSize: '2.5rem',
        fontWeight: '900',
        color: 'var(--secondary)',
    },
    subtitle: {
        marginBottom: '32px',
        color: 'var(--text-dim)',
    },
    error: {
        backgroundColor: 'var(--danger-bg)',
        color: '#b91c1c',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '0.9rem',
        fontWeight: '600',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    inputGroup: {
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '0.8rem',
        fontWeight: '700',
        color: 'var(--secondary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        color: 'var(--secondary)',
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.2s',
    },
    button: {
        padding: '16px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: 'var(--primary)',
        color: 'var(--secondary)',
        fontSize: '1rem',
        fontWeight: '900',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginTop: '10px',
    }
};

export default Login;
