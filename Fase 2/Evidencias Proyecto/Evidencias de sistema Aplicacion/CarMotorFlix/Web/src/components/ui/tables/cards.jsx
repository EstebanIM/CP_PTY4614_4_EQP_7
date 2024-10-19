import * as React from "react";
import PropTypes from "prop-types";

// Componente principal de Card
const Card = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-gray-200 bg-white text-black shadow-sm ${className}`} // Fondo blanco y texto negro
    {...props}
  />
));
Card.displayName = "Card";

// Componente para el encabezado del Card
const CardHeader = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Componente para el título del Card
const CardTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-2xl font-semibold leading-none tracking-tight text-black ${className}`} // Título con texto negro
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// Componente para la descripción del Card
const CardDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 ${className}`} // Descripción con texto gris
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Componente para el contenido del Card
const CardContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 text-black ${className}`} {...props} /> // Texto negro en el contenido
));
CardContent.displayName = "CardContent";

// Componente para el footer del Card
const CardFooter = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props} />
));
CardFooter.displayName = "CardFooter";

// Añadimos PropTypes para validar las props

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CardDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CardFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
