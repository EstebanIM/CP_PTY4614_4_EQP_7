import * as React from "react";
import PropTypes from "prop-types";
import { useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';

// Componente Table (Tabla principal)
const Table = React.forwardRef(({ className = "", ...props }, ref) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={`w-full caption-bottom text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${className}`}
        {...props}
      />
    </div>
  );
});
Table.displayName = "Table";

Table.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableHeader (Encabezado de la tabla)
const TableHeader = React.forwardRef(({ className = "", ...props }, ref) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <thead
      ref={ref}
      className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} [&_tr]:border-b ${className}`}
      {...props}
    >
      {props.children}
    </thead>
  );
});
TableHeader.displayName = "TableHeader";

TableHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableBody (Cuerpo de la tabla)
const TableBody = React.forwardRef(({ className = "", ...props }, ref) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <tbody
      ref={ref}
      className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} [&_tr:last-child]:border-0 ${className}`}
      {...props}
    >
      {props.children}
    </tbody>
  );
});
TableBody.displayName = "TableBody";

TableBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableFooter (Pie de la tabla)
const TableFooter = React.forwardRef(({ className = "", ...props }, ref) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <tfoot
      ref={ref}
      className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} font-medium ${className}`}
      {...props}
    >
      {props.children}
    </tfoot>
  );
});
TableFooter.displayName = "TableFooter";

TableFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableRow (Fila de la tabla)
const TableRow = React.forwardRef(({ className = "", ...props }, ref) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <tr
      ref={ref}
      className={`border-b transition-colors hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100/50'} ${className}`}
      {...props}
    >
      {props.children}
    </tr>
  );
});
TableRow.displayName = "TableRow";

TableRow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableHead (Encabezado de la celda)
const TableHead = React.forwardRef(({ className = "", ...props }, ref) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <th
      ref={ref}
      className={`h-12 px-4 text-left align-middle font-medium ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-black bg-white'} ${className}`}
      {...props}
    >
      {props.children}
    </th>
  );
});
TableHead.displayName = "TableHead";

TableHead.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableCell (Celda de la tabla)
const TableCell = React.forwardRef(({ className = "", ...props }, ref) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <td
      ref={ref}
      className={`p-4 align-middle ${darkMode ? 'text-gray-300' : 'text-black'} ${className}`}
      {...props}
    >
      {props.children}
    </td>
  );
});
TableCell.displayName = "TableCell";

TableCell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Componente TableCaption (Pie de tabla)
const TableCaption = React.forwardRef(({ className = "", ...props }, ref) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <caption
      ref={ref}
      className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-black'} ${className}`}
      {...props}
    >
      {props.children}
    </caption>
  );
});
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