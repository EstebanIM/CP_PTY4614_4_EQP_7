import React, { useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx"; // Para manejar clases condicionales
import { DarkModeContext } from '../../../context/DarkModeContext';

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const { darkMode } = useContext(DarkModeContext); // Acceder al estado del modo oscuro

    // Estilos base para el botón
    const baseStyles =
      "inline-flex justify-center items-center rounded-md font-medium transition focus:outline-none focus:ring-0";

    // Estilos de variantes del botón ajustados según el modo oscuro
    const variantStyles = clsx({
      "bg-transparent hover:bg-gray-300 text-gray-700": variant === "ghost" && !darkMode,
      "bg-transparent hover:bg-gray-700 text-white": variant === "ghost" && darkMode,

      "bg-yellow-500 hover:bg-yellow-600 text-white": variant === "default" && !darkMode,
      "bg-yellow-600 hover:bg-yellow-700 text-white": variant === "default" && darkMode,

      "bg-red-500 hover:bg-red-600 text-white": variant === "danger" && !darkMode,
      "bg-red-600 hover:bg-red-700 text-white": variant === "danger" && darkMode,
    });

    // Estilos de tamaño del botón, incluyendo el tamaño `icon`
    const sizeStyles = clsx({
      "px-4 py-2 text-sm": size === "md",
      "px-2 py-1 text-xs": size === "sm",
      "px-6 py-3 text-lg": size === "lg",
      "p-2": size === "icon", // Definimos el tamaño para los botones de icono
    });

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

// Definición de PropTypes para validar las props
Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "ghost", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg", "icon"]), // Añadimos "icon" como opción válida
  children: PropTypes.node.isRequired,
};

export default Button;