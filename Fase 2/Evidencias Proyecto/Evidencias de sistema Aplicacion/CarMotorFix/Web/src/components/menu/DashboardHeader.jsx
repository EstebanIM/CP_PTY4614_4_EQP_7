import PropTypes from 'prop-types';
import { Button } from "../ui/nadvar/button"; 
import { Menu, Bell, User, Settings, LogOut } from "lucide-react";
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { unsetToken, getTokenFromLocalCookie } from '../../lib/cookies';
import { fetcher } from '../../lib/strApi';
import { DarkModeContext } from '../../context/DarkModeContext'; // Importar el contexto

export default function DashboardHeader({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const { darkMode } = useContext(DarkModeContext); // Usar el contexto
  const navigate = useNavigate();
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const jwt = getTokenFromLocalCookie();
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/users/me`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });
          setUserName(response.username);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, [STRAPI_URL]);

  const logout = async () => {
    try {
      unsetToken();
      localStorage.clear();
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <header className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-sm z-10`}>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-2 md:hidden" onClick={toggleSidebar}>
            <Menu className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
          </Button>
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CarMotorFix</h1>
        </div>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <Bell className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
          </Button>
          <div className="relative dropdown">
            <Button variant="ghost" size="icon" onClick={toggleDropdown}>
              <User className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
            </Button>
            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} shadow-md rounded-lg z-20`}>
                <div className={`px-4 py-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Mi Cuenta ({userName})</div>
                <div className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}></div>
                <Link
                  to="/Config"
                  className={`block px-4 py-2 text-sm cursor-pointer ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Settings className="mr-2 h-4 w-4 inline-block" /> Configuración
                </Link>
                <div
                  className={`block px-4 py-2 text-sm cursor-pointer ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={logout}
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