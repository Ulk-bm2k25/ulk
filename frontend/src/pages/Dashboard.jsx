import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Données pour les graphiques
const monthlyData = [
  { month: 'Jan', remboursements: 4, montant: 450000 },
  { month: 'Fév', remboursements: 6, montant: 620000 },
  { month: 'Mar', remboursements: 3, montant: 380000 },
  { month: 'Avr', remboursements: 8, montant: 950000 },
  { month: 'Mai', remboursements: 5, montant: 520000 },
  { month: 'Jun', remboursements: 7, montant: 780000 },
];

const statusData = [
  { name: 'En attente', value: 8, color: '#FF9800' },
  { name: 'En cours', value: 4, color: '#2196F3' },
  { name: 'Approuvés', value: 14, color: '#4CAF50' },
  { name: 'Refusés', value: 2, color: '#F44336' },
];

const motifData = [
  { motif: 'Double paiement', count: 12 },
  { motif: 'Erreur montant', count: 8 },
  { motif: 'Désistement', count: 5 },
  { motif: 'Autre', count: 3 },
];

function Dashboard() {
  const [period, setPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-12-31',
  });

  const handleExport = () => {
    // Logique d'export
    console.log('Export des données...');
  };

  const handleRefresh = () => {
    // Logique de rafraîchissement
    console.log('Rafraîchissement des données...');
  };

  return (
    <Box>
      {/* En-tête avec filtres */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Tableau de Bord
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analyse et statistiques des remboursements
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Période</InputLabel>
            <Select
              value={period}
              label="Période"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="week">Semaine</MenuItem>
              <MenuItem value="month">Mois</MenuItem>
              <MenuItem value="quarter">Trimestre</MenuItem>
              <MenuItem value="year">Année</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => console.log('Ouvrir filtres avancés')}
          >
            Filtres
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Actualiser
          </Button>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ bgcolor: 'primary.main' }}
          >
            Exporter
          </Button>
        </Stack>
      </Box>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Remboursements
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: 'primary.main' }}>
                    28
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'success.main' }}>
                    ↑ 12% ce mois
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha('#1976d2', 0.1),
                    color: 'primary.main',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Montant Total
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#9C27B0' }}>
                    3.7M FCFA
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'success.main' }}>
                    ↑ 18% ce mois
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha('#9C27B0', 0.1),
                    color: '#9C27B0',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    En Attente
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#FF9800' }}>
                    8
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    ↓ 2 cette semaine
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha('#FF9800', 0.1),
                    color: '#FF9800',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Taux de Traitement
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#4CAF50' }}>
                    85%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'success.main' }}>
                    ↑ 5% ce mois
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha('#4CAF50', 0.1),
                    color: '#4CAF50',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3}>
        {/* Évolution mensuelle */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Évolution Mensuelle
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'montant') {
                        return [`${value.toLocaleString()} FCFA`, 'Montant'];
                      }
                      return [value, 'Nombre de remboursements'];
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="remboursements"
                    name="Nombre de remboursements"
                    fill="#1976d2"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="montant"
                    name="Montant total"
                    fill="#4CAF50"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Répartition par statut */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Répartition par Statut
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Nombre']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Motifs fréquents */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Motifs de Remboursement
            </Typography>
            <Box sx={{ mt: 2 }}>
              {motifData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: 'background.default',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {item.motif}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {item.count} demandes
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Performance de traitement */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Performance de Traitement
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Temps moyen</Typography>
                    <Typography variant="body2" fontWeight={600}>3.2 jours</Typography>
                  </Stack>
                  <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4 }}>
                    <Box sx={{ width: '65%', height: '100%', bgcolor: 'primary.main', borderRadius: 4 }} />
                  </Box>
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Taux de résolution</Typography>
                    <Typography variant="body2" fontWeight={600}>92%</Typography>
                  </Stack>
                  <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4 }}>
                    <Box sx={{ width: '92%', height: '100%', bgcolor: 'success.main', borderRadius: 4 }} />
                  </Box>
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Satisfaction</Typography>
                    <Typography variant="body2" fontWeight={600}>94%</Typography>
                  </Stack>
                  <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4 }}>
                    <Box sx={{ width: '94%', height: '100%', bgcolor: 'warning.main', borderRadius: 4 }} />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;