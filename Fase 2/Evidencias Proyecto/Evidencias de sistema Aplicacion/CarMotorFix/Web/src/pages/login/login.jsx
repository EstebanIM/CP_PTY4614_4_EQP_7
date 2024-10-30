import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { LoginForm } from '../../components/forms/logins'; // Asegúrate de tener el archivo logins.js
import { RegisterForm } from '../../components/forms/register'; // Asegúrate de tener el archivo register.js
import { ResetPasswordForm } from '../../components/forms/reset'; // Asegúrate de tener el archivo reset.js
import AnimatedBackground from '../../components/animation/animated-background';
import { login, register } from '../../services/authService';
import { handleRutChange } from '../../utils/rutHandler';
import { validateRut, validateEmail } from '../../utils/validation_rut';
import { Button } from '../../components/ui/button';
import PropTypes from 'prop-types';

export default function ResponsiveAuthForm({ className = "" }) {
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
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Inicio de sesión exitoso");
        navigate("/Inicio");
      } else if (mode === "register" && validateForm()) {
        await register(email, password, name, surname, rut);
        toast.success("Registro exitoso, revisa tu correo para confirmar tu cuenta");
        navigate("/verify-email");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const validateForm = () => {
    if (!name || !surname || !validateRut(rut) || !validateEmail(email) || !password || password !== confirmPassword) {
      toast.error("Por favor, llena todos los campos correctamente.");
      return false;
    }
    return true;
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

            {mode === "login" && (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
              />
            )}

            {mode === "register" && (
              <RegisterForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                name={name}
                setName={setName}
                surname={surname}
                setSurname={setSurname}
                rut={rut}
                handleRutChange={(e) => handleRutChange(e, setRut)}
                handleSubmit={handleSubmit}
              />
            )}

            {mode === "reset" && (
              <ResetPasswordForm email={email} setEmail={setEmail} handleSubmit={handleSubmit} />
            )}

            <div className="flex justify-between text-sm">
              {mode !== "login" && <Button variant="link" onClick={() => setMode("login")}>Iniciar Sesión</Button>}
              {mode !== "register" && <Button variant="link" onClick={() => setMode("register")}>Registrarse</Button>}
              {mode !== "reset" && <Button variant="link" onClick={() => setMode("reset")}>Recuperar Contraseña</Button>}
            </div>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}

ResponsiveAuthForm.propTypes = {
  className: PropTypes.string,
};