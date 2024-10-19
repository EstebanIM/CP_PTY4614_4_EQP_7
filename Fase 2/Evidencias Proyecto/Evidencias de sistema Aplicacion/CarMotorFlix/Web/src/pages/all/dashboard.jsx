import { useState } from "react";
import DashboardHeader from "../../components/menu/DashboardHeader"; 
import DashboardSidebar from "../../components/menu/DashboardSidebar";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    console.log("Cambiando estado del sidebar. Estado actual:", sidebarOpen);
    setSidebarOpen(!sidebarOpen); // Cambia el estado a su opuesto
    console.log("Nuevo estado del sidebar:", !sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Aquí puedes agregar contenido adicional */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Bienvenido al Dashboard</h1>
        </div>
      </div>
    </div>
  );
}
