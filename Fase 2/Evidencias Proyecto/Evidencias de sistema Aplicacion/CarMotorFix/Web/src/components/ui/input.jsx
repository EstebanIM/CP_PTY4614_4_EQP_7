import PropTypes from 'prop-types';

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
}

// Validación de PropTypes
Input.propTypes = {
  className: PropTypes.string,
};
