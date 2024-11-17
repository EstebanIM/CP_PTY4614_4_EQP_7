import PropTypes from 'prop-types';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';

export const InputField = ({ id, label, type, value, onChange, placeholder, required }) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className="mb-4">
      <Label htmlFor={id} className={darkMode ? 'text-white' : 'text-gray-700'}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`mt-1 block w-full rounded-md border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          } focus:ring-indigo-500 focus:border-indigo-500`}
      />
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool
};