import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import PropTypes from "prop-types";
import { useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(function TabsList({ className = "", ...props }, ref) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <TabsPrimitive.List
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md p-1 ${darkMode ? 'bg-gray-700' : 'bg-muted'} ${className}`}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;
TabsList.propTypes = {
  className: PropTypes.string,
};

const TabsTrigger = React.forwardRef(function TabsTrigger({ className = "", ...props }, ref) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${darkMode ? 'data-[state=active]:bg-gray-600' : ''} ${className}`}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
TabsTrigger.propTypes = {
  className: PropTypes.string,
};

const TabsContent = React.forwardRef(function TabsContent({ className = "", children, ...props }, ref) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${className}`}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;
TabsContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export { Tabs, TabsList, TabsTrigger, TabsContent };