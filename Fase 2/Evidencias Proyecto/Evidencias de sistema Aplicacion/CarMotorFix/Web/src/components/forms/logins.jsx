import PropTypes from 'prop-types';
import { Button } from '../ui/button';

export const LoginForm = ({ email, setEmail, password, setPassword, handleSubmit }) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full rounded-md border bg-white border-gray-300 text-gray-900"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full rounded-md border bg-white border-gray-300 text-gray-900"
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-4"
        onClick={handleSubmit}
      >
        Iniciar Sesión
      </Button>
    </>
  );
};

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
