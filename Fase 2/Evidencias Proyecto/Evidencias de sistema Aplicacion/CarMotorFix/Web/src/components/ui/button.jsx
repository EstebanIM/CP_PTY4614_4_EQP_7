import React, { useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx"; // Para manejar clases condicionales
import { DarkModeContext } from '../../context/DarkModeContext';

export function Button({ children, variant = "default", className = "", ...props }) {
  const { darkMode } = useContext(DarkModeContext); // Acceder al estado del modo oscuro

  // Estilos base del botón
  const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none focus:ring";

  // Definir las variantes de estilos ajustadas según el modo oscuro
  const variants = {
    default: darkMode
      ? "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-800" // Modo oscuro
      : "bg-black text-white hover:bg-gray-400 focus:ring-black",       // Modo claro
    link: darkMode
      ? "text-white hover:underline"                                      // Modo oscuro
      : "text-black hover:underline",                                     // Modo claro
    outline: darkMode
      ? "border border-white text-white hover:bg-gray-700 focus:ring-white" // Modo oscuro
      : "border border-black text-black hover:bg-gray-100 focus:ring-black", // Modo claro
  };

  // Validar que el variant sea válido o usar la variante 'default' si no existe
  const variantClasses = variants[variant] || variants.default;

  return (
    <button className={`${baseStyles} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Agregamos la validación de PropTypes
Button.propTypes = {
  children: PropTypes.node.isRequired, // children es requerido
  variant: PropTypes.oneOf(['default', 'link', 'outline']), // Añadir 'outline' como opción válida
  className: PropTypes.string,
};

export default Button;