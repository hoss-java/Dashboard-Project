// src/App.tsx
import React, { useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import { mockInitializer } from './services/MockInitializer';
import mocksConfig from './config/mocks-config.json';
import { MocksConfig } from './services/MockInitializer';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#4f8ef7' },
    secondary: { main: '#a78bfa' },
    success:   { main: '#34d399' },
    warning:   { main: '#fbbf24' },
    error:     { main: '#f87171' },
    info:      { main: '#38bdf8' },
    background: {
      default: '#0f1117',
      paper:   '#1a1d27',
    },
    text: {
      primary:   '#e2e8f0',
      secondary: '#94a3b8',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h6: { fontWeight: 600, letterSpacing: '0.01em' },
    subtitle2: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'box-shadow 250ms ease, transform 250ms ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { paddingBottom: 0 },
        title: { fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.02em' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#13161f',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4 },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { padding: 6 },
        thumb: { boxShadow: '0 2px 4px rgba(0,0,0,0.4)' },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(255,255,255,0.06)' },
      },
    },
  },
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', gap: 16,
          background: '#0f1117', color: '#f87171', fontFamily: 'sans-serif',
        }}>
          <span style={{ fontSize: 48 }}>⚠️</span>
          <strong>Something went wrong</strong>
          <code style={{ fontSize: 12, color: '#94a3b8', maxWidth: 480, textAlign: 'center' }}>
            {this.state.error?.message}
          </code>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      mockInitializer.initialize(mocksConfig as MocksConfig);
      initializedRef.current = true;
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HomePage />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
