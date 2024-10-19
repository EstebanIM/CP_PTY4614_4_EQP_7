import * as React from "react";
import PropTypes from "prop-types";

// Componente Tabs base
const Tabs = ({ children, defaultValue }) => {
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

// Componente TabsList (lista de pestañas)
const TabsList = ({ children, className = "" }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}>
    {children}
  </div>
);

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Componente TabsTrigger (pestaña individual)
const TabsTrigger = ({ value, activeTab, setActiveTab, className = "", children }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
    } ${className}`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

TabsTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TabsContent (contenido de la pestaña)
const TabsContent = ({ value, activeTab, className = "", children }) => {
  if (activeTab !== value) return null;
  return <div className={`mt-2 ${className}`}>{children}</div>;
};

TabsContent.propTypes = {
  value: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
