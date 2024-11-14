import PropTypes from 'prop-types';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';

export function Label({ children, className = "", ...props }) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <label className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'} ${className}`} {...props}>
      {children}
    </label>
  );
}

// Validación de PropTypes
Label.propTypes = {
  children: PropTypes.node.isRequired, // `children` es requerido
  className: PropTypes.string, // `className` es opcional
};