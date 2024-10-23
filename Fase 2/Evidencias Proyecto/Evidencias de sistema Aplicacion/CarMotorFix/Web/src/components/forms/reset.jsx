import PropTypes from 'prop-types';
import { InputField } from './InputField';
import { Button } from '../ui/button';

export const ResetPasswordForm = ({ email, setEmail, handleSubmit }) => (
  <>
    <InputField
      id="email"
      label="Correo Electrónico"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <Button type="submit" className="w-full" onClick={handleSubmit}>
      Enviar Instrucciones
    </Button>
  </>
);

ResetPasswordForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
