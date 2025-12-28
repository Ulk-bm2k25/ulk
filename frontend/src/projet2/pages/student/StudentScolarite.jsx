import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Alert, Grid, Chip, 
  Divider, LinearProgress, Dialog, DialogTitle, DialogContent, 
  DialogActions, Avatar, Stack, useMediaQuery, useTheme,
  Tabs, Tab, TextField, MenuItem
} from '@mui/material';
import {
  Paid, CheckCircle, ReceiptLong, Today, 
  History, AddCircle, InfoOutlined, Payments
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const StudentScolarite = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0); // 0: Paiements, 1: Remboursements
  const [openRefundDialog, setOpenRefundDialog] = useState(false);

  const colors = {
    sidebar: '#2A2F4F',
    accent: '#F4A261',
    bgLight: '#F8F9FC',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF4444'
  };

  // === ÉTATS SIMULÉS ===
  const [mockPayments, setMockPayments] = useState([{ fee_tranche_id: 1, status: 'completed' }]);
  const [mockRefunds, setMockRefunds] = useState([
    { id: 1, numero: 'RMB-20241228-0001', montant: 25000, motif: 'double_paiement', statut: 'en_attente', date: '28/12/2024' }
  ]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';

  const getStatusChip = (statut) => {
    const config = {
      en_attente: { color: 'warning', label: 'En attente' },
      approuve: { color: 'info', label: 'Approuvé' },
      paye: { color: 'success', label: 'Remboursé' },
      refuse: { color: 'error', label: 'Refusé' }
    };
    const s = config[statut] || config.en_attente;
    return <Chip label={s.label} color={s.color} size="small" sx={{ fontWeight: 'bold' }} />;
  };

  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      
      {/* 1. ONGLETS DE NAVIGATION */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab icon={<ReceiptLong fontSize="small" />} iconPosition="start" label="Ma Scolarité" />
          <Tab icon={<History fontSize="small" />} iconPosition="start" label="Mes Remboursements" />
        </Tabs>
      </Box>

      {/* CONTENU : SCOLARITÉ (Paiements) */}
      {tabValue === 0 && (
        <Box>
          {/* STATS RAPIDES (Code existant conservé) */}
          <Grid container spacing={2} mb={3}>
            {[
              { label: 'Total Scolarité', value: formatCurrency(500000), color: colors.sidebar, icon: <ReceiptLong /> },
              { label: 'Déjà Payé', value: formatCurrency(200000), color: colors.success, icon: <CheckCircle /> },
              { label: 'Reste à Payer', value: formatCurrency(300000), color: colors.accent, icon: <Paid /> },
            ].map((item, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Card sx={{ bgcolor: colors.bgLight, borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                    <Avatar sx={{ bgcolor: 'white', color: item.color, width: 45, height: 45 }}>{item.icon}</Avatar>
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="text.secondary">{item.label}</Typography>
                      <Typography variant="subtitle1" fontWeight="800" color={item.color}>{item.value}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ... (Reste de ton code pour les tranches de paiement) ... */}
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
            Note: Vous pouvez consulter vos tranches et effectuer vos paiements ci-dessous.
          </Typography>
        </Box>
      )}

      {/* CONTENU : REMBOURSEMENTS */}
      {tabValue === 1 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6" fontWeight="800" color={colors.sidebar}>Mes Demandes</Typography>
              <Typography variant="caption" color="text.secondary">Suivez l'état de vos demandes de remboursement</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddCircle />} 
              onClick={() => setOpenRefundDialog(true)}
              sx={{ bgcolor: colors.accent, '&:hover': { bgcolor: '#e6914d' } }}
            >
              Nouvelle Demande
            </Button>
          </Stack>

          {mockRefunds.length === 0 ? (
            <Alert icon={<InfoOutlined />} severity="info" sx={{ borderRadius: '12px' }}>
              Vous n'avez aucune demande de remboursement en cours.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {mockRefunds.map((refund) => (
                <Grid item xs={12} key={refund.id}>
                  <Card sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="caption" color="text.secondary" display="block">N° Dossier</Typography>
                          <Typography variant="subtitle2" fontWeight="700">{refund.numero}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <Typography variant="caption" color="text.secondary" display="block">Montant</Typography>
                          <Typography variant="subtitle1" fontWeight="800" color={colors.sidebar}>{formatCurrency(refund.montant)}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary" display="block">Motif</Typography>
                          <Typography variant="body2">{refund.motif.replace('_', ' ')}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <Typography variant="caption" color="text.secondary" display="block">Statut</Typography>
                          {getStatusChip(refund.statut)}
                        </Grid>
                        <Grid item xs={6} sm={2} sx={{ textAlign: 'right' }}>
                           <Typography variant="caption" color="text.secondary" display="block">Date</Typography>
                           <Typography variant="body2">{refund.date}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* DIALOGUE : CRÉER UN REMBOURSEMENT */}
      <Dialog open={openRefundDialog} onClose={() => setOpenRefundDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: '800', borderBottom: '1px solid #eee' }}>Demande de Remboursement</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField fullWidth label="Montant à rembourser (FCFA)" type="number" variant="outlined" />
            <TextField fullWidth select label="Motif du remboursement" defaultValue="double_paiement">
              <MenuItem value="double_paiement">Double paiement</MenuItem>
              <MenuItem value="erreur_montant">Erreur de montant</MenuItem>
              <MenuItem value="desistement">Désistement</MenuItem>
              <MenuItem value="autre">Autre</MenuItem>
            </TextField>
            <TextField fullWidth multiline rows={3} label="Description / Justification" placeholder="Expliquez votre demande..." />
            <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>
              Toute demande fera l'objet d'une vérification par le service comptabilité.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenRefundDialog(false)} color="inherit">Annuler</Button>
          <Button 
            variant="contained" 
            onClick={() => { toast.success("Demande envoyée !"); setOpenRefundDialog(false); }}
            sx={{ bgcolor: colors.sidebar }}
          >
            Envoyer la demande
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentScolarite;