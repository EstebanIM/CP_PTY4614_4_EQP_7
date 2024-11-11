import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Button } from "../ui/nadvar/button";
import { Users, CarFront, File, Store, Bug, X, List, Home } from "lucide-react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDarkModeFromLocalCookie } from '../../lib/cookies';

const DashboardSidebar = ({ sidebarOpen, toggleSidebar, userRole }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [darkMode, setDarkMode] = useState(false); 

  const handleResize = () => {
    const newIsDesktop = window.innerWidth >= 768;
    setIsDesktop(newIsDesktop);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Load dark mode setting from cookies
    setDarkMode(getDarkModeFromLocalCookie());
  }, []);

  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { x: '-100%', transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <motion.aside
      className={`w-64 md:w-64 md:flex-shrink-0 md:flex md:flex-col p-4 
      fixed left-0 top-0 bottom-0 z-50 md:relative no-scrollbar 
      ${isDesktop || sidebarOpen ? 'block' : 'hidden'} md:block
      ${darkMode ? 'dark' : ''}`} // Apply "dark" mode class here
      initial={sidebarOpen || isDesktop ? "open" : "closed"}
      animate={sidebarOpen || isDesktop ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {/* Logo */}
          <img src="/Logo-carmotorfix.png" alt="Carmotorfix Logo" className="w-10 h-10" />
          <span className="text-xl font-bold">CarMotorFix</span>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <X className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-black'}`} />
        </Button>
      </div>

      <nav className="space-y-2 overflow-y-auto no-scrollbar">
        {/* Botón de Inicio */}
        <div>
          <Link to="/inicio" className="w-full block">
            <Button variant="ghost" className="justify-start flex items-center">
              <Home className={`mr-2 h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} /> Inicio
            </Button>
          </Link>
        </div>

        {/* Auto */}
        <div>
          <Link to="/dashboard" className="w-full block">
            <Button variant="ghost" className="justify-start flex items-center">
              <CarFront className={`mr-2 h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} /> Mis Vehículos
            </Button>
          </Link>
        </div>

        {/* Mecanico */}
        {userRole === "Admin" ? (
          <div>
            <Button variant="ghost" className="justify-start flex items-center">
              <Users className={`mr-2 h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} /> Mecanico
            </Button>
          </div>
        ) : null}

        {/* Orden de Trabajo */}
        {userRole === "Mechanic" || userRole === "Admin" ? (
          <div>
            <Button variant="ghost" className="justify-start flex items-center">
              <File className={`mr-2 h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} /> Orden de Trabajo
            </Button>
          </div>
        ) : null}

        {/* Servicio */}
        {userRole === "Admin" ? (
          <div>
            <Link to="/catalogo_servicio" className="w-full block">
              <Button variant="ghost" className="justify-start flex items-center">
                <List className={`mr-2 h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} /> Servicio
              </Button>
            </Link>
          </div>
        ) : null}

        {/* Taller */}
        {userRole === "Admin" ? (
          <div>
            <Button variant="ghost" className="justify-start flex items-center">
              <Store className={`mr-2 h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} /> Taller
            </Button>
          </div>
        ) : null}

        {/* Bugs */}
        {userRole === "Admin" ? (
          <div>
            <Button variant="ghost" className="justify-start flex items-center">
              <Bug className={`mr-2 h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} /> Bugs
            </Button>
          </div>
        ) : null}

      </nav>
    </motion.aside >
  );
};

// PropTypes validation
DashboardSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  userRole: PropTypes.string
};

export default DashboardSidebar;
