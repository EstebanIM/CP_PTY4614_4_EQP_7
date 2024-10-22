import PropTypes from 'prop-types';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import AnimatedBackground from "../../components/animation/animated-background";
import { supabase } from '../../lib/supabaseClient';
import { fetcher } from '../../lib/strApi';
import { setToken } from '../../lib/cookies';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const STRAPI_ACCOUNT = import.meta.env.VITE_STRAPI_TOKEN_ACCOUNT;

export default function ResponsiveAuthForm(props) {
  const {
    className = "" 
  } = props;

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [rut, setRut] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (mode === "login") {
      // Lógica de inicio de sesión
      try {
        // Primero intenta la autenticación con Strapi
        const strapiResponse = await fetcher(`${STRAPI_URL}/api/auth/local`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: email,
            password,
          }),
        });
        
        if (strapiResponse.error) {
          toast.error(strapiResponse.error.message);
          throw new Error(strapiResponse.error.message);
        }

        // Establecer el token de Strapi en cookies
        setToken(strapiResponse);

        // // Ahora intenta la autenticación con Supabase
        // const { error: supabaseError } = await supabase.auth.signInWithPassword({
        //   email,
        //   password,
        // });

        // if (supabaseError) {
        //   toast.error(supabaseError.message);
        //   throw new Error(supabaseError.message);
        // }

        // Si ambas autenticaciones son exitosas, redirige al usuario
        navigate("/dashboard");
        console.log("Inicio de sesión exitoso");
        console.log("Usuario autenticado en Strapi:", strapiResponse.user);
        console.log("Usuario autenticado en Supabase:", supabase.auth.user());

      } catch (error) {
        toast.error("Error durante el inicio de sesión: " + error.message);
      }

    }
    
    if (mode === "register") {
      if (!validateForm()) {
        return;
      }
  
      // Generar username a partir del nombre, apellido y una parte del email
      const generatedUsername = generateUsername(name, surname, email);
  
      // Limpiar el RUT antes de enviarlo
      const cleanedRut = cleanRut(rut); // Aquí limpiamos el RUT
  
      // Registro con Strapi
      try {
        const strapiResponse = await fetcher(`${STRAPI_URL}/api/auth/local/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            username: generatedUsername, // Usar el username generado
            password,
          }),
        });
  
        if (strapiResponse.error) {
          toast.error(strapiResponse.error.message);
          throw new Error(strapiResponse.error.message); // Lanzar error para detener el flujo si falla
        }
  
        const userId = strapiResponse.user.id; // Obtener el user_id del usuario registrado en Strapi
  
        // Crear cuenta asociada al usuario (Account)
        const accountResponse = await fetcher(`${STRAPI_URL}/api/accounts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_ACCOUNT}`, // El token JWT del usuario autenticado en Strapi
          },
          body: JSON.stringify({
            data: {
              nombre: name,
              apellido: surname,
              run: cleanedRut, // Usar el RUT limpio
              user_id: userId, // Asociar el ID del usuario registrado
            },
          }),
        });
  
        if (accountResponse.error) {
          toast.error(accountResponse.error.message);
          throw new Error(accountResponse.error.message); // Lanzar error si falla la creación de la cuenta
        }
  
        // Si Strapi y la cuenta son exitosos, proceder con Supabase
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (supabaseError) {
          toast.error(supabaseError.message);
          throw new Error(supabaseError.message);
        }
        console.log("Usuario registrado en Supabase:", supabaseData.user);
        console.log("Cuenta creada en Strapi:", accountResponse.data);
        if (supabaseError) {
          toast.error(supabaseError.message);
        } else {
          toast.success("Registro exitoso, revisa tu correo para confirmar tu cuenta");
          navigate("/verify-email");
        }
      } catch (error) {
        toast.error("Error durante el registro: " + error.message);
      }
      }
  };
  
  // Función para limpiar el RUT y devolver solo los números
  const cleanRut = (rut) => {
    // Remover guiones, puntos y dígito verificador (último carácter)
    return rut.replace(/[^0-9]/g, ''); // Remover todos los caracteres que no sean números
  };
    
  // Función para generar un username único
  const generateUsername = (name, surname, email) => {
    const emailPrefix = email.split('@')[0]; // Obtener la parte antes de '@' del correo
    const usernameBase = `${name.toLowerCase()}_${surname.toLowerCase()}`;
    
    // Combinar el nombre, apellido y el prefijo del email
    return `${usernameBase}_${emailPrefix}`;
  };

  const validateForm = () => {
    if (!name) {
      toast.error("Por favor, ingrese su nombre.");
      return false;
    }
    if (!surname) {
      toast.error("Por favor, ingrese su apellido.");
      return false;
    }
    if (!validateRut(rut)) {
      toast.error("Por favor, ingrese un RUT válido.");
      return false;
    }
    if (!validateEmail(email)) {
      toast.error("Por favor, ingrese un correo electrónico válido.");
      return false;
    }
    if (!password) {
      toast.error("Por favor, ingrese una contraseña.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const validateRut = (rut) => {
    const regex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
    return regex.test(rut);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRutChange = (e) => {
    let value = e.target.value.replace(/[^0-9kK]/g, "");
    if (value.length > 9) value = value.slice(0, 9);
    if (value.length > 1 && !value.includes('-')) {
      value = value.slice(0, value.length - 1) + '-' + value.slice(value.length - 1);
    }
    setRut(value);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
      <AnimatedBackground />
      <div className={`w-full max-w-md mx-auto px-4 py-8 relative z-10 ${className}`}>
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-card/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-3xl font-bold text-center text-foreground mb-6">
              {mode === "login" && "Iniciar Sesión"}
              {mode === "register" && "Registrarse"}
              {mode === "reset" && "Recuperar Contraseña"}
            </h2>

            {mode === "register" && (
              <>
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="surname">Apellido</Label>
                  <Input
                    id="surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rut">RUT</Label>
                  <Input
                    id="rut"
                    type="text"
                    value={rut}
                    onChange={handleRutChange}
                    placeholder="12345678-9"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== "reset" && (
              <>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {mode === "register" && (
                  <div>
                    <Label htmlFor="confirmPassword">Repetir Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}

            <Button type="submit" className="w-full">
              {mode === "login" && "Iniciar Sesión"}
              {mode === "register" && "Registrarse"}
              {mode === "reset" && "Enviar Instrucciones"}
            </Button>

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-between text-sm">
              {mode !== "login" && (
                <Button variant="link" onClick={() => setMode("login")} type="button">
                  Iniciar Sesión
                </Button>
              )}
              {mode !== "register" && (
                <Button variant="link" onClick={() => setMode("register")} type="button">
                  Registrarse
                </Button>
              )}
              {mode !== "reset" && (
                <Button variant="link" onClick={() => setMode("reset")} type="button">
                  Olvidé mi contraseña
                </Button>
              )}
            </div>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}

ResponsiveAuthForm.propTypes = {
  className: PropTypes.string
};
