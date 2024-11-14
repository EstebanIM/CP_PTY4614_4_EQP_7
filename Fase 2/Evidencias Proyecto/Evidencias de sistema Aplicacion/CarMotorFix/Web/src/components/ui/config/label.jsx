import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import PropTypes from "prop-types";
import { useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';

const Label = React.forwardRef(function Label({ className = "", ...props }, ref) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${darkMode ? 'text-white' : 'text-gray-700'} ${className}`}
      {...props}
    />
  );
});
Label.displayName = LabelPrimitive.Root.displayName;
Label.propTypes = {
  className: PropTypes.string,
};

export { Label };