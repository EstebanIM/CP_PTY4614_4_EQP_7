import PropTypes from 'prop-types';
import { Button } from "../ui/nadvar/button"; 
import { Menu, Bell, User, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link

export default function DashboardHeader({ toggleSidebar, handleLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Cerrar el menú desplegable si se hace clic fuera del mismo
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          {/* Menú de hamburguesa a la izquierda */}
          <Button variant="ghost" size="sm" className="mr-2 md:hidden" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          {/* Título al lado izquierdo */}
          <h1 className="text-2xl font-semibold text-gray-900">CarMotorFix</h1>
        </div>

        <div className="flex items-center">
          {/* Botón de notificación */}
          <Button variant="ghost" size="icon" className="mr-2">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Menú desplegable de usuario */}
          <div className="relative dropdown">
            <Button variant="ghost" size="icon" onClick={toggleDropdown}>
              <User className="h-5 w-5" />
            </Button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-20">
                <div className="px-4 py-2 text-sm font-medium text-gray-700">Mi Cuenta</div>
                <div className="border-t border-gray-200"></div>

                {/* Redirigir a la página de Configuración */}
                <Link
                  to="/Config"
                  className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  <Settings className="mr-2 h-4 w-4 inline-block" /> Configuración
                </Link>

                <div
                  className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout} // Función para cerrar sesión
                >
                  <LogOut className="mr-2 h-4 w-4 inline-block" /> Cerrar Sesión
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

DashboardHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired, // Función para manejar la salida
};
