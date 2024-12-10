import { useContext } from "react";
import PropTypes from "prop-types";
import { DarkModeContext } from '../../context/DarkModeContext';

export function Button({ children, variant = "default", className = "", ...props }) {
  const { darkMode } = useContext(DarkModeContext);
  const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none focus:ring";

  const variants = {
    default: darkMode
      ? "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-800" // Modo oscuro
      : "bg-black text-white hover:bg-gray-400 focus:ring-black",       // Modo claro
    link: darkMode
      ? "text-black hover:underline"
      : "text-black hover:underline",
    outline: darkMode
      ? "border bg-black border-gray-700 text-white hover:bg-gray-900 focus:ring-gray" // Modo oscuro
      : "border border-black text-black hover:bg-gray-100 focus:ring-black", // Modo claro
  };

  const variantClasses = variants[variant] || variants.default;

  return (
    <button className={`${baseStyles} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'link', 'outline']),
  className: PropTypes.string,
};

export default Button;