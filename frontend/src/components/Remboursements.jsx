import { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Typography,
  IconButton, Grid, Card, CardContent, FormControl,
  InputLabel, Select, MenuItem, Stack, Alert,
  CircularProgress, Badge, Avatar, Tooltip, Divider,
  InputAdornment, Tab, Tabs,
} from '@mui/material';
import {
  MoreVert, CheckCircle, Cancel, AttachFile,
  Download, FilterList, Search, Refresh,
  Add, Visibility, Edit, Delete, Paid,
  PendingActions, CheckCircleOutline,
  Warning, TrendingUp, MonetizationOn,
  Person, AccessTime, Receipt,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Remboursements = () => {
  // États
  const [remboursements, setRemboursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRemboursement, setSelectedRemboursement] = useState(null);
  const [filters, setFilters] = useState({
    statut: 'tous',
    search: '',
    dateDebut: '',
    dateFin: ''
  });
  const [tabValue, setTabValue] = useState(0);
  const [statistiques, setStatistiques] = useState({
    total: 0,
    en_attente: 0,
    approuves: 0,
    payes: 0,
    refuses: 0,
    montant_total: 0,
    montant_paye: 0,
    montant_attente: 0
  });

  // Données fictives pour démonstration
  const mockData = [
    {
      id: 1,
      numero_dossier: 'RMB-2024-001',
      etudiant: { nom: 'Dubois', prenom: 'Martin', matricule: 'MAT-2024-001' },
      montant: 75000,
      motif: 'double_paiement',
      motif_label: 'Double paiement',
      statut: 'en_attente',
      date_demande: '2024-01-15T10:30:00',
      paiement: { reference: 'PAY-001' },
    },
    {
      id: 2,
      numero_dossier: 'RMB-2024-002',
      etudiant: { nom: 'Moreau', prenom: 'Sophie', matricule: 'MAT-2024-002' },
      montant: 50000,
      motif: 'erreur_montant',
      motif_label: 'Erreur de montant',
      statut: 'approuve',
      date_demande: '2024-01-10T14:20:00',
      paiement: { reference: 'PAY-002' },
    },
    {
      id: 3,
      numero_dossier: 'RMB-2024-003',
      etudiant: { nom: 'Bernard', prenom: 'Lucas', matricule: 'MAT-2024-003' },
      montant: 120000,
      motif: 'desistement',
      motif_label: 'Désistement',
      statut: 'refuse',
      date_demande: '2024-01-05T09:15:00',
      paiement: { reference: 'PAY-003' },
    },
    {
      id: 4,
      numero_dossier: 'RMB-2024-004',
      etudiant: { nom: 'Petit', prenom: 'Emma', matricule: 'MAT-2024-004' },
      montant: 30000,
      motif: 'autre',
      motif_label: 'Autre',
      statut: 'paye',
      date_demande: '2024-01-02T16:45:00',
      paiement: { reference: 'PAY-004' },
    },
  ];

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filtrer selon les critères
        let filteredData = [...mockData];
        
        if (filters.statut !== 'tous') {
          filteredData = filteredData.filter(item => item.statut === filters.statut);
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(item =>
            item.numero_dossier.toLowerCase().includes(searchLower) ||
            item.etudiant.nom.toLowerCase().includes(searchLower) ||
            item.etudiant.prenom.toLowerCase().includes(searchLower) ||
            item.etudiant.matricule.toLowerCase().includes(searchLower)
          );
        }
        
        setRemboursements(filteredData);
        
        // Calculer les statistiques
        const stats = {
          total: mockData.length,
          en_attente: mockData.filter(d => d.statut === 'en_attente').length,
          approuves: mockData.filter(d => d.statut === 'approuve').length,
          payes: mockData.filter(d => d.statut === 'paye').length,
          refuses: mockData.filter(d => d.statut === 'refuse').length,
          montant_total: mockData.reduce((sum, d) => sum + d.montant, 0),
          montant_paye: mockData
            .filter(d => d.statut === 'paye')
            .reduce((sum, d) => sum + d.montant, 0),
          montant_attente: mockData
            .filter(d => ['en_attente', 'approuve'].includes(d.statut))
            .reduce((sum, d) => sum + d.montant, 0),
        };
        
        setStatistiques(stats);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.statut, filters.search]);

  // Gestion des statuts
  const getStatusConfig = (statut) => {
    const configs = {
      'en_attente': { 
        color: '#FF9800', 
        icon: <PendingActions />, 
        label: 'En attente',
        bgColor: '#FFF3E0'
      },
      'en_cours': { 
        color: '#2196F3', 
        icon: <AccessTime />, 
        label: 'En cours',
        bgColor: '#E3F2FD'
      },
      'approuve': { 
        color: '#4CAF50', 
        icon: <CheckCircleOutline />, 
        label: 'Approuvé',
        bgColor: '#E8F5E9'
      },
      'refuse': { 
        color: '#F44336', 
        icon: <Warning />, 
        label: 'Refusé',
        bgColor: '#FFEBEE'
      },
      'paye': { 
        color: '#9C27B0', 
        icon: <Paid />, 
        label: 'Payé',
        bgColor: '#F3E5F5'
      }
    };
    return configs[statut] || { color: '#757575', icon: <MoreVert />, label: statut, bgColor: '#F5F5F5' };
  };

  // Formater les montants
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(montant);
  };

  // Mettre à jour le statut
  const updateStatus = (id, newStatus) => {
    setRemboursements(prev => 
      prev.map(item => 
        item.id === id ? { ...item, statut: newStatus } : item
      )
    );
    
    // Mettre à jour les statistiques
    setStatistiques(prev => {
      const item = remboursements.find(r => r.id === id);
      if (!item) return prev;
      
      const oldStatus = item.statut;
      const newStats = { ...prev };
      
      // Décrémenter l'ancien statut
      if (oldStatus === 'en_attente') newStats.en_attente--;
      if (oldStatus === 'approuve') newStats.approuves--;
      if (oldStatus === 'paye') newStats.payes--;
      if (oldStatus === 'refuse') newStats.refuses--;
      
      // Incrémenter le nouveau statut
      if (newStatus === 'en_attente') newStats.en_attente++;
      if (newStatus === 'approuve') {
        newStats.approuves++;
        newStats.montant_attente += item.montant;
      }
      if (newStatus === 'paye') {
        newStats.payes++;
        newStats.montant_paye += item.montant;
        newStats.montant_attente -= item.montant;
      }
      if (newStatus === 'refuse') newStats.refuses++;
      
      return newStats;
    });
  };

  // Gestion des onglets
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const statusMap = ['tous', 'en_attente', 'approuve', 'paye', 'refuse'];
    setFilters({ ...filters, statut: statusMap[newValue] });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Gestion des Remboursements
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les demandes de remboursement des étudiants
        </Typography>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <MonetizationOn />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Montant Total
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {formatMontant(statistiques.montant_total)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <PendingActions />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    En Attente
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="warning.main">
                    {statistiques.en_attente}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <CheckCircleOutline />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Approuvés
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    {statistiques.approuves}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                  <Paid />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Montant Payé
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="secondary.main">
                    {formatMontant(statistiques.montant_paye)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres et actions */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        {/* Onglets */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <Tab label="Tous" />
          <Tab 
            label={
              <Badge badgeContent={statistiques.en_attente} color="warning">
                En attente
              </Badge>
            } 
          />
          <Tab label="Approuvés" />
          <Tab label="Payés" />
          <Tab label="Refusés" />
        </Tabs>

        {/* Barre de recherche et filtres */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date début"
              value={filters.dateDebut}
              onChange={(e) => setFilters({...filters, dateDebut: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date fin"
              value={filters.dateFin}
              onChange={(e) => setFilters({...filters, dateFin: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => setFilters({
                  statut: 'tous',
                  search: '',
                  dateDebut: '',
                  dateFin: ''
                })}
              >
                <Refresh />
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenDialog(true)}
                sx={{ bgcolor: 'primary.main' }}
              >
                <Add /> Nouveau
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des remboursements */}
      <Paper sx={{ borderRadius: 2, bgcolor: 'background.paper', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>N° Dossier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Étudiant</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Motif</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date Demande</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {remboursements.map((remboursement) => {
                  const statusConfig = getStatusConfig(remboursement.statut);
                  return (
                    <TableRow 
                      key={remboursement.id}
                      hover
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {remboursement.numero_dossier}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                            <Person fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {remboursement.etudiant.prenom} {remboursement.etudiant.nom}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {remboursement.etudiant.matricule}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatMontant(remboursement.montant)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={remboursement.motif_label}
                          sx={{ 
                            bgcolor: 'primary.50',
                            color: 'primary.main'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(remboursement.date_demande), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={statusConfig.icon}
                          label={statusConfig.label}
                          sx={{
                            bgcolor: statusConfig.bgColor,
                            color: statusConfig.color,
                            fontWeight: 500,
                            '& .MuiChip-icon': {
                              color: statusConfig.color
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Voir détails">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedRemboursement(remboursement);
                                setOpenDetail(true);
                              }}
                              sx={{ color: 'primary.main' }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {remboursement.statut === 'en_attente' && (
                            <>
                              <Tooltip title="Approuver">
                                <IconButton
                                  size="small"
                                  onClick={() => updateStatus(remboursement.id, 'approuve')}
                                  sx={{ color: 'success.main' }}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Refuser">
                                <IconButton
                                  size="small"
                                  onClick={() => updateStatus(remboursement.id, 'refuse')}
                                  sx={{ color: 'error.main' }}
                                >
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          
                          {remboursement.statut === 'approuve' && (
                            <Tooltip title="Marquer comme payé">
                              <IconButton
                                size="small"
                                onClick={() => updateStatus(remboursement.id, 'paye')}
                                sx={{ color: 'secondary.main' }}
                              >
                                <Paid fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog Nouvelle Demande */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Nouvelle Demande de Remboursement
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Remplissez les informations pour créer une nouvelle demande de remboursement
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Étudiant</InputLabel>
                <Select label="Étudiant">
                  <MenuItem value="1">Martin Dubois (MAT-2024-001)</MenuItem>
                  <MenuItem value="2">Sophie Moreau (MAT-2024-002)</MenuItem>
                  <MenuItem value="3">Lucas Bernard (MAT-2024-003)</MenuItem>
                  <MenuItem value="4">Emma Petit (MAT-2024-004)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Paiement</InputLabel>
                <Select label="Paiement">
                  <MenuItem value="1">PAY-001 - 150.000 FCFA</MenuItem>
                  <MenuItem value="2">PAY-002 - 75.000 FCFA</MenuItem>
                  <MenuItem value="3">PAY-003 - 200.000 FCFA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Montant"
                type="number"
                InputProps={{
                  endAdornment: <Typography>FCFA</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Motif</InputLabel>
                <Select label="Motif">
                  <MenuItem value="double_paiement">Double paiement</MenuItem>
                  <MenuItem value="erreur_montant">Erreur de montant</MenuItem>
                  <MenuItem value="desistement">Désistement</MenuItem>
                  <MenuItem value="erreur_etudiant">Erreur d'étudiant</MenuItem>
                  <MenuItem value="autre">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Commentaire"
                multiline
                rows={3}
                placeholder="Détails supplémentaires..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<AttachFile />}
                component="label"
                fullWidth
              >
                Ajouter une pièce jointe
                <input type="file" hidden />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Logique d'enregistrement
              setOpenDialog(false);
            }}
            sx={{ bgcolor: 'primary.main' }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Détails */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        {selectedRemboursement && (
          <>
            <DialogTitle sx={{ fontWeight: 600 }}>
              Détails du Remboursement
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                      {selectedRemboursement.numero_dossier}
                    </Typography>
                    <Chip
                      label={getStatusConfig(selectedRemboursement.statut).label}
                      sx={{
                        bgcolor: getStatusConfig(selectedRemboursement.statut).bgColor,
                        color: getStatusConfig(selectedRemboursement.statut).color,
                        fontWeight: 600
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Informations de l'étudiant
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <strong>Nom complet:</strong> {selectedRemboursement.etudiant.prenom} {selectedRemboursement.etudiant.nom}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Matricule:</strong> {selectedRemboursement.etudiant.matricule}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Informations du paiement
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <strong>Référence paiement:</strong> {selectedRemboursement.paiement.reference}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Montant remboursement:</strong> {formatMontant(selectedRemboursement.montant)}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Détails de la demande
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <strong>Motif:</strong> {selectedRemboursement.motif_label}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date demande:</strong> {format(new Date(selectedRemboursement.date_demande), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Historique
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      • Demande créée le {format(new Date(selectedRemboursement.date_demande), 'dd/MM/yyyy', { locale: fr })}
                    </Typography>
                    {selectedRemboursement.statut === 'approuve' && (
                      <Typography variant="body2">
                        • Approuvé le {format(new Date(), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                    )}
                    {selectedRemboursement.statut === 'paye' && (
                      <Typography variant="body2">
                        • Payé le {format(new Date(), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                    )}
                  </Stack>
                </Grid>

                {selectedRemboursement.statut === 'en_attente' && (
                  <Grid item xs={12}>
                    <Divider />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                      Actions rapides
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        startIcon={<CheckCircle />}
                        onClick={() => {
                          updateStatus(selectedRemboursement.id, 'approuve');
                          setOpenDetail(false);
                        }}
                        sx={{ bgcolor: 'success.main' }}
                      >
                        Approuver
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => {
                          updateStatus(selectedRemboursement.id, 'refuse');
                          setOpenDetail(false);
                        }}
                        sx={{ borderColor: 'error.main', color: 'error.main' }}
                      >
                        Refuser
                      </Button>
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetail(false)}>
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Remboursements;