import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import AnimatedBackground from "../../components/animation/animated-background";
import PropTypes from 'prop-types';
import { supabase } from "../../lib/supabaseClient";

// Definimos las propTypes con PropTypes
EmailSentConfirmation.propTypes = {
  onResend: PropTypes.func.isRequired, // onResend es requerido y debe ser una función
  email: PropTypes.string.isRequired,  // email es requerido y debe ser un string
  className: PropTypes.string          // className es opcional y debe ser un string
};

export default function EmailSentConfirmation({
  email,
  className = ""
}) {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeRemaining]);

  const handleResend = async () => {
    if (canResend) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email
        });
        if (error) {
          console.error("Error al reenviar el correo de verificación:", error.message);
          alert("Hubo un problema al reenviar el correo de verificación. Intenta nuevamente.");
        } else {
          alert("Correo de verificación reenviado. Por favor, revisa tu bandeja de entrada.");
          setTimeRemaining(60); // Reiniciar el contador de espera
          setCanResend(false);   // Desactivar el botón de reenvío hasta que el tiempo expire
        }
      } catch (error) {
        console.error("Error inesperado:", error);
      }
    }
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
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-6 bg-card/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-foreground mb-6">
            Correo Enviado
          </h2>
          <p className="text-center text-foreground">
            Se ha enviado un correo de confirmación a <strong>{email}</strong>. 
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones para completar el proceso.
          </p>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={handleResend}
              disabled={!canResend}
              variant="outline"
              className="w-full"
            >
              {canResend
                ? "Reenviar Correo"
                : `Reenviar en ${timeRemaining} segundos`}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
