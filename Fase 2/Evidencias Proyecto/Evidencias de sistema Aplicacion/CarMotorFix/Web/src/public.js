import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate
import { useAuth } from './context/AuthContext';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Usamos el hook de navegación

  useEffect(() => {
    if (user) {
      navigate('/Inicio'); // Si está autenticado, lo redirige a '/' (por ejemplo, la página principal)
    }
  }, [user, navigate]);

  return !user ? children : null; // Si no está autenticado, muestra los hijos (página pública)
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validación de tipo para children
};

export default PublicRoute;
