import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('math@school.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [offlineMode, setOfflineMode] = useState(false);

    // fallback local credentials (utilisé si serveur indisponible ou réponse KO)
    const fallbackCredentials = [
        { email: 'math@school.com', password: 'password', token: 'fallback-math-token' },
        { email: 'phys@school.com', password: 'password', token: 'fallback-phys-token' }
    ];

    const handleFallbackCheck = (emailVal, passwordVal) => {
        const match = fallbackCredentials.find(c => c.email === emailVal && c.password === passwordVal);
        if (match) {
            localStorage.setItem('token', match.token);
            localStorage.setItem('offline', 'true');
            setOfflineMode(true);
            // reload pour que App.jsx prenne le token en compte
            window.location.reload();
            return true;
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOfflineMode(false);

        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            // si fetch ok => on parse la réponse
            const data = await response.json().catch(() => null);

            if (response.ok && data && data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.removeItem('offline');
                window.location.reload();
            } else {
                // tentative de fallback local si serveur renvoie une erreur ou données inattendues
                const usedFallback = handleFallbackCheck(email, password);
                if (!usedFallback) {
                    setError((data && data.message) ? data.message : 'Identifiants incorrects');
                }
            }
        } catch (err) {
            // en cas d'erreur réseau -> fallback local
            const usedFallback = handleFallbackCheck(email, password);
            if (!usedFallback) {
                setError('Erreur de connexion au serveur. Vérifiez votre réseau ou utilisez des identifiants valides.');
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#2d3250',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                width: '100%',
                maxWidth: '420px',
                borderTop: '6px solid #f8b179'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#2d3250' }}>
                    <span style={{ color: '#f8b179', marginRight: '0.5rem' }}>●</span>
                    Connexion SchoolHub
                </h2>

                {offlineMode && (
                    <div style={{
                        backgroundColor: '#fffbeb',
                        color: '#92400e',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        Mode hors-ligne activé (fallback local)
                    </div>
                )}

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e6e7ee',
                                borderRadius: '8px',
                                boxSizing: 'border-box',
                                fontSize: '0.95rem'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e6e7ee',
                                borderRadius: '8px',
                                boxSizing: 'border-box',
                                fontSize: '0.95rem'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.85rem',
                            backgroundColor: '#f8b179',
                            color: '#2d3250',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.8 : 1,
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
                    <p>Professeur Math: math@school.com / password</p>
                    <p>Professeur Physique: phys@school.com / password</p>
                </div>
            </div>
        </div>
    );
};

export default Login;