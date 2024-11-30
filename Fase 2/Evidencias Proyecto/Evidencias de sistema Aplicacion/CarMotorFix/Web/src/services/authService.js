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
  const cleanedRut = rut.replace(/[^0-9]/g, ''); 

  // Registro del usuario en Strapi
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
    body: JSON.stringify({ nombre: formattedName, apellido: formattedSurname, run: cleanedRut }),
  });

  if (accountResponse.error) {
    throw new Error(accountResponse.error.message);
  }

  try {
    await fetcher(`${STRAPI_URL}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userjwt}`,
      },
      body: JSON.stringify({
        to: email,
        subject: '¡Bienvenido a nuestra plataforma!',
        text: `Hola ${formattedName},\n\nGracias por registrarte en nuestra plataforma. ¡Esperamos que disfrutes de nuestros servicios!`,
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                background-color: #ffcc00;
                color: #333;
                text-align: center;
                padding: 20px;
              }
              .email-header h1 {
                margin: 0;
                font-size: 24px;
              }
              .email-body {
                padding: 20px;
              }
              .email-body h2 {
                color: #555;
              }
              .email-body p {
                line-height: 1.6;
                font-size: 16px;
              }
              .email-footer {
                background-color: #333;
                color: #fff;
                text-align: center;
                padding: 15px;
                font-size: 14px;
              }
              .email-footer a {
                color: #ffcc00;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <h1>¡Bienvenido a CarMotorFix!</h1>
              </div>
              <div class="email-body">
                <h2>Hola, ${formattedName} 👋</h2>
                <p>
                  ¡Gracias por unirte a nuestra plataforma! Estamos emocionados de tenerte a bordo y estamos seguros de que encontrarás todo lo que necesitas para disfrutar de nuestros servicios.
                </p>
                <p>
                  Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. Estamos aquí para ayudarte en lo que necesites.
                </p>
                <p>
                  ¡Gracias por confiar en nosotros y bienvenido a CarMotorFix!
                </p>
              </div>
              <div class="email-footer">
                <p>¿Tienes alguna consulta? Contáctanos en: 
                  <a href="mailto:soporte@nuestra-plataforma.com">soporte@carmotorfix.com</a>
                </p>
                <p>© 2024 CarMotorFix. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });
  } catch (error) {
    console.error('Error al enviar el correo de bienvenida:', error.message);
    throw new Error('El registro fue exitoso, pero no se pudo enviar el correo de bienvenida.');
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
