import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Container,
  Menu,
  MenuItem,
  Divider,
  Chip
} from '@mui/material';
import {
  Description,
  AccountBalanceWallet,
  History,
  School,
  Notifications,
  Logout,
  AccountBalance,
  Home,
  Circle as CircleIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const drawerWidth = 260;

  const colors = {
    primary: '#2A2F4F',
    accent: '#F4A261',
    bgLight: '#F8F9FC',
    white: '#FFFFFF'
  };

  // === État des Notifications ===
  const [anchorElNotify, setAnchorElNotify] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Paiement validé", message: "Votre 1ère tranche a été reçue.", time: "Il y a 2h", unread: true },
    { id: 2, title: "Rappel échéance", message: "La 2ème tranche arrive à expiration.", time: "Hier", unread: true },
    { id: 3, title: "Document disponible", message: "Votre reçu de scolarité est prêt.", time: "Il y a 3 jours", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;
  const handleOpenNotify = (event) => setAnchorElNotify(event.currentTarget);
  const handleCloseNotify = () => setAnchorElNotify(null);

  const menuItems = [
    { path: '/gestion-scolarite/frais-inscription', label: 'Inscription', icon: <Description /> },
    { path: '/gestion-scolarite/scolarite', label: 'Scolarité', icon: <AccountBalanceWallet /> },
    { path: '/gestion-scolarite/general-frais', label: 'Frais Généraux', icon: <AccountBalance /> },
    { path: '/gestion-scolarite/my-payments', label: 'Mes paiements', icon: <History /> },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('frais-inscription')) return 'Inscription Élève';
    if (path.includes('scolarite')) return 'Scolarité';
    if (path.includes('general-frais')) return 'Frais Généraux';
    if (path.includes('my-payments')) return 'Mes Paiements';
    return 'Espace Étudiant';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.bgLight }}>
      
      {/* === SIDEBAR === */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: colors.primary,
            color: 'white',
            border: 'none'
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1.2, borderRadius: 2 }}>
            <School sx={{ color: colors.accent, fontSize: 26 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} letterSpacing={0.5}>School-HUB</Typography>
        </Box>

        <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
          <ListItem disablePadding sx={{ mb: 4 }}>
            <ListItemButton
              onClick={() => navigate('/')}
              sx={{
                borderRadius: 2,
                bgcolor: 'rgba(244, 162, 97, 0.1)',
                color: colors.accent,
                '&:hover': { bgcolor: 'rgba(244, 162, 97, 0.2)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><Home /></ListItemIcon>
              <ListItemText primary="Retour Accueil" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>

          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: active ? colors.accent : 'transparent',
                    color: active ? 'white' : 'rgba(255,255,255,0.7)',
                    '&:hover': { bgcolor: active ? '#e76f51' : 'rgba(255,255,255,0.05)', color: 'white' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 600 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => console.log('Logout')} sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.7)' }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><Logout /></ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItemButton>
          </ListItem>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mt: 1 }}>
            <Avatar sx={{ width: 40, height: 40, border: `2px solid ${colors.accent}`, bgcolor: 'rgba(255,255,255,0.1)' }}>ET</Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>Étudiant</Typography>
              <Typography variant="caption" sx={{ opacity: 0.5 }}>Terminale C</Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* === ZONE DE CONTENU === */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: `calc(100% - ${drawerWidth}px)` }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #E5E7EB' }}>
          <Toolbar sx={{ minHeight: '80px !important', justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
            <Typography variant="h5" fontWeight={800} color={colors.primary}>
              {getPageTitle()}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* SEULE LA CLOCHE DE NOTIFICATION EST GARDÉE ICI */}
              <IconButton onClick={handleOpenNotify} size="large">
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications sx={{ color: colors.primary, fontSize: 28 }} />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* --- MENU DÉROULANT DES NOTIFICATIONS --- */}
        <Menu
          anchorEl={anchorElNotify}
          open={Boolean(anchorElNotify)}
          onClose={handleCloseNotify}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: { width: 350, mt: 1.5, borderRadius: 3, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
            {unreadCount > 0 && <Chip label={unreadCount} size="small" sx={{ bgcolor: colors.accent, color: 'white' }} />}
          </Box>
          <Divider />
          
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {notifications.map((n) => (
              <MenuItem key={n.id} onClick={handleCloseNotify} sx={{ py: 1.5, px: 2, whiteSpace: 'normal' }}>
                
                {/* ==========================================================================
                GROS COMMENTAIRE : MODIFIER LES INFORMATIONS DE LA NOTIFICATION CI-DESSOUS
                --------------------------------------------------------------------------
                - n.unread : Gère le point de couleur (Accent si non lu, Gris si lu)
                - n.title  : Affiche le titre (en gras si non lu)
                - n.message: Affiche le texte descriptif de l'alerte
                - n.time   : Affiche le temps écoulé (ex: "Il y a 2h")
                ==========================================================================
                */}
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ mt: 0.5 }}>
                    <CircleIcon sx={{ fontSize: 10, color: n.unread ? colors.accent : '#CBD5E1' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={n.unread ? 700 : 500}>
                      {n.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {n.message}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color={colors.accent}>
                      {n.time}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Box>
          
          <Divider />
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 700 }}>
              Tout marquer comme lu
            </Typography>
          </Box>
        </Menu>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          <Container maxWidth="xl" disableGutters>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentLayout;