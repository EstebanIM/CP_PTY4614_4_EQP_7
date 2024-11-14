import * as React from "react";
import PropTypes from "prop-types";
import { useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';

const Button = React.forwardRef(function Button({ className = "", variant = "default", size = "md", children, ...props }, ref) {
  const { darkMode } = useContext(DarkModeContext);

  const baseStyles = `
    inline-flex items-center justify-center rounded-md font-medium 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transition-all disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    default: `
      bg-blue-500 text-white hover:bg-blue-600 
      ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : ''}
    `,
    outline: `
      border border-gray-300 text-gray-700 bg-transparent 
      hover:bg-gray-100 ${darkMode ? 'border-gray-600 text-gray-100 hover:bg-gray-800' : ''}
    `,
    destructive: `
      bg-red-500 text-white hover:bg-red-600 
      ${darkMode ? 'bg-red-600 hover:bg-red-500' : ''}
    `,
    ghost: `
      bg-transparent text-gray-700 hover:bg-gray-100 
      ${darkMode ? 'text-gray-100 hover:bg-gray-800' : ''}
    `,
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-md",
    lg: "h-12 px-5 text-lg",
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "outline", "destructive", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  children: PropTypes.node.isRequired,
};

export { Button };