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
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only initialize once, even if useEffect runs twice in StrictMode
    if (!initializedRef.current) {
      mockInitializer.initialize(mocksConfig as MocksConfig);
      initializedRef.current = true;
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
