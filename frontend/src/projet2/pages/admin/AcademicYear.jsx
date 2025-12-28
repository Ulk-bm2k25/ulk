import React, { useState, useMemo } from 'react';
import {
  Box, Button, Card, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, FormControlLabel,
  Switch, Tooltip, Alert, Stack
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

// Données de secours
const MOCK_DATA = [
  { id: 1, name: '2023-2024', start_date: '2023-09-01', end_date: '2024-06-30', is_current: false },
  { id: 2, name: '2024-2025', start_date: '2024-09-01', end_date: '2025-06-30', is_current: true },
];

const AcademicYear = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [yearToDelete, setYearToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '', start_date: null, end_date: null, is_current: false,
  });

  // --- RÉCUPÉRATION ---
  const { data: rawData, isError } = useQuery({
    queryKey: ['academicYears'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/academic-years');
        return res.data;
      } catch (err) {
        console.warn("API non joignable, utilisation des données simulées.");
        return MOCK_DATA;
      }
    },
    initialData: MOCK_DATA,
  });

  /**
   * SÉCURITÉ ANTI-CRASH : 
   * On s'assure que academicYears est TOUJOURS un tableau.
   * Si rawData est { data: [...] }, on prend le contenu de data.
   */
  const academicYears = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray(rawData.data)) return rawData.data;
    return [];
  }, [rawData]);

  // --- MUTATION ---
  const yearMutation = useMutation({
    mutationFn: (data) => editingYear 
      ? axios.put(`/api/academic-years/${editingYear.id}`, data)
      : axios.post('/api/academic-years', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      toast.success('Enregistré avec succès');
      handleCloseDialog();
    },
    onError: () => {
      toast.error('Erreur (ou mode simulation actif)');
      handleCloseDialog();
    }
  });

  // --- GESTION FORMULAIRE ---
  const handleOpenDialog = (year = null) => {
    if (year) {
      setEditingYear(year);
      setFormData({
        name: year.name,
        start_date: year.start_date ? new Date(year.start_date) : null,
        end_date: year.end_date ? new Date(year.end_date) : null,
        is_current: year.is_current,
      });
    } else {
      setEditingYear(null);
      setFormData({ name: '', start_date: null, end_date: null, is_current: false });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingYear(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    yearMutation.mutate(formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#1a237e">
              Années Académiques
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les cycles scolaires de l'établissement
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
          >
            Nouvelle Année
          </Button>
        </Stack>

        {isError && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Connexion au serveur impossible. Affichage des données locales.
          </Alert>
        )}

        {/* Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>ANNÉE</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>DÉBUT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>FIN</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>STATUT</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {academicYears.length > 0 ? (
                  academicYears.map((year) => (
                    <TableRow key={year.id || year.name} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{year.name}</TableCell>
                      <TableCell>{new Date(year.start_date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{new Date(year.end_date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Chip 
                          label={year.is_current ? "Actuelle" : "Archivée"} 
                          color={year.is_current ? "success" : "default"}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier">
                          <IconButton onClick={() => handleOpenDialog(year)} color="primary" size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <span>
                            <IconButton 
                              disabled={year.is_current} 
                              onClick={() => { setYearToDelete(year); setOpenDeleteDialog(true); }}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      Aucune donnée disponible
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Dialog Formulaire */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
          <form onSubmit={handleSubmit}>
            <DialogTitle sx={{ fontWeight: 700 }}>
              {editingYear ? 'Modifier l’année' : 'Nouvelle année scolaire'}
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Nom (ex: 2025-2026)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <DatePicker
                  label="Date de début"
                  value={formData.start_date}
                  onChange={(v) => setFormData({ ...formData, start_date: v })}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
                <DatePicker
                  label="Date de fin"
                  value={formData.end_date}
                  onChange={(v) => setFormData({ ...formData, end_date: v })}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_current}
                      onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                    />
                  }
                  label="Définir comme année scolaire actuelle"
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button type="submit" variant="contained" sx={{ bgcolor: '#1a237e' }}>
                Enregistrer
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Confirmation Suppression */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Supprimer l'année {yearToDelete?.name} ?</DialogTitle>
          <DialogContent>
            Cette action est irréversible et peut affecter les inscriptions liées.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => {
                toast.success("Supprimé (simulation)");
                setOpenDeleteDialog(false);
              }}
            >
              Supprimer définitivement
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AcademicYear;