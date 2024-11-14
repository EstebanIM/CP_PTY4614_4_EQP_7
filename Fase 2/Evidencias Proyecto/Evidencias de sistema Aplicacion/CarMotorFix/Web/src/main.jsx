import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';  // Importa el componente principal de la aplicación
import './index.css';     // Importa tus estilos globales

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  {/* Renderizamos la App con las rutas configuradas */}
  </StrictMode>,
);
