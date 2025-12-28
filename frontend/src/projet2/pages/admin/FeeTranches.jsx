import React, { useState, useMemo } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Chip, Grid,
  FormControl, InputLabel, Select, CircularProgress, InputAdornment, Card, CardContent, LinearProgress
} from '@mui/material';
import {
  Add, Edit, Delete, Schedule, Warning,
  CheckCircle, ListAlt
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale'; 
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

/* ==================================================
   DONNÉES DE TEST (MOCK) - Pour travailler sans Backend
   ================================================== */
const MOCK_FEES = [
  { id: 1, name: 'Scolarité 2023-2024', study_level: 'Licence 1', total_amount: 500000, max_tranches: 5 },
  { id: 2, name: 'Scolarité 2023-2024', study_level: 'Master 1', total_amount: 800000, max_tranches: 4 }
];

const MOCK_TRANCHES = [
  { id: 101, installment_number: 1, name: 'Inscription', amount: 150000, due_date: '2023-10-01', fee_id: 1 },
  { id: 102, installment_number: 2, name: 'Tranche 2', amount: 175000, due_date: '2024-01-15', fee_id: 1 },
];

/* =======================
   HELPERS
   ======================= */
const currency = (v) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(v || 0);

const getDueDateStatus = (dueDate) => {
  if (!dueDate) return 'pending';
  const today = new Date().setHours(0, 0, 0, 0);
  const due = new Date(dueDate).setHours(0, 0, 0, 0);
  if (due < today) return 'overdue';
  if (due === today) return 'today';
  return 'pending';
};

/* =======================
   COMPONENT
   ======================= */
export default function FeeTranches() {
  // --- States ---
  const [selectedScolariteFee, setSelectedScolariteFee] = useState(MOCK_FEES[0].id);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    amount: '',
    due_date: null,
    installment_number: 1,
  });

  // --- Simulation des données (Remplace useQuery) ---
  const scolariteFees = MOCK_FEES;
// Remplace la ligne 67 par :
const tranches = MOCK_TRANCHES.filter(t => t.fee_id === selectedScolariteFee);
  const feesLoading = false;

  // --- Logique Métier ---
  const selectedFeeObj = useMemo(() => 
    scolariteFees.find(f => f.id === selectedScolariteFee), 
    [selectedScolariteFee]
  );

  const stats = useMemo(() => {
    if (!selectedFeeObj) return null;
    const totalTranches = tranches.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const feeAmount = selectedFeeObj.total_amount || 0;
    
    return {
      totalTranches,
      feeAmount,
      percentage: feeAmount > 0 ? (totalTranches / feeAmount * 100) : 0,
      count: tranches.length,
      maxAllowed: selectedFeeObj.max_tranches
    };
  }, [selectedFeeObj, tranches]);

  const canAddMore = stats && stats.count < stats.maxAllowed;

  // --- Handlers ---
  const handleOpenForm = (tranche = null) => {
    setEditing(tranche);
    if (tranche) {
      setForm({
        name: tranche.name,
        amount: tranche.amount,
        due_date: parseISO(tranche.due_date),
        installment_number: tranche.installment_number
      });
    } else {
      const nextNum = tranches.length > 0 ? Math.max(...tranches.map(t => t.installment_number)) + 1 : 1;
      setForm({ name: `Tranche ${nextNum}`, amount: '', due_date: null, installment_number: nextNum });
    }
    setOpenForm(true);
  };

  const onSave = (e) => {
    e.preventDefault();
    toast.success("Mode démo : Enregistrement simulé");
    setOpenForm(false);
  };

  if (feesLoading) return <Box p={5} textAlign="center"><CircularProgress /></Box>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Gestion des Tranches
        </Typography>

        {/* SELECTOR */}
        <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <FormControl fullWidth>
                  <InputLabel>Frais de scolarité cible</InputLabel>
                  <Select
                    value={selectedScolariteFee}
                    onChange={(e) => setSelectedScolariteFee(e.target.value)}
                    label="Frais de scolarité cible"
                  >
                    {scolariteFees.map(fee => (
                      <MenuItem key={fee.id} value={fee.id}>
                        {fee.name} - {fee.study_level} ({currency(fee.total_amount)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} display="flex" gap={1}>
                <Button fullWidth variant="outlined" startIcon={<ListAlt />}>Bulk</Button>
                <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={() => handleOpenForm()} 
                    disabled={!canAddMore}
                >
                    Ajouter
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {selectedFeeObj && (
          <>
            {/* PROGRESS STATS */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2" color="textSecondary">Couverture du montant total</Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {currency(stats.totalTranches)} / {currency(stats.feeAmount)} ({Math.round(stats.percentage)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(stats.percentage, 100)} 
                  sx={{ height: 10, borderRadius: 5, bgcolor: '#eee' }}
                />
              </CardContent>
            </Card>

            {/* TABLE */}
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f4f6f8' }}>
                  <TableRow>
                    <TableCell width={80}>N°</TableCell>
                    <TableCell>Désignation</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Échéance</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tranches.map((t) => {
                    const status = getDueDateStatus(t.due_date);
                    return (
                      <TableRow key={t.id} hover>
                        <TableCell><Chip label={t.installment_number} size="small" variant="outlined" /></TableCell>
                        <TableCell><strong>{t.name}</strong></TableCell>
                        <TableCell fontWeight="bold">{currency(t.amount)}</TableCell>
                        <TableCell>
                            {t.due_date ? format(parseISO(t.due_date), 'dd MMMM yyyy', { locale: fr }) : '-'}
                        </TableCell>
                        <TableCell>
                          {status === 'overdue' && <Chip label="En retard" color="error" size="small" icon={<Warning />} />}
                          {status === 'today' && <Chip label="Aujourd'hui" color="warning" size="small" icon={<Schedule />} />}
                          {status === 'pending' && <Chip label="À venir" color="success" size="small" icon={<CheckCircle />} />}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleOpenForm(t)} color="primary" size="small"><Edit /></IconButton>
                          <IconButton color="error" size="small"><Delete /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {tranches.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            Aucune tranche définie pour ce frais.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* MODAL FORM */}
        <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="xs">
          <form onSubmit={onSave}>
            <DialogTitle>{editing ? 'Modifier la tranche' : 'Nouvelle tranche'}</DialogTitle>
            <DialogContent dividers>
              <TextField 
                fullWidth label="Nom de la tranche" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                sx={{ mb: 2, mt: 1 }}
              />
              <TextField 
                fullWidth label="Montant" type="number" 
                value={form.amount} 
                onChange={e => setForm({...form, amount: e.target.value})}
                InputProps={{ endAdornment: <InputAdornment position="end">FCFA</InputAdornment> }}
                sx={{ mb: 2 }}
              />
              <DatePicker
                label="Date d'échéance"
                value={form.due_date}
                onChange={val => setForm({...form, due_date: val})}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenForm(false)}>Annuler</Button>
              <Button type="submit" variant="contained">Enregistrer</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}