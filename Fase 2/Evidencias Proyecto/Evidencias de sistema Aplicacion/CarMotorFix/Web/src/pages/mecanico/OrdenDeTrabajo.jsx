import { useEffect, useState, useContext } from 'react';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import DashboardHeader from "../../components/menu/DashboardHeader";
import 'react-toastify/dist/ReactToastify.css';
import { DarkModeContext } from '../../context/DarkModeContext';
import Tablas from '../../components/Tablas';
import { useNavigate } from "react-router-dom";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

function OrdenDeTrabajo() {
    const { darkMode } = useContext(DarkModeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [ordenTrabajo, setOrdenTrabajo] = useState([]);
    const navigate = useNavigate();
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const fetchUser = async () => {
        const jwt = getTokenFromLocalCookie();
        if (jwt) {
            try {
                const response = await fetcher(`${STRAPI_URL}/api/users/me?pLevel`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                setUserRole(response.role.name);
                setOrdenTrabajo(response.mecanico.orden_trabajos_id || []);
                console.log("User role:", response.mecanico.orden_trabajos_id);

            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleViewOT = (ordenTrabajo) => {
        navigate(`/detalle_ot/${ordenTrabajo.documentId}`);
    };

    const columns = [
        {
            header: "Servicio",
            key: "servicio",
            render: (ordenTrabajo) => {
                if (ordenTrabajo.catalogo_servicios && ordenTrabajo.catalogo_servicios.length > 0) {
                    const firstService = ordenTrabajo.catalogo_servicios[0].tp_servicio;
                    const moreServices = ordenTrabajo.catalogo_servicios.length > 1;
                    return moreServices ? `${firstService} (+${ordenTrabajo.catalogo_servicios.length - 1} más)` : firstService;
                }
                return 'Servicio no disponible';
            },
        },
        {
            header: "Estado",
            key: "estado",
            render: (ordenTrabajo) => ordenTrabajo.estado || 'Estado no disponible',
        },
        {
            header: "Costo",
            key: "costo",
            render: (ordenTrabajo) =>
                ordenTrabajo.costo
                    ? new Intl.NumberFormat('es-CL').format(ordenTrabajo.costo)
                    : 'Costo no disponible',
        },
    ];

    return (
        <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} />

                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-6">Orden de Trabajo</h1>
                    <Tablas servicio={ordenTrabajo} handleViewTabla={handleViewOT} columns={columns} />
                </div>
            </div>
        </div>
    );
}

export default OrdenDeTrabajo;