import DashboardHeader from "../../components/menu/DashboardHeader";
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import { useState } from "react";
import Client from "../../Client/Client"; // Importamos el componente modular

export default function MisVehiculos() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <DashboardHeader toggleSidebar={toggleSidebar} />

                {/* Main content */}
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-6">Mis Vehículos</h1>

                    {/* Contenido del cliente modular */}
                    <Client />
                </div>
            </div>
        </div>
    );
}
