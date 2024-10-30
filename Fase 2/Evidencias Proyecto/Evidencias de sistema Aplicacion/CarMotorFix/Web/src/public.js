// components/PrivateRoute.jsx
import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Usa `useNavigate` para redirigir

  useEffect(() => {
    if (user) {
      navigate('/Inicio'); // Redirige al usuario a la página de login si no está autenticado
    }
  }, [user, navigate]);

  // Si no hay usuario, no renderiza nada hasta que navegue
  if (!user) return null;

  // Si hay usuario, renderiza el contenido de la ruta privada
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
