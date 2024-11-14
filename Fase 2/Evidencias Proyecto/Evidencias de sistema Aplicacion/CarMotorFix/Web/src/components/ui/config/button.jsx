import * as React from "react";
import PropTypes from "prop-types";

const Button = React.forwardRef(function Button({ className = "", variant = "default", size = "md", children, ...props }, ref) {
  const baseStyles = `
    inline-flex items-center justify-center rounded-md font-medium 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transition-all disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    default: `
      bg-blue-500 text-white hover:bg-blue-600 
      dark:bg-blue-600 dark:hover:bg-blue-500
    `,
    outline: `
      border border-gray-300 text-gray-700 bg-transparent 
      hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 
      dark:hover:bg-gray-800
    `,
    destructive: `
      bg-red-500 text-white hover:bg-red-600 
      dark:bg-red-600 dark:hover:bg-red-500
    `,
    ghost: `
      bg-transparent text-gray-700 hover:bg-gray-100 
      dark:text-gray-100 dark:hover:bg-gray-800
    `, // Agregado estilo ghost
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "p-2", // Agregar tamaño para íconos pequeños
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
  variant: PropTypes.oneOf(["default", "outline", "destructive", "ghost"]), // Agregar "ghost" como opción válida
  size: PropTypes.oneOf(["sm", "md", "lg", "icon"]), // Agregar "icon" como opción válida
  children: PropTypes.node.isRequired,
};

export { Button };
