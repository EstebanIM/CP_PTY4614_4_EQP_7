import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { DarkModeContext } from '../../context/DarkModeContext';

// Lista de formas posibles, manteniendo un estilo minimalista
const SHAPES = ["circle", "square", "triangle"];

// Función para generar una forma aleatoria
const generateShape = (id) => ({
  id,
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  size: Math.random() * 40 + 30, // Tamaño más uniforme
  x: Math.random() * 100,
  y: Math.random() * 100,
  rotation: Math.random() * 360,
  color: `#000000`, // Todo en negro sólido
});

const AnimatedBackground = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    // Generamos 10 formas animadas
    setShapes(Array.from({ length: 10 }, (_, i) => generateShape(i)));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            backgroundColor: darkMode ? '#ffffff' : shape.color, // Ajuste de color basado en el modo
            borderRadius: shape.shape === "circle" ? "50%" : "0%",
            clipPath:
              shape.shape === "triangle"
                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                : shape.shape === "square"
                ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                : "none",
            border: shape.shape !== "circle" ? `2px solid ${shape.color}` : "none",
          }}
          animate={{
            x: [0, Math.random() * 10 - 5, 0], // Movimientos más sutiles
            y: [0, Math.random() * 10 - 5, 0],
            rotate: [0, shape.rotation, 0],
            scale: [1, Math.random() * 0.2 + 0.9, 1], // Variaciones más pequeñas en el tamaño
          }}
          transition={{
            duration: Math.random() * 8 + 12, // Duraciones largas y suaves
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
