import { toast } from 'react-toastify';

// Función para limpiar el RUT eliminando puntos y guiones
const cleanRut = (rut) => {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
};

// Función para calcular el dígito verificador del RUT
const calculateDv = (rut) => {
  let sum = 0;
  let multiplier = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    sum += parseInt(rut.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1; // Ciclo de 2 a 7
  }

  const remainder = 11 - (sum % 11);

  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return remainder.toString();
};

// Función para validar el RUT y mostrar mensaje si es incorrecto
export const validateRut = (rutCompleto) => {
  if (!/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto)) {
    toast.error("Formato de RUT incorrecto. Ejemplo: 20438333-6");
    return false; // Validar que el formato sea correcto
  }

  const [rut, digitoVerificador] = rutCompleto.split('-');
  const cleanRutStr = cleanRut(rut);

  const calculatedDv = calculateDv(cleanRutStr);

  if (calculatedDv !== digitoVerificador.toUpperCase()) {
    toast.error("RUT inválido. Por favor, ingrese un RUT válido.");
    return false;
  }

  return true;
};

// Función para validar el correo electrónico
export function validateEmail(email) {
  // Expresión regular básica para validar un correo electrónico
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Devuelve true si el correo es válido, false si no lo es
  return re.test(String(email).toLowerCase());
}
