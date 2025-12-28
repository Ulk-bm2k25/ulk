import { createTheme } from '@mui/material/styles';

// Déclarez les couleurs en premier
const customColors = {
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
  success: {
    main: '#0e5e22',
    light: '#B8E6C2',
    dark: '#0a471a',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#8c1c1c',
    light: '#F6C5C5',
    dark: '#6a1515',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D18E09',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3B82F6',
    light: '#DBEAFE',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
  },
  divider: '#E5E5E5',
  background: {
    default: '#F8F7F6',
    paper: '#FFFFFF',
  },
};

// Création du thème
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: customColors.primary,
    secondary: customColors.secondary,
    success: customColors.success,
    error: customColors.error,
    warning: customColors.warning,
    info: customColors.info,
    background: customColors.background,
    text: customColors.text,
    divider: customColors.divider,
    action: {
      hover: 'rgba(244, 162, 97, 0.08)',
      selected: 'rgba(244, 162, 97, 0.16)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: customColors.secondary.main,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: customColors.secondary.main,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: customColors.secondary.main,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: customColors.secondary.main,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: customColors.secondary.main,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: customColors.secondary.main,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: customColors.secondary.light,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: customColors.secondary.light,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: customColors.text.primary,
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: customColors.text.secondary,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: customColors.text.secondary,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: customColors.text.secondary,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...Array(18).fill('none'),
  ],
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          scrollbarColor: `${theme.palette.divider} transparent`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: 4,
            minHeight: 24,
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.primary.dark,
          },
        },
      }),
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
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
          padding: '10px 20px',
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)',
          },
        },
        outlined: {
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(244, 162, 97, 0.05)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(244, 162, 97, 0.08)',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '1rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 24,
        },
        sizeSmall: {
          height: 20,
          fontSize: '0.625rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'secondary.main',
          color: '#FFFFFF',
          borderRight: 'none',
          width: 260,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          padding: '12px 16px',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: 'inherit',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid',
          borderColor: 'divider',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          color: 'text.secondary',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        body: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(244, 162, 97, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(244, 162, 97, 0.16)',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'divider',
          '&.Mui-checked': {
            color: 'primary.main',
          },
          '&:hover': {
            backgroundColor: 'rgba(244, 162, 97, 0.08)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 40,
          height: 40,
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.625rem',
          height: 16,
          minWidth: 16,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '&.Mui-focused': {
            borderColor: 'primary.main',
          },
        },
        input: {
          '&::placeholder': {
            color: 'text.disabled',
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: 1,
          },
        },
        notchedOutline: {
          borderColor: 'divider',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 16px',
        },
        icon: {
          fontSize: '1.25rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          marginTop: 4,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
          padding: '6px 12px',
          backgroundColor: 'secondary.main',
        },
        arrow: {
          color: 'secondary.main',
        },
      },
    },
  },
});

// Exportez les couleurs personnalisées
export const colors = customColors;

// Thème dark (optionnel)
export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: customColors.primary,
    secondary: customColors.secondary,
    background: {
      default: '#1a1d2e',
      paper: '#2A2F4F',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
});

export default theme;