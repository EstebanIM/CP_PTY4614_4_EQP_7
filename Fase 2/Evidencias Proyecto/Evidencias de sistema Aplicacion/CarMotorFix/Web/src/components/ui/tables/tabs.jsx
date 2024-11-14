import * as React from "react";
import PropTypes from "prop-types";
import { useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';

const Tabs = ({ children, defaultValue }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });
};

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

const TabsList = ({ children, className = "" }) => (
  <div
    className={`inline-flex h-10 items-center justify-center rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500'} p-1 ${className}`}
  >
    {children}
  </div>
);

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { Tabs, TabsList };