import { useState } from "react";
import PropTypes from 'prop-types'; // Importar PropTypes
import { Button } from "../ui/nadvar/button"; // Asegúrate de que la ruta sea correcta
import { CarFront, ChevronUp, ChevronDown, Users, Car, File, Store, Bug, X, List, UserPlus } from "lucide-react";
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom
import { motion, AnimatePresence } from 'framer-motion'; // Importar framer-motion para las animaciones

const DashboardSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState(null); // Guardar el menú actualmente abierto

  // Función para alternar el estado de los menús
  const toggleMenu = (menu) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu)); // Si ya está abierto, cierra el menú, si no, ábrelo
  };

  // Variantes de animación para la barra lateral
  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { x: '-100%', transition: { duration: 0.3, ease: "easeInOut" } },
  };

  // Variantes de la animación para los submenús
  const submenuVariants = {
    hidden: { opacity: 0, height: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } },
    visible: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <motion.aside
      className="bg-white w-64 md:w-64 md:flex-shrink-0 md:flex md:flex-col p-4 fixed left-0 top-0 bottom-0 z-50 md:relative no-scrollbar"
      initial={sidebarOpen ? "open" : "closed"}
      animate={sidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Car className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold">CarMotorFix</span> 
        </div>
        <Button variant="ghost" size="icon" className="md:hidden text-black bg-white" onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <nav className="space-y-2 overflow-y-auto no-scrollbar">
        {/* Inventario */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center text-black bg-white"
            onClick={() => toggleMenu("inventory")}
          >
            <CarFront className="mr-2 h-4 w-4 text-black" /> Auto
            {activeMenu === "inventory" ? <ChevronUp className="ml-auto h-4 w-4 text-black" /> : <ChevronDown className="ml-auto h-4 w-4 text-black" />}
          </Button>
          <AnimatePresence>
            {activeMenu === "inventory" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={submenuVariants}
                className="pl-6 mt-2 space-y-1"
              >
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear auto</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver auto</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Modificar auto</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mecanico */}
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
                variants={submenuVariants}
                className="pl-6 mt-2 space-y-1"
              >
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear Mecanico</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver Mecanico</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Modificar Mecanico</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Orden de Compra */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center text-black bg-white"
            onClick={() => toggleMenu("qr")}
          >
            <File className="mr-2 h-4 w-4 text-black" /> Orden de Compra
            {activeMenu === "qr" ? <ChevronUp className="ml-auto h-4 w-4 text-black" /> : <ChevronDown className="ml-auto h-4 w-4 text-black" />}
          </Button>
          <AnimatePresence>
            {activeMenu === "qr" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={submenuVariants}
                className="pl-6 mt-2 space-y-1"
              >
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear Ot</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Eliminar Ot</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver OT</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Servicio */}
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
                variants={submenuVariants}
                className="pl-6 mt-2 space-y-1"
              >
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear Servicio</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Modificar Servicio</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver Servicio</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Taller */}
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
                variants={submenuVariants}
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

        {/* Bugs */}
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
                variants={submenuVariants}
                className="pl-6 mt-2 space-y-1"
              >
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear Comentario</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver Bugs</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dueños */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center text-black bg-white"
            onClick={() => toggleMenu("duenos")}
          >
            <UserPlus className="mr-2 h-4 w-4 text-black" /> Admin
            {activeMenu === "duenos" ? <ChevronUp className="ml-auto h-4 w-4 text-black" /> : <ChevronDown className="ml-auto h-4 w-4 text-black" />}
          </Button>
          <AnimatePresence>
            {activeMenu === "duenos" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={submenuVariants}
                className="pl-6 mt-2 space-y-1"
              >
                <Link to="/crear-dueño" className="w-full block">
                  <Button variant="ghost" className="w-full justify-start text-black bg-white">Crear Admin</Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Ver Admin</Button>
                <Button variant="ghost" className="w-full justify-start text-black bg-white">Modificar Admin</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.aside>
  );
};

// Definición de PropTypes
DashboardSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,  // Validamos que sidebarOpen sea un booleano
  toggleSidebar: PropTypes.func.isRequired // Validamos que toggleSidebar sea una función
};

export default DashboardSidebar;
