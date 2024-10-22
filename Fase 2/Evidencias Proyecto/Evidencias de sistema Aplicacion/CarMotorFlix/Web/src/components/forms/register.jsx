import PropTypes from 'prop-types';
import { InputField } from './InputField';
import { Button } from '../ui/button';

export const RegisterForm = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  surname,
  setSurname,
  rut,
  handleRutChange,
  handleSubmit
}) => (
  <>
    <InputField
      id="name"
      label="Nombre"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
    <InputField
      id="surname"
      label="Apellido"
      type="text"
      value={surname}
      onChange={(e) => setSurname(e.target.value)}
      required
    />
    <InputField
      id="rut"
      label="RUT"
      type="text"
      value={rut}
      onChange={handleRutChange}
      placeholder="12345678-9"
      required
    />
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
    <InputField
      id="confirmPassword"
      label="Repetir Contraseña"
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    <Button type="submit" className="w-full" onClick={handleSubmit}>
      Registrarse
    </Button>
  </>
);

RegisterForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  setConfirmPassword: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  surname: PropTypes.string.isRequired,
  setSurname: PropTypes.func.isRequired,
  rut: PropTypes.string.isRequired,
  handleRutChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
