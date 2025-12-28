import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Button,
  Grid, TextField, InputAdornment, Stack, Avatar
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  CheckCircle,
  Error as ErrorIcon,
  History,
  AccountBalanceWallet
} from '@mui/icons-material'
import { useQuery } from 'react-query'
import { paymentService } from '../../services/feeService'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const MyPayments = () => {
  const navigate = useNavigate()
  const [search, setSearch] = React.useState('')
  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)

  const colors = {
    sidebar: '#2A2F4F',
    accent: '#F4A261',
    bgLight: '#F8F9FC',
    success: '#66BB6A',
    error: '#EF4444'
  }

  const { data: paymentsData, isLoading } = useQuery(
    'myPayments',
    paymentService.getMyPayments,
    { refetchOnWindowFocus: false }
  )

  const handleViewReceipt = (paymentId) => {
    paymentService.generateReceipt(paymentId).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `recu-${paymentId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    })
  }

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('fr-FR').format(amount || 0) + ' XOF'

  const filteredPayments = paymentsData?.data?.data?.filter(payment => {
    const matchesSearch = !search || 
      payment.reference?.toLowerCase().includes(search.toLowerCase()) ||
      payment.tranche?.label?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  }) || []

  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      
      {/* 1. INDICATEURS DE PAIEMENT (KPIs) */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: colors.bgLight, boxShadow: 'none', borderRadius: '12px' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'white', color: colors.sidebar }}><History /></Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">TOTAL TRANSACTIONS</Typography>
                <Typography variant="h6" fontWeight="800" color={colors.sidebar}>{filteredPayments.length}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: colors.bgLight, boxShadow: 'none', borderRadius: '12px' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'white', color: colors.success }}><CheckCircle /></Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">MONTANT TOTAL VERSÉ</Typography>
                <Typography variant="h6" fontWeight="800" color={colors.success}>
                  {formatCurrency(filteredPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount_paid || 0), 0))}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button 
            fullWidth 
            variant="contained" 
            startIcon={<DownloadIcon />}
            sx={{ height: '100%', borderRadius: '12px', bgcolor: colors.sidebar, fontWeight: 'bold' }}
          >
            Exporter l'historique (PDF)
          </Button>
        </Grid>
      </Grid>

      {/* 2. BARRE DE RECHERCHE ET FILTRES */}
      <Card sx={{ mb: 3, borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Rechercher une référence ou une tranche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.accent }} /></InputAdornment>,
                  sx: { borderRadius: '8px', bgcolor: colors.bgLight }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction="row" spacing={1}>
                  <DatePicker 
                    label="Début" 
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    value={startDate} onChange={setStartDate} 
                  />
                  <DatePicker 
                    label="Fin" 
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    value={endDate} onChange={setEndDate} 
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 3. TABLEAU DES PAIEMENTS */}
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: colors.sidebar }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date & Réf.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Montant</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>Chargement...</TableCell></TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>Aucun paiement enregistré</TableCell></TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="700" color={colors.sidebar}>
                      {new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: colors.accent }}>
                      #{payment.reference}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">{payment.tranche?.fee?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{payment.tranche?.label}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="800">{formatCurrency(payment.amount_paid)}</Typography>
                    <Typography variant="caption" color="text.secondary">{payment.payment_method}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status === 'completed' ? 'Réussi' : 'Échoué'}
                      size="small"
                      sx={{ 
                        bgcolor: payment.status === 'completed' ? '#E8F5E9' : '#FFEBEE', 
                        color: payment.status === 'completed' ? colors.success : colors.error,
                        fontWeight: 'bold', borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {payment.status === 'completed' && (
                      <IconButton 
                        onClick={() => handleViewReceipt(payment.id)}
                        sx={{ color: colors.sidebar, bgcolor: colors.bgLight, '&:hover': { bgcolor: colors.accent, color: 'white' } }}
                      >
                        <ReceiptIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default MyPayments;