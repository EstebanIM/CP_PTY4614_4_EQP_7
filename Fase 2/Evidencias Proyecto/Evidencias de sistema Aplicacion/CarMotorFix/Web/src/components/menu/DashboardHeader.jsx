import PropTypes from 'prop-types';
import { Button } from "../ui/nadvar/button"; 
import { Menu, Bell, User, Settings, LogOut } from "lucide-react";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabaseClient'; // Importar Supabase client
import { unsetToken } from '../../lib/cookies'; // Importar unsetToken para eliminar cookies

export default function DashboardHeader({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logout = async () => {
    try {
      // Actualizar el estado de autenticación
      console.log("Cerrando sesión...");
      // Cerrar sesión en Supabase
      // const { error } = await supabase.auth.signOut();
      // if (error) {
      //   console.error("Error al cerrar sesión en Supabase:", error.message);
      // }

      // Cerrar sesión en Strapi (Eliminar el token de las cookies)
      unsetToken(); // Utilizamos unsetToken para eliminar las cookies

      // Redirigir al usuario o actualizar el estado de autenticación
      navigate('/'); // Redirigir al usuario a la página de inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  // JSX del componente
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
                  onClick={logout} // Llamamos a la función logout
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
};
