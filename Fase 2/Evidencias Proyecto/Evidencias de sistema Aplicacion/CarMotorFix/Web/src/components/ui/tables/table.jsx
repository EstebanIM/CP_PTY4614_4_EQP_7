import * as React from "react";
import PropTypes from "prop-types";

// Componente principal Table
const Table = React.forwardRef(({ className = "", ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={`w-full caption-bottom text-sm bg-white ${className}`} {...props} />
  </div>
));
Table.displayName = "Table";
Table.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableHeader (encabezado de tabla)
const TableHeader = React.forwardRef(({ className = "", ...props }, ref) => (
  <thead ref={ref} className={`[&_tr]:border-b bg-gray-50 ${className}`} {...props}>
    {props.children}
  </thead>
));
TableHeader.displayName = "TableHeader";
TableHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableBody (cuerpo de tabla)
const TableBody = React.forwardRef(({ className = "", ...props }, ref) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 text-black ${className}`} {...props}>
    {props.children}
  </tbody>
));
TableBody.displayName = "TableBody";
TableBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableFooter (pie de tabla)
const TableFooter = React.forwardRef(({ className = "", ...props }, ref) => (
  <tfoot ref={ref} className={`bg-gray-100 font-medium text-black ${className}`} {...props}>
    {props.children}
  </tfoot>
));
TableFooter.displayName = "TableFooter";
TableFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableRow (fila de tabla)
const TableRow = React.forwardRef(({ className = "", ...props }, ref) => (
  <tr ref={ref} className={`border-b transition-colors hover:bg-gray-100/50 ${className}`} {...props}>
    {props.children}
  </tr>
));
TableRow.displayName = "TableRow";
TableRow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableHead (encabezado de celda)
const TableHead = React.forwardRef(({ className = "", ...props }, ref) => (
  <th ref={ref} className={`h-12 px-4 text-left align-middle font-medium text-black bg-white ${className}`} {...props}>
    {props.children}
  </th>
));
TableHead.displayName = "TableHead";
TableHead.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableCell (celda de tabla)
const TableCell = React.forwardRef(({ className = "", ...props }, ref) => (
  <td ref={ref} className={`p-4 align-middle text-black ${className}`} {...props}>
    {props.children}
  </td>
));
TableCell.displayName = "TableCell";
TableCell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableCaption (caption de tabla)
const TableCaption = React.forwardRef(({ className = "", ...props }, ref) => (
  <caption ref={ref} className={`mt-4 text-sm text-black dark:text-gray-400 ${className}`} {...props}>
    {props.children}
  </caption>
));
TableCaption.displayName = "TableCaption";
TableCaption.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
