import { createTheme } from '@mui/material/styles';

const studentTheme = createTheme({
  palette: {
    primary: {
      main: '#F4A261', // Soft Orange
      light: '#F6B682',
      dark: '#D18E4F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2A2F4F', // Dark Navy
      light: '#3A3F5F',
      dark: '#1A1F3F',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F7F6',
      paper: '#FFFFFF',
    },
    success: {
      main: '#0e5e22',
      light: '#B8E6C2',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#8c1c1c',
      light: '#F6C5C5',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
    },
    divider: '#E5E5E5',
  },
  typography: {
    fontFamily: '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2A2F4F',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2A2F4F',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#2A2F4F',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#2A2F4F',
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#2A2F4F',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#2A2F4F',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E5E5E5',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)',
          },
        },
        outlined: {
          borderColor: '#E5E5E5',
          '&:hover': {
            borderColor: '#F4A261',
            backgroundColor: 'rgba(244, 162, 97, 0.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2A2F4F',
          color: '#FFFFFF',
          borderRight: 'none',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E5E5E5',
        },
        head: {
          fontWeight: 600,
          color: '#666666',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
        },
      },
    },
  },
});

export default studentTheme;