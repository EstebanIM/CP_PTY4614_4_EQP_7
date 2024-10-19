import { useState } from "react";
import PropTypes from 'prop-types'; // Importar PropTypes
import { Button } from "../ui/button";
import { CarFront, ChevronUp, ChevronDown, Users, Car, File, Store, Bug, X, List, UserPlus } from "lucide-react";
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom

const DashboardSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const [isInventoryMenuOpen, setIsInventoryMenuOpen] = useState(false);
  const [isQrMenuOpen, setIsQrMenuOpen] = useState(false);
  const [isRackMenuOpen, setIsRackMenuOpen] = useState(false);
  const [isTiendaMenuOpen, setIsTiendaMenuOpen] = useState(false);
  const [isBugsMenuOpen, setIsBugsMenuOpen] = useState(false);
  const [isDuenosMenuOpen, setIsDuenosMenuOpen] = useState(false); // Nuevo estado para el menú de dueños

  const toggleUsersMenu = () => setIsUsersMenuOpen(!isUsersMenuOpen);
  const toggleInventoryMenu = () => setIsInventoryMenuOpen(!isInventoryMenuOpen);
  const toggleQrMenu = () => setIsQrMenuOpen(!isQrMenuOpen);
  const toggleRackMenu = () => setIsRackMenuOpen(!isRackMenuOpen);
  const toggleTiendaMenu = () => setIsTiendaMenuOpen(!isTiendaMenuOpen);
  const toggleBugsMenu = () => setIsBugsMenuOpen(!isBugsMenuOpen);
  const toggleDuenosMenu = () => setIsDuenosMenuOpen(!isDuenosMenuOpen); // Función para abrir/cerrar el submenú de dueños

  return (
    <aside
      className={`bg-white w-64 md:w-64 md:flex-shrink-0 md:flex md:flex-col p-4 transition-all duration-300 ease-in-out
      fixed left-0 top-0 bottom-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Car className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold">CarMotorFix</span> 
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <nav className="space-y-2 overflow-y-auto">
        {/* Inventario */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleInventoryMenu}
          >
            <CarFront className="mr-2 h-4 w-4" /> Auto
            {isInventoryMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isInventoryMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear auto</Button>
              <Button variant="ghost" className="w-full justify-start">Ver auto</Button>
              <Button variant="ghost" className="w-full justify-start">Modificar auto</Button>
            </div>
          )}
        </div>

        {/* Mecanico */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleUsersMenu}
          >
            <Users className="mr-2 h-4 w-4" /> Mecanico
            {isUsersMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isUsersMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear Mecanico</Button>
              <Button variant="ghost" className="w-full justify-start">Ver Mecanico</Button>
              <Button variant="ghost" className="w-full justify-start">Modificar Mecanico</Button>
            </div>
          )}
        </div>

        {/* Orden de Compra */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleQrMenu}
          >
            <File className="mr-2 h-4 w-4" /> Orden de Compra
            {isQrMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isQrMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear Ot</Button>
              <Button variant="ghost" className="w-full justify-start">Eliminar Ot</Button>
              <Button variant="ghost" className="w-full justify-start">Ver OT</Button>
            </div>
          )}
        </div>

        {/* Servicio */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleRackMenu}
          >
            <List className="mr-2 h-4 w-4" /> Servicio
            {isRackMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isRackMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear Servicio</Button>
              <Button variant="ghost" className="w-full justify-start">Modificar Servicio</Button>
              <Button variant="ghost" className="w-full justify-start">Ver Servicio</Button>
            </div>
          )}
        </div>

        {/* Taller */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleTiendaMenu}
          >
            <Store className="mr-2 h-4 w-4" /> Taller
            {isTiendaMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isTiendaMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/crear-tienda" className="w-full block">
                <Button variant="ghost" className="w-full justify-start">Crear Taller</Button>
              </Link>
              <Link to="/ver-tienda" className="w-full block">
                <Button variant="ghost" className="w-full justify-start">Ver Taller</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start">Modificar Taller</Button>
            </div>
          )}
        </div>

        {/* Bugs */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleBugsMenu}
          >
            <Bug className="mr-2 h-4 w-4" /> Bugs
            {isBugsMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isBugsMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear Comentario</Button>
              <Button variant="ghost" className="w-full justify-start">Ver Bugs</Button>
            </div>
          )}
        </div>

        {/* Dueños */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleDuenosMenu}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Admin
            {isDuenosMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isDuenosMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/crear-dueño" className="w-full block">
                <Button variant="ghost" className="w-full justify-start">Crear Admin</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start">Ver Admin</Button>
              <Button variant="ghost" className="w-full justify-start">Modificar Admin</Button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

// Definición de PropTypes
DashboardSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,  // Validamos que sidebarOpen sea un booleano
  toggleSidebar: PropTypes.func.isRequired // Validamos que toggleSidebar sea una función
};

export default DashboardSidebar;
