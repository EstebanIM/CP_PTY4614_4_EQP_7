import PropTypes from 'prop-types';
import { InputField } from './InputField';
import { Button } from '../ui/button';

export const LoginForm = ({ email, setEmail, password, setPassword, handleSubmit }) => (
  <>
    <InputField
      id="email"
      label="Correo Electrónico"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <InputField
      id="password"
      label="Contraseña"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <Button type="submit" className="w-full" onClick={handleSubmit}>
      Iniciar Sesión
    </Button>
  </>
);

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
