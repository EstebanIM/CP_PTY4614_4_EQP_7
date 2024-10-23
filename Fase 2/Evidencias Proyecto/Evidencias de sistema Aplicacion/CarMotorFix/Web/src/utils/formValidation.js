import { validateRut, validateEmail } from './validation_rut';

export const validateForm = (name, surname, rut, email, password, confirmPassword) => {
  if (!name || !surname || !validateRut(rut) || !validateEmail(email) || !password || password !== confirmPassword) {
    return { valid: false, message: "Por favor, llena todos los campos correctamente." };
  }
  return { valid: true };
};
