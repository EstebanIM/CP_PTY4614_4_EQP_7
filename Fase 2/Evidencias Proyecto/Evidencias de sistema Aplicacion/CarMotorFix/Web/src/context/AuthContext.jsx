// contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener la sesión actual de Supabase
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    // Configurar el listener para cambios en la autenticación
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Limpiar el listener al desmontar
    return () => {
      // Verifica que listener sea un objeto válido antes de llamar unsubscribe
      if (listener && typeof listener.unsubscribe === 'function') {
        listener.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
