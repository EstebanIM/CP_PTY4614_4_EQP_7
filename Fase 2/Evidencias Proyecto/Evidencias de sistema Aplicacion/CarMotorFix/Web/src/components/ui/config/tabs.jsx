import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import PropTypes from "prop-types";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(function TabsList({ className = "", ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;
TabsList.propTypes = {
  className: PropTypes.string,
};

const TabsTrigger = React.forwardRef(function TabsTrigger({ className = "", ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
TabsTrigger.propTypes = {
  className: PropTypes.string,
};

const TabsContent = React.forwardRef(function TabsContent({ className = "", ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;
TabsContent.propTypes = {
  className: PropTypes.string,
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
