import PropTypes from 'prop-types';
import { InputField } from './InputField';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  passwordStrength,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
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
      <div className="relative">
        <InputField
          id="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded">
          <div
            className={`h-full rounded transition-all ${
              passwordStrength >= 3 ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${(passwordStrength / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="relative">
        <InputField
          id="confirmPassword"
          label="Repetir Contraseña"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
        >
          {showConfirmPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      <Button type="submit" className="w-full">
        Registrarse
      </Button>
    </>
  );
};

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
  passwordStrength: PropTypes.number.isRequired,
};
