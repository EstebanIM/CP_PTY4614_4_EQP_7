import { useState } from "react";
import DashboardHeader from "../../components/menu/DashboardHeader";
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import { FaTools, FaUsers, FaFileInvoiceDollar } from "react-icons/fa"; // Ejemplo usando React Icons

export default function Inicio() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    console.log("Cambiando estado del sidebar. Estado actual:", sidebarOpen);
    setSidebarOpen(!sidebarOpen); // Cambia el estado a su opuesto
    console.log("Nuevo estado del sidebar:", !sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
          {/* Logo */}
          <img
            src="/Logo-carmotorfix.png"
            alt="Carmotorfix Logo"
            className="w-32 h-32 mb-6"
          />

          <h1 className="text-2xl font-bold mb-6 text-center">Bienvenido al Dashboard de Carmotorfix</h1>

          {/* Funciones de la App */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center mt-8">
            {/* Función 1: Gestión de Órdenes */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <FaTools className="text-4xl text-blue-500 mb-4" /> {/* Ícono */}
              <h2 className="text-xl font-semibold mb-2">Gestión de Órdenes</h2>
              <p className="text-gray-600">Administra las órdenes de trabajo de manera eficiente.</p>
            </div>

            {/* Función 2: Comunicación con Clientes */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <FaUsers className="text-4xl text-green-500 mb-4" /> {/* Ícono */}
              <h2 className="text-xl font-semibold mb-2">Comunicación con Clientes</h2>
              <p className="text-gray-600">Mejora la comunicación entre los mecánicos y los clientes.</p>
            </div>

            {/* Función 3: Facturación y Pagos */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <FaFileInvoiceDollar className="text-4xl text-red-500 mb-4" /> {/* Ícono */}
              <h2 className="text-xl font-semibold mb-2">Facturación y Pagos</h2>
              <p className="text-gray-600">Gestiona las facturas y los pagos de manera sencilla.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
