// src/pages/admin/Classes.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, Typography,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, Tooltip, LinearProgress,
  Alert, MenuItem, Select, FormControl, InputLabel,
  Switch, FormControlLabel, CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const levelOptions = [
  { value: '', label: 'Non spécifié' },
  { value: 'Maternelle', label: 'Maternelle' },
  { value: 'CP', label: 'CP' },
  { value: 'CE1', label: 'CE1' },
  { value: 'CE2', label: 'CE2' },
  { value: 'CM1', label: 'CM1' },
  { value: 'CM2', label: 'CM2' },
  { value: '6ème', label: '6ème' },
  { value: '5ème', label: '5ème' },
  { value: '4ème', label: '4ème' },
  { value: '3ème', label: '3ème' },
  { value: 'Seconde', label: 'Seconde' },
  { value: 'Première', label: 'Première' },
  { value: 'Terminale', label: 'Terminale' },
  { value: 'Licence 1', label: 'Licence 1' },
  { value: 'Licence 2', label: 'Licence 2' },
  { value: 'Licence 3', label: 'Licence 3' },
  { value: 'Master 1', label: 'Master 1' },
  { value: 'Master 2', label: 'Master 2' },
];

const Classes = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClasse, setEditingClasse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    description: '',
    academic_year_id: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [classeToDelete, setClasseToDelete] = useState(null);

  const queryClient = useQueryClient();

  // ---------------- Queries ----------------
  const { data: classesData, isLoading, error: fetchError } = useQuery(
    'classes',
    async () => {
      const res = await axios.get('/api/classes');
      console.log('📦 classesData:', res.data); // debug
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      onError: (err) => toast.error('Erreur lors du chargement des classes'),
    }
  );

  const { data: academicYearsData, isLoading: yearsLoading } = useQuery(
    'academicYearsForClasses',
    async () => {
      const res = await axios.get('/api/academic-years');
      return res.data;
    },
    { refetchOnWindowFocus: false }
  );

const classes = useMemo(
  () => Array.isArray(classesData?.data) ? classesData.data : [],
  [classesData]
);
const academicYears = useMemo(
  () => Array.isArray(academicYearsData?.data) ? academicYearsData.data : [],
  [academicYearsData]
);
  const currentAcademicYear = useMemo(() => academicYears.find(y => y.is_current) || academicYears[0], [academicYears]);

  // ---------------- Mutations ----------------
  const classeMutation = useMutation(
    (data) => editingClasse
      ? axios.put(`/api/classes/${editingClasse.id}`, data)
      : axios.post('/api/classes', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('classes');
        toast.success(editingClasse ? 'Classe mise à jour' : 'Classe créée');
        handleCloseDialog();
      },
      onError: (error) => {
        console.error(error);
        if (error.response?.status === 422) setErrors(error.response.data.errors || {});
        toast.error('Erreur lors de la création/modification');
      },
    }
  );

  const deleteMutation = useMutation(
    (id) => axios.delete(`/api/classes/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('classes');
        toast.success('Classe supprimée');
        setOpenDeleteDialog(false);
      },
      onError: (err) => toast.error(err.response?.data?.error || 'Erreur suppression'),
    }
  );

  // ---------------- Handlers ----------------
  const handleOpenDialog = (classe = null) => {
    setEditingClasse(classe);
    setErrors({});
    if (classe) {
      setFormData({
        name: classe.name || '',
        level: classe.level || '',
        description: classe.description || '',
        academic_year_id: classe.academic_year_id?.toString() || '',
        is_active: classe.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        level: '',
        description: '',
        academic_year_id: currentAcademicYear?.id?.toString() || '',
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClasse(null);
    setFormData({ name: '', level: '', description: '', academic_year_id: '', is_active: true });
    setErrors({});
  };

  const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      level: formData.level || null,
      description: formData.description?.trim() || null,
      academic_year_id: parseInt(formData.academic_year_id),
      is_active: formData.is_active,
    };
    classeMutation.mutate(payload);
  };

  const handleDelete = (classe) => {
    setClasseToDelete(classe);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => classeToDelete && deleteMutation.mutate(classeToDelete.id);

  // ---------------- Loading ----------------
  if (isLoading || yearsLoading) return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
      <LinearProgress sx={{ width: 200, mb: 2 }} />
      <Typography>Chargement des données...</Typography>
    </Box>
  );

  // ---------------- Render ----------------
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            <Box display="flex" alignItems="center" gap={1}><SchoolIcon color="primary" /> Gestion des Classes</Box>
          </Typography>
          <Typography variant="body2" color="textSecondary">{classes.length} classe(s) | {academicYears.length} année(s)</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Nouvelle Classe</Button>
      </Box>

      {fetchError && <Alert severity="error">Erreur chargement classes</Alert>}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Classe</TableCell>
                  <TableCell>Niveau</TableCell>
                  <TableCell>Année</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Aucune classe disponible
                    </TableCell>
                  </TableRow>
                ) : classes.map(classe => (
                  <TableRow key={classe.id}>
                    <TableCell>{classe.name}</TableCell>
                    <TableCell>{classe.level || '-'}</TableCell>
                    <TableCell>{classe.academic_year?.name || '-'}</TableCell>
                    <TableCell>{classe.is_active ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>{classe.description || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleOpenDialog(classe)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(classe)} color="error"><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Classes;
