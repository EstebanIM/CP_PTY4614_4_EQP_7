import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { LoginForm } from '../../components/forms/logins';
import { RegisterForm } from '../../components/forms/register';
import { ResetPasswordForm } from '../../components/forms/reset';
import AnimatedBackground from '../../components/animation/animated-background';
import { register, resetPassword } from '../../services/authService';
import { handleRutChange } from '../../utils/rutHandler';
import { validateRut, validateEmail } from '../../utils/validation_rut';
import { Button } from '../../components/ui/button';
import PropTypes from 'prop-types';
import LoadingComponent from '../../components/animation/loading';
import { useAuth } from '../../context/AuthContext';

export default function ResponsiveAuthForm({ className = "" }) {
  const { user, login, loading: authLoading } = useAuth(); // Obtén el estado y la función `login` del contexto
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [rut, setRut] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const navigate = useNavigate();

  // Redirige automáticamente si el usuario ya está autenticado
  if (user) {
    navigate("/Inicio");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password); // Llama a `login` del contexto
        toast.success("Inicio de sesión exitoso");
        navigate("/Inicio");
      } else if (mode === "register" && validateForm()) {
        await register(email, password, name, surname, rut);
        toast.success("Registro exitoso, revisa tu correo para confirmar tu cuenta");
        navigate("/verify-email");
      } else if (mode === "reset") {
        await resetPassword(email);
        toast.success("Correo de recuperación enviado");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!name || !surname || !validateRut(rut) || !validateEmail(email) || !password || password !== confirmPassword || passwordStrength < 3) {
      toast.error("Por favor, llena todos los campos correctamente.");
      return false;
    }

    const unmetRules = getUnmetPasswordRules(passwordRules);
    if (unmetRules.length > 0) {
      toast.error(`Contraseña no segura. Te recomendamos que: ${unmetRules.join(", ")}`);
      return false;
    }

    return true;
  };

  const getUnmetPasswordRules = (rules) => {
    const unmet = [];
    if (!rules.length) unmet.push("tenga al menos 8 caracteres");
    if (!rules.uppercase) unmet.push("contenga al menos una letra mayúscula");
    if (!rules.lowercase) unmet.push("contenga al menos una letra minúscula");
    if (!rules.number) unmet.push("incluya al menos un número");
    if (!rules.specialChar) unmet.push("incluya al menos un carácter especial (!@#$%^&*)");
    return unmet;
  };

  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };

    setPasswordRules(rules);
    const passedRules = Object.values(rules).filter(Boolean).length;
    setPasswordStrength(passedRules);
  };

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  if (authLoading || loading) {
    return <LoadingComponent />;
  }

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
              />
            )}

            {mode === "register" && (
              <RegisterForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={handlePasswordChange}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                name={name}
                setName={setName}
                surname={surname}
                setSurname={setSurname}
                rut={rut}
                handleRutChange={(e) => handleRutChange(e, setRut)}
                passwordStrength={passwordStrength}
              />
            )}

            {mode === "reset" && (
              <ResetPasswordForm email={email} setEmail={setEmail} />
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
