import * as React from "react";
import PropTypes from "prop-types";

const Card = React.forwardRef(function Card({ className = "", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  );
});
Card.displayName = "Card";

Card.propTypes = {
  className: PropTypes.string,
};

const CardHeader = React.forwardRef(function CardHeader({ className = "", ...props }, ref) {
  return (
    <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  );
});
CardHeader.displayName = "CardHeader";
CardHeader.propTypes = {
  className: PropTypes.string,
};

const CardTitle = React.forwardRef(function CardTitle({ className = "", ...props }, ref) {
  return (
    <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
  );
});
CardTitle.displayName = "CardTitle";
CardTitle.propTypes = {
  className: PropTypes.string,
};

const CardDescription = React.forwardRef(function CardDescription({ className = "", ...props }, ref) {
  return (
    <p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props} />
  );
});
CardDescription.displayName = "CardDescription";
CardDescription.propTypes = {
  className: PropTypes.string,
};

const CardContent = React.forwardRef(function CardContent({ className = "", ...props }, ref) {
  return (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
  );
});
CardContent.displayName = "CardContent";
CardContent.propTypes = {
  className: PropTypes.string,
};

const CardFooter = React.forwardRef(function CardFooter({ className = "", ...props }, ref) {
  return (
    <div ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props} />
  );
});
CardFooter.displayName = "CardFooter";
CardFooter.propTypes = {
  className: PropTypes.string,
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
