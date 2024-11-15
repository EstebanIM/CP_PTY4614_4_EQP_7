import { Loader2 } from "lucide-react";
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';

const Spinner = ({ size = "medium" }) => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8"
  };

  const colorClass = darkMode ? 'text-white' : 'text-primary';

  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]} ${colorClass}`} />
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"])
};

export default Spinner;
