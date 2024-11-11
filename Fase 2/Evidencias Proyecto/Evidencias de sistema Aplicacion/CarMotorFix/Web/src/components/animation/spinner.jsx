import { Loader2 } from "lucide-react";
import PropTypes from 'prop-types';

const Spinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8"
  };

  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-primary`} />
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"])
};

export default Spinner;
