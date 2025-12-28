import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Avatar, Typography, AppBar, Toolbar, IconButton, 
  Badge, Container, Divider, Paper, Stack
} from '@mui/material';
import {
  CalendarMonth, AttachMoney, Receipt, School, 
  Notifications, Logout, BarChart
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const drawerWidth = 260;

  const colors = {
    primary: '#1A1C2E',
    accent: '#F4A261',
    bgLight: '#F3F4F6',
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/gestion-scolarite/admin/academic-years', label: 'Années académiques', icon: <CalendarMonth /> },
    { path: '/gestion-scolarite/admin/fees', label: 'Gérer les frais', icon: <AttachMoney /> },
    { path: '/gestion-scolarite/admin/fee-tranches', label: 'Gérer les Tranches', icon: <Receipt /> },
    { path: '/gestion-scolarite/admin/general-frais', label: 'Frais Généraux', icon: <AttachMoney /> },
    { path: '/gestion-scolarite/admin/refunds', label: 'Remboursements', icon: <Receipt /> },
    { path: '/gestion-scolarite/admin/stats', label: 'Statistiques', icon: <BarChart /> },
  ];

  // Vérifie si l'onglet est actif
  const isActive = (path) => location.pathname === path;

  // Titre dynamique de l'AppBar
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Tableau de Bord Admin';
  };

  // Composant de Bienvenue (affiché uniquement sur /admin)
  const DefaultDashboard = () => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 6 },
        borderRadius: 4,
        bgcolor: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        minHeight: '60vh'
      }}
    >
      <School sx={{ fontSize: 80, color: colors.accent, opacity: 0.8 }} />
      <Typography variant="h4" fontWeight={900} color={colors.primary}>
        Bienvenue dans l'Espace Administrateur
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
        Gérez les années académiques, configurez les frais de scolarité et suivez les paiements de l'établissement.
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Sélectionnez une option dans le menu latéral pour commencer.
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.bgLight }}>
      {/* --- SIDEBAR --- */}
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
            borderRight: 'none',
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: 2 }}>
            <School sx={{ color: colors.accent }} />
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 1 }}>
            SCOLARITÉ
          </Typography>
        </Box>

        <List sx={{ px: 2, flexGrow: 1 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: active ? colors.accent : 'transparent',
                    color: active ? 'white' : 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: active ? colors.accent : 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 700 : 500 }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* --- PROFIL & DECONNEXION --- */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: '#FF6B6B' }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><Logout /></ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* --- ZONE PRINCIPALE --- */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #E5E7EB' }}>
          <Toolbar sx={{ justifyContent: 'space-between', height: 80 }}>
            <Typography variant="h5" fontWeight={800} color={colors.primary}>
              {getPageTitle()}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton><Badge badgeContent={3} color="error"><Notifications /></Badge></IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: colors.primary, width: 35, height: 35 }}>A</Avatar>
                <Typography variant="body2" fontWeight={700} color="text.primary">Admin</Typography>
              </Stack>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
          <Container maxWidth="xl" disableGutters>
            {/* LOGIQUE DE RENDU : Si on est sur /admin, on montre le dashboard, sinon on montre la sous-page */}
            {location.pathname === '/admin' || location.pathname === '/admin/' 
              ? <DefaultDashboard /> 
              : <Outlet />
            }
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;