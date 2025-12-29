import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        // TEMPORAIRE : On force un utilisateur admin valide pour les tests visuels
        const mockUser = {
            id: 1,
            nom: "Test",
            prenom: "Admin",
            email: "admin@test.com",
            role: "ADMIN",
            doit_changer_mdp: 0
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isMobile = window.innerWidth <= 768;

    return (
        <aside style={{
            ...styles.sidebar,
            position: isMobile ? 'fixed' : 'static',
            left: isMobile ? (isOpen ? '0' : '-280px') : '0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isMobile && isOpen ? '10px 0 30px rgba(0,0,0,0.3)' : 'none',
        }}>
            {/* Mobile Header (Hidden on Desktop) */}
            <div style={styles.mobileHeader}>
                <button onClick={() => setIsOpen(!isOpen)} style={styles.hamburger}>
                    {isOpen ? '✕' : '☰'}
                </button>
                <div style={styles.mobileLogo}>Gestion scolaire</div>
            </div>

            {/* Overlay (Mobile Only) */}
            {isMobile && isOpen && (
                <div onClick={() => setIsOpen(false)} style={styles.overlay} />
            )}
            <div style={styles.logoContainer}>
                <h2 style={styles.logoText}>Gestion scolaire<span style={{ color: 'var(--primary)' }}></span></h2>
                <div style={styles.badge}>Gestion des notes</div>
            </div>

            <nav style={styles.nav}>
                {user && (
                    <>
                        <SidebarLink to="/notes" icon="🏠" label="Tableau de bord" onClick={() => setIsOpen(false)} />

                        {(user?.role === 'RESPONSABLE' || user?.role === 'ADMIN') && (
                            <>
                                <SidebarLink to="/deliberation" icon="⚖️" label="Délibération" onClick={() => setIsOpen(false)} />
                                <SidebarLink to="/bulletins" icon="📜" label="Générer Bulletin" onClick={() => setIsOpen(false)} />
                                <SidebarLink to="/stats" icon="📈" label="Consulter Statistiques" onClick={() => setIsOpen(false)} />
                                <SidebarLink to="/notifications" icon="🔔" label="Notifications" onClick={() => setIsOpen(false)} />
                                <SidebarLink to="/config" icon="⚙️" label="Configuration" onClick={() => setIsOpen(false)} />
                                <SidebarLink to="/config/enseignants" icon="👨‍🏫" label="Gestion Enseignants" onClick={() => setIsOpen(false)} />
                                <SidebarLink to="/notes/ajouter-eleve" icon="👤" label="Ajouter Élève" onClick={() => setIsOpen(false)} />
                            </>
                        )}

                        {user?.role === 'ENSEIGNANT' && (
                            <>
                                <SidebarLink to="/notes/saisie" icon="📝" label="Saisir Note" onClick={() => setIsOpen(false)} />
                                <SidebarLink to="/notes/matieres" icon="📊" label="Consulter Classe" onClick={() => setIsOpen(false)} />
                            </>
                        )}
                    </>
                )}

                <div style={styles.divider}></div>
                <SidebarLink to="/profil/securite" icon="🔒" label="Sécurité" onClick={() => setIsOpen(false)} />

                <div style={styles.logoutContainer} onClick={handleLogout}>
                    <span style={styles.logoutIcon}>🚪</span>
                    <span style={styles.logoutText}>Déconnexion</span>
                </div>
            </nav>

            <div style={styles.footer}>
                <div style={styles.userCard}>
                    <div style={styles.avatar}>
                        {user ? user.nom.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div style={styles.userInfo}>
                        <div style={styles.userName}>{user ? `${user.prenom} ${user.nom}` : 'Admin'}</div>
                        <div style={styles.userRole}>{user ? user.role : 'Utilisateur'}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const SidebarLink = ({ to, icon, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? 'var(--primary)' : 'transparent',
            color: isActive ? 'var(--secondary)' : 'rgba(255,255,255,0.6)',
            borderRadius: '12px',
            margin: '4px 16px',
            fontWeight: isActive ? '700' : '500'
        })}
    >
        <span style={styles.icon}>{icon}</span>
        <span>{label}</span>
    </NavLink>
);

const styles = {
    sidebar: {
        width: '260px',
        backgroundColor: '#2d3250', // Hardcoded for reliability
        height: '100vh',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        flexShrink: 0, // Prevent sidebar from shrinking
    },
    mobileHeader: {
        display: window.innerWidth <= 768 ? 'flex' : 'none',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: 'var(--sidebar-bg)',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        gap: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    },
    hamburger: {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: 0
    },
    mobileLogo: {
        fontWeight: '900',
        fontSize: '1.2rem',
        color: 'var(--primary)'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 950,
        backdropFilter: 'blur(4px)'
    },
    logoContainer: {
        padding: '32px 24px',
    },
    logoText: {
        fontSize: '1.8rem',
        color: '#fff',
        margin: 0,
        fontWeight: '900',
    },
    badge: {
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: 'rgba(255,255,255,0.4)',
        marginTop: '4px',
        fontWeight: '700',
    },
    nav: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 0',
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        fontSize: '0.9rem',
        textDecoration: 'none',
        gap: '12px',
        transition: 'all 0.2s ease',
    },
    icon: {
        fontSize: '1.2rem',
    },
    divider: {
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        margin: '16px 24px',
    },
    footer: {
        padding: '24px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    userCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: 'var(--primary)',
        color: 'var(--secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '900',
        fontSize: '1rem',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    userName: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#fff',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    userRole: {
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.5)',
    },
    logoutContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        margin: 'auto 16px 16px',
        cursor: 'pointer',
        color: '#f87171',
        gap: '12px',
        borderRadius: '12px',
        transition: 'background 0.2s',
    },
    logoutIcon: {
        fontSize: '1.1rem',
    },
    logoutText: {
        fontSize: '0.9rem',
        fontWeight: '600',
    }
};

export default Sidebar;
