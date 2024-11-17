import PropTypes from 'prop-types';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';

export function Input({ className = "", ...props }) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <input
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${className}`}
      {...props}
    />
  );
}

// Validación de PropTypes
Input.propTypes = {
  className: PropTypes.string,
};