import React, { useState, useMemo } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Chip,
  CircularProgress, Alert, FormControl, InputLabel, Select,
  Switch, FormControlLabel, Grid, Tooltip, Card, CardContent,Stack
} from '@mui/material';
import {
  Add, Edit, Delete, AttachMoney, FilterList, Search
} from '@mui/icons-material';
// Correction de l'import pour TanStack Query v5
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

// --- CONSTANTES ---
const STUDY_LEVELS = [
  'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
  '6e', '5e', '4e', '3e',
  '2nd-C', '2nd-D', '2nd-A', '2nd-B',
  '1ère-C', '1ère-D', '1ère-A', '1ère-B',
  'Terminale-A', 'Terminale-B', 'Terminale-C', 'Terminale-D',
];

const FEE_TYPES = [
  { value: 'inscription', label: "Frais d'inscription", color: 'primary' },
  { value: 'scolarite', label: 'Frais de scolarité', color: 'secondary' },
  { value: 'autres', label: 'Autres frais', color: 'default' },
];

const EMPTY_FORM = {
  name: '',
  type: 'scolarite',
  total_amount: '',
  description: '',
  academic_year_id: '',
  study_level: '',
  is_active: true,
  min_tranches: 3,
  max_tranches: 6,
};

export default function Fees() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  // === RÉCUPÉRATION DES FRAIS ===
  const { data: fees = [], isLoading: feesLoading, isError: feesError } = useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const response = await api.get('/fees');
      // Normalisation des données Laravel (data.data ou data)
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    },
    retry: 1
  });

  // === RÉCUPÉRATION DES ANNÉES ACADÉMIQUES ===
  const { data: years = [], isLoading: yearsLoading } = useQuery({
    queryKey: ['academic-years'],
    queryFn: async () => {
      const response = await api.get('/academic-years');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    }
  });

  const currentYear = useMemo(() => years.find((y) => y.is_current), [years]);

  // === FILTRAGE ===
  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchesType = filterType === 'all' || fee.type === filterType;
      const matchesLevel = filterLevel === 'all' || fee.study_level === filterLevel;
      return matchesType && matchesLevel;
    });
  }, [fees, filterType, filterLevel]);

  // === MUTATION SAUVEGARDE ===
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      return editing 
        ? api.put(`/fees/${editing.id}`, payload)
        : api.post('/fees', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      toast.success(editing ? 'Frais modifié' : 'Frais créé');
      handleClose();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Erreur d'enregistrement";
      toast.error(msg);
      if (err.response?.status === 422) setErrors(err.response.data.errors);
    }
  });

  // === HANDLERS ===
  const handleOpen = (fee = null) => {
    setEditing(fee);
    if (fee) {
      setForm({ ...fee, total_amount: fee.total_amount?.toString() });
    } else {
      setForm({ ...EMPTY_FORM, academic_year_id: currentYear?.id || '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  if (feesLoading || yearsLoading) {
    return <Box p={5} textAlign="center"><CircularProgress /><Typography sx={{mt:2}}>Chargement...</Typography></Box>;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="800" color="primary">
          <AttachMoney sx={{ fontSize: 35, mb: -1 }} /> Gestion des Frais
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ borderRadius: 2 }}>
          Nouveau frais
        </Button>
      </Box>

      {/* FILTRES */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Type de frais"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">Tous les types</MenuItem>
            {FEE_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Niveau d'étude"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <MenuItem value="all">Tous les niveaux</MenuItem>
            {STUDY_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>

      {/* TABLEAU */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>NOM</strong></TableCell>
              <TableCell><strong>TYPE</strong></TableCell>
              <TableCell><strong>NIVEAU</strong></TableCell>
              <TableCell><strong>MONTANT</strong></TableCell>
              <TableCell><strong>STATUT</strong></TableCell>
              <TableCell align="right"><strong>ACTIONS</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFees.map((fee) => (
              <TableRow key={fee.id} hover>
                <TableCell>{fee.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={FEE_TYPES.find(t => t.value === fee.type)?.label} 
                    color={FEE_TYPES.find(t => t.value === fee.type)?.color}
                    size="small"
                  />
                </TableCell>
                <TableCell>{fee.study_level}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {Number(fee.total_amount).toLocaleString()} FCFA
                </TableCell>
                <TableCell>
                  <Switch checked={fee.is_active} disabled size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(fee)} color="primary"><Edit /></IconButton>
                  <IconButton color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* FORMULAIRE DIALOG */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {editing ? 'Modifier le frais' : 'Créer un frais'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Nom du frais" required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  error={!!errors.name} helperText={errors.name}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select fullWidth label="Type"
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                >
                  {FEE_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Montant (FCFA)" type="number" required
                  value={form.total_amount}
                  onChange={(e) => setForm({...form, total_amount: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select fullWidth label="Niveau" required
                  value={form.study_level}
                  onChange={(e) => setForm({...form, study_level: e.target.value})}
                >
                  {STUDY_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select fullWidth label="Année Académique" required
                  value={form.academic_year_id}
                  onChange={(e) => setForm({...form, academic_year_id: e.target.value})}
                >
                  {years.map(y => <MenuItem key={y.id} value={y.id}>{y.name}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="contained" loading={saveMutation.isPending}>
              Enregistrer
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
