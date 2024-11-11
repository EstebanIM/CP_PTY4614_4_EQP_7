import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate de react-router-dom
import { useAuth } from './context/AuthContext';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Cambiado a useNavigate

  useEffect(() => {
    const jwt = Cookies.get('jwt');

    if (user || jwt) {
      navigate('/Inicio', { replace: true }); // Redirigir a /Inicio si el usuario está autenticado
    }
  }, [user, navigate]);

  return !user ? children : null; // Retorna los children solo si el usuario no está autenticado
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validación de tipo para children
};

export default PublicRoute;
