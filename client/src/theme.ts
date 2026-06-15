import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
      light: '#6effff',
      dark: '#00b2cc',
      contrastText: '#000',
    },
    secondary: {
      main: '#7c4dff',
      light: '#b47cff',
      dark: '#3f1dcb',
      contrastText: '#fff',
    },
    background: {
      default: '#050a14',
      paper: '#0d1526',
    },
    text: {
      primary: '#e8f4fd',
      secondary: '#7ea8c4',
    },
    success: {
      main: '#00e676',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.5px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.5)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0, 229, 255, 0.08)',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
