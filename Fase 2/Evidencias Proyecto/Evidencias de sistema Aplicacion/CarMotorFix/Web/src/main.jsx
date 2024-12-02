import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import { DarkModeProvider } from './context/DarkModeContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </StrictMode>,
);
