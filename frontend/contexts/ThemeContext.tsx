'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Paleta de cores escura voltada para o azul
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1E3A8A', // Azul escuro
      light: '#3B82F6',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#475569', // Cinza azulado escuro
      light: '#64748B',
      dark: '#334155',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#059669', // Verde escuro
      light: '#10B981',
      dark: '#047857',
    },
    warning: {
      main: '#D97706', // Laranja escuro
      light: '#F59E0B',
      dark: '#B45309',
    },
    error: {
      main: '#DC2626', // Vermelho escuro
      light: '#EF4444',
      dark: '#B91C1C',
    },
    info: {
      main: '#0891B2', // Azul ciano escuro
      light: '#06B6D4',
      dark: '#0E7490',
    },
    background: {
      default: '#0F172A', // Azul muito escuro
      paper: '#1E293B', // Azul escuro
    },
    text: {
      primary: '#F1F5F9', // Cinza muito claro
      secondary: '#94A3B8', // Cinza claro
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 16px 32px rgba(0, 0, 0, 0.16)',
    '0px 32px 64px rgba(0, 0, 0, 0.20)',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1E40AF 0%, #3730A3 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: 'rgba(148, 163, 184, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: 'rgba(148, 163, 184, 0.5)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: '#3B82F6',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(148, 163, 184, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(148, 163, 184, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3B82F6',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94A3B8',
            '&.Mui-focused': {
              color: '#3B82F6',
            },
          },
          '& .MuiInputBase-input': {
            color: '#F1F5F9',
            '&::placeholder': {
              color: '#64748B',
              opacity: 1,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: 'rgba(148, 163, 184, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: 'rgba(148, 163, 184, 0.5)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: '#3B82F6',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(148, 163, 184, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(148, 163, 184, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3B82F6',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94A3B8',
            '&.Mui-focused': {
              color: '#3B82F6',
            },
          },
          '& .MuiSelect-select': {
            color: '#F1F5F9',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: 'rgba(148, 163, 184, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: 'rgba(148, 163, 184, 0.5)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: '#3B82F6',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(148, 163, 184, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(148, 163, 184, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3B82F6',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94A3B8',
            '&.Mui-focused': {
              color: '#3B82F6',
            },
          },
          '& .MuiAutocomplete-input': {
            color: '#F1F5F9',
          },
        },
        paper: {
          backgroundColor: '#1E293B',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        },
        option: {
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.3)',
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: 'rgba(148, 163, 184, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: 'rgba(148, 163, 184, 0.5)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: '#3B82F6',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(148, 163, 184, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(148, 163, 184, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3B82F6',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94A3B8',
            '&.Mui-focused': {
              color: '#3B82F6',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          backgroundColor: '#1E293B',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E293B',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          borderRadius: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#E2E8F0',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.3)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
          boxShadow: '0 2px 20px rgba(30, 58, 138, 0.4)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          borderRadius: 8,
          padding: 4,
        },
        indicator: {
          height: 3,
          borderRadius: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          textTransform: 'none',
          minHeight: 48,
          '&.Mui-selected': {
            backgroundColor: 'rgba(30, 58, 138, 0.2)',
          },
        },
      },
    },
  },
});

interface ThemeContextType {
  theme: typeof theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider = ({ children }: CustomThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={{ theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
