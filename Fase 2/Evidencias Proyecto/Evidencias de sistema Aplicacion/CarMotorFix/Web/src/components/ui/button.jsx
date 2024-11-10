import PropTypes from 'prop-types';

export function Button({ children, variant = "default", className = "", ...props }) {
  // Estilos base del botón
  const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none focus:ring";

  // Definir las variantes de estilos
  const variants = {
    default: "bg-black text-white hover:bg-gray-400 focus:ring-black", // Fondo negro y texto blanco
    link: "text-black hover:underline", // Texto negro en estilo 'link'
    outline: "border border-black text-black hover:bg-gray-100 focus:ring-black", // Nuevo estilo para 'outline'
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
