import PropTypes from 'prop-types';
import { InputField } from './InputField';
import { Button } from '../ui/button';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';

export const ResetPasswordForm = ({ email, setEmail, handleSubmit }) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <>
      <InputField
        id="email"
        label="Correo Electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button
        type="submit"
        className={`w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-600 text-white'} hover:bg-indigo-700`}
        onClick={handleSubmit}
      >
        Enviar Instrucciones
      </Button>
    </>
  );
};

ResetPasswordForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};