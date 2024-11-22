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
    const [mecanicoID, setMecanicoID] = useState(null);
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
                if (response.mecanico) {
                    setMecanicoID(response.mecanico.documentId);
                } else {
                    setOrdenTrabajo(response.ots);
                }

            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        }
    };

    const fetchOrdenesTrabajo = async () => {
        const jwt = getTokenFromLocalCookie();
        if (jwt && mecanicoID) {
            try {
                const response = await fetcher(`${STRAPI_URL}/api/mecanicos/${mecanicoID}?pLevel`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                setOrdenTrabajo(response.data.orden_trabajos_id);
                console.log(response.data.orden_trabajos_id);

            } catch (error) {
                console.error("Error fetching ordenes de trabajo:", error);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUser();
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (mecanicoID) {
            fetchOrdenesTrabajo();
        }
    }, [mecanicoID]);


    const handleViewOT = (ordenTrabajo) => {
        navigate(`/detalle_ot/${ordenTrabajo.documentId}`);
    };

    const columns = [
        {
            header: "N° Orden",
            key: "nro_orden",
            render: (ordenTrabajo) => ordenTrabajo.id || 'N° Orden no disponible',
        },
        {
            header: "Cliente",
            key: "cliente",

            render: (ordenTrabajo) => ordenTrabajo.user?.nombre + ' ' + ordenTrabajo.user?.apellido || 'Cliente no disponible',
        },
        {
            header: "Servicio",
            key: "servicio",
            render: (ordenTrabajo) => {
                if (ordenTrabajo.catalogo_servicios && ordenTrabajo.catalogo_servicios.length > 0) {
                    const allServices = ordenTrabajo.catalogo_servicios.map(servicio => servicio.tp_servicio).join(', ');
                    return allServices;
                }
                return 'Servicio no disponible';
            },
        },
        {
            header: "Estado",
            key: "estado",
            render: (ordenTrabajo) => ordenTrabajo.estado_ot_id.nom_estado || 'Estado no disponible',
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