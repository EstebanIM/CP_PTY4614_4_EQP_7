import React from "react";
import PropTypes from "prop-types"; // Importar PropTypes
import clsx from "clsx"; // Para manejar clases condicionales de forma más limpia

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    // Base styles para el botón
    const baseStyles = "inline-flex justify-center rounded-md font-medium transition focus:outline-none focus:ring-0"; // focus:ring-0 elimina el borde azul

    // Variantes de estilos
    const variantStyles = clsx({
      "bg-transparent hover:bg-gray-700": variant === "ghost",
      "bg-yellow-500 hover:bg-yellow-600 text-white": variant === "default",
      "bg-red-500 hover:bg-red-600 text-white": variant === "danger", // Nueva variante
    });

    // Tamaños de los botones
    const sizeStyles = clsx({
      "px-4 py-2 text-sm": size === "md",
      "px-2 py-1 text-xs": size === "sm",
      "px-6 py-3 text-lg": size === "lg", // Tamaño adicional
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
  variant: PropTypes.oneOf(["default", "ghost", "danger"]), // Aseguramos que sea uno de los valores permitidos
  size: PropTypes.oneOf(["sm", "md", "lg"]), // Aseguramos que el tamaño sea uno de estos
};

export default Button;
