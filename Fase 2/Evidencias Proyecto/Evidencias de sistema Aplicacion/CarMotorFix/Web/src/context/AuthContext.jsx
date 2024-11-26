import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUserFromLocalCookie, getTokenFromLocalCookie } from '../lib/cookies';
import { login as loginService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = getTokenFromLocalCookie();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getUserFromLocalCookie();
        setUser(currentUser);
      } catch (error) {
        console.error('Error al verificar el usuario:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const loggedInUser = await loginService(email, password);
      setUser(loggedInUser); // Actualiza el estado del usuario
      return loggedInUser; // Devuelve el usuario si es necesario
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
