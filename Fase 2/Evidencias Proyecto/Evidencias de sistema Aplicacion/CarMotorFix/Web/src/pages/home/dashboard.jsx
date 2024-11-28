import { useState, useEffect, useContext } from "react";
import DashboardHeader from "../../components/menu/DashboardHeader";
import DashboardSidebar from "../../components/menu/DashboardSidebar";

// import Client from "../Client/Client";
import Mecanico_dashboard from "../mecanico/mecanico_dashboard";
import Admin_dashboard from "../admin/admin_dashboard";

import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import { DarkModeContext } from '../../context/DarkModeContext';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

export default function MisVehiculos() {
    const { darkMode } = useContext(DarkModeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const fetchUserRole = async () => {
        const jwt = getTokenFromLocalCookie();
        if (jwt) {
            try {
                const response = await fetcher(`${STRAPI_URL}/api/users/me?populate=*`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                setUserRole(response.role.name);
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        }
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

    const renderComponentByRole = (role) => {
        switch (role) {
            // case "Authenticated":
            //     return (
            //         <>
            //             <h1 className="text-2xl font-bold mb-6">Mis Vehículos</h1>
            //             <Client />
            //         </>
            //     );
            case "Mechanic":
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Dashboard de Mantenimiento de Autos</h1>
                        <Mecanico_dashboard />
                    </>
                );
            case "Admin":
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Dashboard de Administrador</h1>
                        <Admin_dashboard />
                    </>
                );
            default:
                return <p>No tienes acceso a esta sección.</p>;
        }
    };

    return (
        <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            {/* Sidebar */}
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <DashboardHeader toggleSidebar={toggleSidebar} />

                {/* Main content */}
                <div className="container mx-auto p-4">
                    {/* Contenido del cliente modular */}
                    {renderComponentByRole(userRole)}
                </div>
            </div>
        </div>
    );
}