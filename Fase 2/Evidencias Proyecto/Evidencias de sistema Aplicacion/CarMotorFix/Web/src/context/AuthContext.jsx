import  { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Para validaciones de prop-types
import { getUserFromLocalCookie, getTokenFromLocalCookie } from '../lib/cookies'; // Para obtener los datos del usuario desde las cookies
import { login as loginService } from '../services/authService'; // Importa el servicio de login

// Crear contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario
  const [loading, setLoading] = useState(true); // Estado de carga

  // Comprobación inicial del usuario desde las cookies
  useEffect(() => {
    const checkUser = async () => {
      const token = getTokenFromLocalCookie(); // Obtén el token desde las cookies
      if (!token) {
        setLoading(false);
        setUser(null); // No hay token, no hay usuario autenticado
        return;
      }

      try {
        const currentUser = await getUserFromLocalCookie(); // Obtén el usuario desde el backend usando el token
        setUser(currentUser); // Establece el usuario en el estado
      } catch (error) {
        console.error('Error al verificar el usuario:', error);
        setUser(null); // Error, no hay usuario válido
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Función para el login
  const login = async (email, password) => {
    try {
      const loggedInUser = await loginService(email, password); // Usa el servicio de login
      setUser(loggedInUser); // Establece el usuario
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  // Función para el logout
  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes para asegurar que el AuthProvider reciba los hijos correctamente
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook para acceder al contexto de autenticación
export const useAuth = () => useContext(AuthContext);
