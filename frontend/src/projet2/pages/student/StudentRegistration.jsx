import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Container,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Zoom,
  Fade
} from '@mui/material';
import {
  CheckCircle,
  Paid,
  ReceiptLong,
  InfoOutlined
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const StudentRegistration = () => {
  const [hasPaid, setHasPaid] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const colors = {
    sidebar: '#2A2F4F',
    accent: '#F4A261',
    bgLight: '#F8F9FC',
    white: '#FFFFFF'
  };

  const student = {
    name: "Jean Dupont",
    matricule: "E2025-458",
    classe: { name: "Terminale C1" },
    academic_year: "2024-2025"
  };

  const steps = ['Paiement des frais', 'Confirmation administrative', 'Validé'];
  const activeStep = isConfirmed ? 2 : hasPaid ? 1 : 0;

  const handlePayment = () => {
    setHasPaid(true);
    toast.success("Paiement effectué avec succès ! 🎉", { duration: 4000 });
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    toast.success("Inscription confirmée avec succès !", { duration: 5000 });
  };

  return (
    <Box
      sx={{
        // Plus de 100vh ! On laisse le layout gérer la hauteur
        bgcolor: colors.bgLight,
        py: { xs: 3, sm: 5 },
        minHeight: '100%', // Au cas où le contenu est court
      }}
    >
      <Container maxWidth="lg">

        {/* Stepper principal */}
        <Fade in timeout={600}>
          <Card
            elevation={3}
            sx={{
              mb: 5,
              borderRadius: '20px',
              bgcolor: colors.white,
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
            }}
          >
            <CardContent sx={{ py: { xs: 5, sm: 7 }, px: { xs: 3, sm: 6 } }}>
              <Stepper
                activeStep={activeStep}
                orientation={isMobile ? 'vertical' : 'horizontal'}
                alternativeLabel={!isMobile}
                sx={{
                  '& .MuiStepIcon-root': { fontSize: '2.2rem' },
                  '& .MuiStepIcon-root.Mui-active': { color: colors.accent },
                  '& .MuiStepIcon-root.Mui-completed': { color: colors.sidebar },
                }}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color={activeStep > index ? colors.sidebar : 'text.secondary'}
                      >
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mt: { xs: 5, sm: 7 }, textAlign: 'center' }}>
                <Zoom in={activeStep === 0} timeout={500}>
                  <div>
                    {activeStep === 0 && (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Paid />}
                        onClick={handlePayment}
                        sx={{
                          bgcolor: colors.accent,
                          px: { xs: 6, sm: 8 },
                          py: 2.5,
                          borderRadius: '16px',
                          fontWeight: 800,
                          fontSize: '1.15rem',
                          boxShadow: '0 10px 30px rgba(244,162,97,0.3)',
                          '&:hover': {
                            bgcolor: '#E68A4F',
                            transform: 'translateY(-4px)',
                            boxShadow: '0 15px 35px rgba(244,162,97,0.4)'
                          }
                        }}
                      >
                        Payer les frais (50 000 XOF)
                      </Button>
                    )}
                  </div>
                </Zoom>

                <Zoom in={activeStep === 1} timeout={500}>
                  <div>
                    {activeStep === 1 && (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<CheckCircle />}
                        onClick={handleConfirm}
                        sx={{
                          bgcolor: colors.sidebar,
                          px: { xs: 6, sm: 8 },
                          py: 2.5,
                          borderRadius: '16px',
                          fontWeight: 800,
                          fontSize: '1.15rem',
                          boxShadow: '0 10px 30px rgba(42,47,79,0.25)',
                          '&:hover': {
                            bgcolor: '#383e66',
                            transform: 'translateY(-4px)',
                            boxShadow: '0 15px 35px rgba(42,47,79,0.35)'
                          }
                        }}
                      >
                        Confirmer mon inscription
                      </Button>
                    )}
                  </div>
                </Zoom>

                <Fade in={activeStep === 2} timeout={800}>
                  <div>
                    {activeStep === 2 && (
                      <Alert
                        severity="success"
                        icon={<CheckCircle sx={{ fontSize: '48px', color: colors.sidebar }} />}
                        sx={{
                          borderRadius: '20px',
                          py: 5,
                          bgcolor: '#E8F5E9',
                          border: `2px solid ${colors.sidebar}`,
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h4" fontWeight={900} color={colors.sidebar} gutterBottom>
                          Félicitations ! 🎓
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                          Votre inscription pour l'année {student.academic_year} est officiellement confirmée.
                        </Typography>
                      </Alert>
                    )}
                  </div>
                </Fade>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Récapitulatif en deux colonnes - Grid v2 */}
        <Grid container spacing={4}>
          <Grid xs={12} md={7}>
            <Fade in timeout={800}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: '20px',
                  bgcolor: colors.white,
                  p: { xs: 4, sm: 5 },
                  height: '100%'
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color={colors.sidebar}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
                >
                  <ReceiptLong /> Détails financiers
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Stack spacing={4}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="text.secondary">Libellé</Typography>
                    <Typography fontWeight={700}>Inscription Annuelle</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="text.secondary">Montant dû</Typography>
                    <Typography variant="h5" fontWeight={900} color={colors.accent}>
                      50 000 XOF
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="text.secondary">Statut</Typography>
                    <Chip
                      label={hasPaid ? "PAYÉ" : "EN ATTENTE"}
                      sx={{
                        fontWeight: 800,
                        px: 4,
                        py: 2.5,
                        fontSize: '1rem',
                        bgcolor: hasPaid ? colors.sidebar : '#FEE2E2',
                        color: hasPaid ? 'white' : '#EF4444'
                      }}
                    />
                  </Box>
                </Stack>
              </Paper>
            </Fade>
          </Grid>

          <Grid xs={12} md={5}>
            <Fade in timeout={1000}>
              <Paper
                elevation={4}
                sx={{
                  borderRadius: '20px',
                  bgcolor: colors.sidebar,
                  color: 'white',
                  p: { xs: 4, sm: 5 },
                  height: '100%'
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
                >
                  <InfoOutlined /> Information importante
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, opacity: 0.95 }}>
                  Le paiement des frais d'inscription est obligatoire pour activer votre matricule.
                  Une fois validé par la comptabilité, l'administration procédera à la confirmation définitive de votre inscription pour l'année scolaire{' '}
                  <strong>{student.academic_year}</strong>.
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentRegistration;