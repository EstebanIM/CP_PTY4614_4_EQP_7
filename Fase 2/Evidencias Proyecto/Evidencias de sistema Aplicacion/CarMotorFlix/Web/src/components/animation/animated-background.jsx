import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Lista de formas posibles
const SHAPES = ["circle", "square", "triangle"];

// Función para generar una forma aleatoria
const generateShape = (id) => ({
  id,
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  size: Math.random() * 50 + 20,
  x: Math.random() * 100,
  y: Math.random() * 100,
  rotation: Math.random() * 360,
  color: `hsl(${Math.random() * 360}, 70%, 70%, 0.3)`,
});

const AnimatedBackground = () => {
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
            backgroundColor: shape.shape === "circle" ? shape.color : "transparent",
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
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: [0, shape.rotation, 0],
            scale: [1, Math.random() * 0.5 + 0.5, 1],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
