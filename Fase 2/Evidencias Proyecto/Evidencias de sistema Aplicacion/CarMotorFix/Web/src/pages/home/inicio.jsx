import { useState, useEffect } from "react";
import DashboardHeader from "../../components/menu/DashboardHeader";
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import { FaTools, FaUsers, FaFileInvoiceDollar } from "react-icons/fa";
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie, getDarkModeFromLocalCookie } from '../../lib/cookies';
import ConsejoAutoDelDia from '../../components/mensaje/mensajedia';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

export default function Inicio() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [darkMode] = useState(getDarkModeFromLocalCookie()); 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchUserRole = async () => {
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        const response = await fetcher(`${STRAPI_URL}/api/users/me?populate=*`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
        setUserRole(response.role.name);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Sidebar */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        userRole={userRole}
        darkMode={darkMode} // Pass dark mode state to Sidebar
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader
          toggleSidebar={toggleSidebar}
          darkMode={darkMode} // Pass dark mode state to Header
        />

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
            <div className={`flex flex-col items-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-lg`}>
              <FaTools className="text-4xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Gestión de Órdenes</h2>
              <p className="text-gray-600">Administra las órdenes de trabajo de manera eficiente.</p>
            </div>

            <div className={`flex flex-col items-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-lg`}>
              <FaUsers className="text-4xl text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Comunicación con Clientes</h2>
              <p className="text-gray-600">Mejora la comunicación entre los mecánicos y los clientes.</p>
            </div>

            <div className={`flex flex-col items-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-lg`}>
              <FaFileInvoiceDollar className="text-4xl text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Facturación y Pagos</h2>
              <p className="text-gray-600">Gestiona las facturas y los pagos de manera sencilla.</p>
            </div>
          </div>

          {/* Consejo del Día */}
          <div className="mt-8">
            <ConsejoAutoDelDia />
          </div>
        </div>
      </div>
    </div>
  );
}
