import { useState, useEffect } from "react";
import DashboardHeader from "../../components/menu/DashboardHeader";
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import Client from "../../Client/Client";
import { fetcher } from '../../lib/strApi'; // Asumiendo que tienes una función para obtener el token y hacer fetch
import { getTokenFromLocalCookie } from '../../lib/cookies'; // Asumiendo que tienes una función para obtener el token y hacer fetch

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

export default function MisVehiculos() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null); // Para guardar el rol del usuario

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const fetchUserRole = async () => {
        const jwt = getTokenFromLocalCookie(); // Obtener el JWT
        if (jwt) {
            try {
                const response = await fetcher(`${STRAPI_URL}/api/users/me?populate=*`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                setUserRole(response.role.name); // Guarda el nombre del rol en el estado
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        }
    };

    useEffect(() => {
        fetchUserRole(); // Llama a la función para obtener el rol cuando el componente se monte
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <DashboardHeader toggleSidebar={toggleSidebar} />

                {/* Main content */}
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-6">Mis Vehículos</h1>

                    {/* Contenido del cliente modular */}
                    {userRole === "Authenticated" ? <Client /> : <p>No tienes acceso a esta sección.</p>}
                </div>
            </div>
        </div>
    );
}
