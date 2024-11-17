import * as React from "react";
import PropTypes from "prop-types";
import { useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';

const Input = React.forwardRef(function Input({ className = "", type, ...props }, ref) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <input
      type={type}
      className={`
        flex h-10 w-full rounded-md border 
        ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}
        px-3 py-2 text-sm 
        placeholder-gray-500 dark:placeholder-gray-400 
        focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 
        focus-visible:ring-offset-background
        disabled:cursor-not-allowed disabled:opacity-50 
        ${className}
      `}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";
Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export { Input };