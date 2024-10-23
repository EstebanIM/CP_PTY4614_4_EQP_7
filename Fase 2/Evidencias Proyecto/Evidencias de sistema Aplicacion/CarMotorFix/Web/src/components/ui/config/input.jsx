import * as React from "react";
import PropTypes from "prop-types";

const Input = React.forwardRef(function Input({ className = "", type, ...props }, ref) {
  return (
    <input
      type={type}
      className={`
        flex h-10 w-full rounded-md border 
        bg-white text-gray-900 border-gray-300  /* Estilos para modo claro */
        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 /* Estilos para modo oscuro */
        px-3 py-2 text-sm 
        placeholder-gray-500 dark:placeholder-gray-400 
        focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 
        focus-visible:ring-offset-background
        disabled:cursor-not-allowed disabled:opacity-50 
        !bg-white !text-gray-900 !dark:bg-gray-800 !dark:text-gray-100 /* Forzar los estilos */
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
