import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import PropTypes from "prop-types";

const Select = SelectPrimitive.Root;

const SelectTrigger = React.forwardRef(function SelectTrigger({ className = "", children, ...props }, ref) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
SelectTrigger.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const SelectValue = React.forwardRef(function SelectValue({ children, placeholder = "" }, ref) {
  return <span ref={ref}>{children || placeholder}</span>;
});
SelectValue.displayName = "SelectValue";
SelectValue.propTypes = {
  children: PropTypes.node,
  placeholder: PropTypes.string,
};

const SelectContent = React.forwardRef(function SelectContent({ className = "", children, position = "popper", ...props }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className={`p-1 ${position === "popper" ? "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]" : ""}`}>
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;
SelectContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  position: PropTypes.string,
};

const SelectItem = React.forwardRef(function SelectItem({ className = "", children, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;
SelectItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
