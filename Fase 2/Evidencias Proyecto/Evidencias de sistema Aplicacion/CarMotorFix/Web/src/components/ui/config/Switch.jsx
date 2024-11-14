import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import PropTypes from "prop-types";
import { useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';

const Switch = React.forwardRef(function Switch({ className = "", ...props }, ref) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={`peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background 
        disabled:cursor-not-allowed disabled:opacity-50 
        data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 ${darkMode ? 'data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600' : ''} ${className}`}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
          data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0`}
      />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = SwitchPrimitive.Root.displayName;
Switch.propTypes = {
  className: PropTypes.string,
};

export { Switch };