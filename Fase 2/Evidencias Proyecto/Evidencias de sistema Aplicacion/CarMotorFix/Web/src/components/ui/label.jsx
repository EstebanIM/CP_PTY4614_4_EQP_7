import PropTypes from 'prop-types';

export function Label({ children, className = "", ...props }) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );
}

// Validación de PropTypes
Label.propTypes = {
  children: PropTypes.node.isRequired, // `children` es requerido
  className: PropTypes.string, // `className` es opcional
};
