import { useState } from "react";
import DashboardHeader from "../../components/menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../components/menu/DashboardSidebar"; // Importar el sidebar del dashboard

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
          {/* Contenido principal del dashboard */}
          <h1 className="text-2xl font-semibold text-gray-900">Bienvenido al Dashboard</h1>
          {/* Puedes agregar aquí cualquier otro componente o contenido */}
        </div>
      </div>
    </div>
  );
}
