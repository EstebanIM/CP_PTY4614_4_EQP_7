import { supabase } from '../lib/supabaseClient';
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

  setToken(strapiResponse);

  const { error: supabaseError } = await supabase.auth.signInWithPassword({ email, password });
  if (supabaseError) {
    throw new Error(supabaseError.message);
  }

  return strapiResponse.user;
};

export const register = async (email, password, name, surname, rut) => {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const formattedSurname = surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();
  const generatedUsername = `${formattedName} ${formattedSurname}`;
  const cleanedRut = rut.replace(/[^0-9]/g, ''); 

  const strapiResponse = await fetcher(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username: generatedUsername, password }),
  });

  if (strapiResponse.error) {
    throw new Error(strapiResponse.error.message);
  }

  const userId = strapiResponse.user.id;
  const userjwt = strapiResponse.jwt;
  
  const accountResponse = await fetcher(`${STRAPI_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userjwt}`,
    },
    body: JSON.stringify({ nombre: name, apellido: surname, run: cleanedRut }),
  });

  if (accountResponse.error) {
    throw new Error(accountResponse.error.message);
  }


  const { error: supabaseError } = await supabase.auth.signUp({ email, password });
  if (supabaseError) {
    throw new Error(supabaseError.message);
  }

  return strapiResponse.user;
};
