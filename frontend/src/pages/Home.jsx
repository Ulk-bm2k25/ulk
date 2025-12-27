import { Box, Typography, Grid, Paper, Button, Stack, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  MonetizationOn as MoneyIcon,
  TrendingUp as StatsIcon,
  CheckCircle as CheckIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';

const stats = [
  {
    title: 'Total Remboursements',
    value: '24',
    change: '+12%',
    color: '#1976d2',
    icon: <MoneyIcon />,
  },
  {
    title: 'En Attente',
    value: '8',
    change: '-2',
    color: '#FF9800',
    icon: <ScheduleIcon />,
  },
  {
    title: 'Approuvés',
    value: '14',
    change: '+5',
    color: '#4CAF50',
    icon: <CheckIcon />,
  },
  {
    title: 'Montant Total',
    value: '1.250.000 FCFA',
    change: '+18%',
    color: '#9C27B0',
    icon: <AttachMoneyIcon />,
  },
];

const quickActions = [
  { title: 'Nouveau Remboursement', path: '/remboursements', color: '#1976d2' },
  { title: 'Voir Statistiques', path: '/dashboard', color: '#4CAF50' },
  { title: 'Exporter Données', path: '#', color: '#FF9800' },
  { title: 'Paramètres', path: '#', color: '#9C27B0' },
];

function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Bienvenue sur École+
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez efficacement les remboursements des frais scolaires
        </Typography>
      </Box>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  bgcolor: alpha(stat.color, 0.1),
                  borderRadius: '0 0 0 80px',
                }}
              />
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: alpha(stat.color, 0.2),
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {stat.value}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  color: stat.change.startsWith('+') ? 'success.main' : 'error.main',
                  fontWeight: 500,
                }}
              >
                {stat.change} ce mois
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Actions rapides */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Actions Rapides
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(action.path)}
                sx={{
                  p: 2,
                  height: 80,
                  borderRadius: 2,
                  borderColor: alpha(action.color, 0.3),
                  color: action.color,
                  '&:hover': {
                    borderColor: action.color,
                    bgcolor: alpha(action.color, 0.1),
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {action.title}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Section information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Prochains Remboursements
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { nom: 'Martin Dubois', montant: '75.000 FCFA', date: '15/12/2024' },
                { nom: 'Sophie Moreau', montant: '50.000 FCFA', date: '18/12/2024' },
                { nom: 'Lucas Bernard', montant: '120.000 FCFA', date: '20/12/2024' },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: index === 0 ? 'primary.light' : 'background.default',
                    color: index === 0 ? 'primary.contrastText' : 'inherit',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {item.nom}
                    </Typography>
                    <Typography variant="caption">
                      Échéance: {item.date}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {item.montant}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Statistiques Mensuelles
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body2">Demandes traitées</Typography>
                <Typography variant="body2" fontWeight={600}>85%</Typography>
              </Stack>
              <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ width: '85%', height: '100%', bgcolor: 'success.main' }} />
              </Box>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3, mb: 2 }}>
                <Typography variant="body2">Temps moyen de traitement</Typography>
                <Typography variant="body2" fontWeight={600}>3.2 jours</Typography>
              </Stack>
              <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ width: '65%', height: '100%', bgcolor: 'warning.main' }} />
              </Box>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3, mb: 2 }}>
                <Typography variant="body2">Taux de satisfaction</Typography>
                <Typography variant="body2" fontWeight={600}>94%</Typography>
              </Stack>
              <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ width: '94%', height: '100%', bgcolor: 'primary.main' }} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;