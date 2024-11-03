import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Button } from "../ui/nadvar/button";
import { ChevronUp, ChevronDown, Users, CarFront, File, Store, Bug, X, List, Home } from "lucide-react"; // Importa el icono Home
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardSidebar = ({ sidebarOpen, toggleSidebar, userRole }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const handleResize = () => {
    const newIsDesktop = window.innerWidth >= 768;
    setIsDesktop(newIsDesktop);
    console.log("Cambio de tamaño de pantalla, es escritorio:", newIsDesktop);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { x: '-100%', transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <motion.aside
      className={`bg-white w-64 md:w-64 md:flex-shrink-0 md:flex md:flex-col p-4 
      fixed left-0 top-0 bottom-0 z-50 md:relative no-scrollbar 
      ${isDesktop || sidebarOpen ? 'block' : 'hidden'} md:block`}
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
        <Button variant="ghost" size="icon" className="md:hidden text-black bg-white" onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <nav className="space-y-2 overflow-y-auto no-scrollbar">
        {/* Botón de Inicio */}
        <div>
          <Link to="/inicio" className="w-full block">
            <Button variant="ghost" className="justify-start flex items-center text-black bg-white">
              <Home className="mr-2 h-4 w-4 text-black" /> Inicio
            </Button>
          </Link>
        </div>

        {/* Auto */}
        <div>
          <Link to="/dashboard" className="w-full block">
            <Button variant="ghost" className="justify-start flex items-center text-black bg-white">
              <CarFront className="mr-2 h-4 w-4" />Mis Vehículos
            </Button>
          </Link>
        </div>


        {/* Mecanico */}
        {userRole === "Admin" ? (
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start flex items-center text-black bg-white"
              onClick={() => toggleMenu("users")}
            >
              <Users className="mr-2 h-4 w-4 text-black" /> Mecanico
              {activeMenu === "users" ? <ChevronUp className="ml-auto h-4 w-4 text-black" /> : <ChevronDown className="ml-auto h-4 w-4 text-black" />}
            </Button>
            <AnimatePresence>
              {activeMenu === "users" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, height: 0 },
                    visible: { opacity: 1, height: 'auto' }
                  }}
                  className="pl-6 mt-2 space-y-1"
                >
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear Mecanico</Button>
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver Mecanico</Button>
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Modificar Mecanico</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
          </>
        )}

        {/* Orden de Trabajo */}
        {userRole === "Mechanic" || userRole === "Admin" ? (
          <div>
            <Button
              variant="ghost"
              className="justify-start flex items-center text-black bg-white"
            >
              <File className="mr-2 h-4 w-4 text-black" /> Orden de Trabajo
            </Button>
          </div>
        ) : (
          <>
          </>
        )}
        {/* Servicio */}
        {userRole === "Admin" ? (
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start flex items-center text-black bg-white"
              onClick={() => toggleMenu("rack")}
            >
              <List className="mr-2 h-4 w-4 text-black" /> Servicio
              {activeMenu === "rack" ? <ChevronUp className="ml-auto h-4 w-4 text-black" /> : <ChevronDown className="ml-auto h-4 w-4 text-black" />}
            </Button>
            <AnimatePresence>
              {activeMenu === "rack" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, height: 0 },
                    visible: { opacity: 1, height: 'auto' }
                  }}
                  className="pl-6 mt-2 space-y-1"
                >
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear Servicio</Button>
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Modificar Servicio</Button>
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver Servicio</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
          </>
        )}
        {/* Taller */}
        {userRole === "Admin" ? (
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start flex items-center text-black bg-white"
              onClick={() => toggleMenu("tienda")}
            >
              <Store className="mr-2 h-4 w-4 text-black" /> Taller
              {activeMenu === "tienda" ? <ChevronUp className="ml-auto h-4 w-4 text-black" /> : <ChevronDown className="ml-auto h-4 w-4 text-black" />}
            </Button>
            <AnimatePresence>
              {activeMenu === "tienda" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, height: 0 },
                    visible: { opacity: 1, height: 'auto' }
                  }}
                  className="pl-6 mt-2 space-y-1"
                >
                  <Link to="/crear-tienda" className="w-full block">
                    <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear Taller</Button>
                  </Link>
                  <Link to="/ver-tienda" className="w-full block">
                    <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver Taller</Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Modificar Taller</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
          </>
        )}

        {/* Bugs */}
        {userRole === "Admin" ? (
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start flex items-center text-black bg-white"
              onClick={() => toggleMenu("bugs")}
            >
              <Bug className="mr-2 h-4 w-4 text-black" /> Bugs
              {activeMenu === "bugs" ? <ChevronUp className="ml-auto h-4 w-4 text-black" /> : <ChevronDown className="ml-auto h-4 w-4 text-black" />}
            </Button>
            <AnimatePresence>
              {activeMenu === "bugs" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, height: 0 },
                    visible: { opacity: 1, height: 'auto' }
                  }}
                  className="pl-6 mt-2 space-y-1"
                >
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear Comentario</Button>
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver Bugs</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
          </>
        )}

      </nav>
    </motion.aside >
  );
};

// Definición de PropTypes
DashboardSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,  // Validamos que sidebarOpen sea un booleano
  toggleSidebar: PropTypes.func.isRequired, // Validamos que toggleSidebar sea una función
  userRole: PropTypes.string // Validamos que userRole
};

export default DashboardSidebar;
