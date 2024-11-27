import { fetcher } from '../lib/strApi';
import { setToken } from '../lib/cookies';
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

export const login = async (email, password) => {
  const strapiResponse = await fetcher(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password }),
  });

  if (strapiResponse.error) {
    throw new Error(strapiResponse.error.message);
  }

  // Guarda el token y devuelve el usuario
  setToken(strapiResponse);
  return strapiResponse.user;
};

export const register = async (email, password, name, surname, rut) => {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const formattedSurname = surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();
  const generatedUsername = `${formattedName} ${formattedSurname}`;
  const cleanedRut = rut.replace(/[^0-9]/g, ''); // Limpia el RUT, manteniendo solo números

  // Registro en Strapi
  const strapiResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username: generatedUsername, password }),
  });

  console.log(strapiResponse);
  
  
  if (strapiResponse.error) {
    throw new Error(strapiResponse.error.message);
  }

  // Actualización de información adicional del usuario en Strapi
  const userId = strapiResponse.user.id;
  const userjwt = strapiResponse.jwt;

  const accountResponse = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userjwt}`,
    },
    body: JSON.stringify({ nombre: name, apellido: surname, run: cleanedRut }),
  });
  
  console.log(accountResponse);
  console.log(accountResponse.error);
  
  if (accountResponse.error) {
    throw new Error(accountResponse.error.message);
  }

  return strapiResponse.user;
};

export const resetPassword = async (email) => {
  try {
    // Solicitud de recuperación de contraseña en Strapi
    await fetcher(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    return { success: true, message: 'Solicitud de recuperación enviada con éxito' };
  } catch (error) {
    throw new Error(`Error en la recuperación de contraseña: ${error.message}`);
  }
};
