import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import AnimatedBackground from '../../components/animation/animated-background';
import { Button } from '../../components/ui/button';

ResetPasswordForm.propTypes = {
  className: PropTypes.string,
};

export default function ResetPasswordForm({ className = "" }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();


  const tokenHash = new URLSearchParams(location.search).get("confirmation_url");

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        token: tokenHash,
        type: 'recovery',
        password: password,
      });

      if (error) throw error;

      toast.success("Contraseña restablecida con éxito");
      navigate("/login");
    } catch (error) {
      toast.error("Error al restablecer la contraseña: " + error.message);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
      <AnimatedBackground />
      <div className={`w-full max-w-md mx-auto px-4 py-8 relative z-10 ${className}`}>
        <motion.form
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          onSubmit={handlePasswordReset}
          className="space-y-6 bg-card/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-foreground mb-6">
            Restablecer Contraseña
          </h2>

          <div>
            <label htmlFor="password" className="text-foreground font-medium">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input w-full mt-1 p-2 rounded border border-gray-300 focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-foreground font-medium">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input w-full mt-1 p-2 rounded border border-gray-300 focus:border-primary focus:outline-none"
            />
          </div>

          <Button type="submit" variant="outline" className="w-full mt-4">
            Restablecer Contraseña
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
