import PropTypes from 'prop-types';
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos el hook para redirigir
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import AnimatedBackground from "../../components/animation/animated-background";

export default function ResponsiveAuthForm(props) {
  const {
    onLogin = () => {}, // Valor por defecto para onLogin
    onRegister = () => {}, // Valor por defecto para onRegister
    onResetPassword = () => {}, // Valor por defecto para onResetPassword
    className = "" // Valor por defecto para className
  } = props;

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [rut, setRut] = useState("");

  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "register") {
      if (!validateForm()) {
        return;
      }
      onRegister({ name, surname, rut, email, password });
      toast.success("Registro exitoso");
      navigate("/verify-email"); // Redirige a la página de verificación de correo
    } else if (mode === "login") {
      onLogin(email, password);
    } else if (mode === "reset") {
      if (validateEmail(email)) {
        onResetPassword(email);
        toast.info("Se enviaron las instrucciones de recuperación.");
      } else {
        toast.error("Por favor, ingrese un correo válido.");
      }
    }
  };

  // Validar el formulario de registro
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

  // Función para validar el formato del RUT
  const validateRut = (rut) => {
    const regex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
    return regex.test(rut);
  };

  // Función para validar el correo electrónico
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Manejar el cambio de valor del RUT y añadir guion automáticamente
  const handleRutChange = (e) => {
    let value = e.target.value.replace(/[^0-9kK]/g, ""); // Limpiar el input solo para permitir números y "K"
    if (value.length > 9) value = value.slice(0, 9); // Limitar a 9 caracteres antes de agregar el guion
    if (value.length > 1 && !value.includes('-')) {
      value = value.slice(0, value.length - 1) + '-' + value.slice(value.length - 1); // Agregar guion automáticamente
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
                    onChange={handleRutChange} // Usamos la función handleRutChange
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

// Declaramos los tipos de las props
ResponsiveAuthForm.propTypes = {
  onLogin: PropTypes.func,
  onRegister: PropTypes.func,
  onResetPassword: PropTypes.func,
  className: PropTypes.string
};
