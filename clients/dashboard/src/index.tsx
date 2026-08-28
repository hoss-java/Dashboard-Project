import React from 'react';
import ReactDOM from 'react-dom/client';
import { TemplateProvider } from './contexts/TemplateContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <TemplateProvider>
      <App />
    </TemplateProvider>
  </React.StrictMode>
);
