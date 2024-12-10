import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Usamos useNavigate
import { useAuth } from './context/AuthContext'; 
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Hook de navegación para redirigir

  useEffect(() => {
    if (!user) {
      navigate('/'); // Si el usuario no está autenticado, redirige a '/'
    }
  }, [user, navigate]);

  return user ? children : null; // Si está autenticado, muestra los hijos (ruta privada)
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
