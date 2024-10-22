import { useState } from "react";
import DashboardHeader from "../../components/menu/DashboardHeader"; 
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import Client from "../../Client/Client";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    console.log("Cambiando estado del sidebar. Estado actual:", sidebarOpen);
    setSidebarOpen(!sidebarOpen); // Cambia el estado a su opuesto
    console.log("Nuevo estado del sidebar:", !sidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex-1">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Aquí puedes agregar contenido adicional */}
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Bienvenido al Dashboard</h1>
          <Client/>
        </div>
      </div>
    </div>
  );
}
