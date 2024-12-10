import { useEffect, useState, useContext } from 'react';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import DashboardSidebar from '../../components/menu/DashboardSidebar';
import DashboardHeader from '../../components/menu/DashboardHeader';
import { DarkModeContext } from '../../context/DarkModeContext';
import Tablas from '../../components/Tablas';
import { useNavigate } from 'react-router-dom';
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

function OrdenDeTrabajo() {
    const { darkMode } = useContext(DarkModeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [ordenTrabajo, setOrdenTrabajo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const jwt = getTokenFromLocalCookie();
            if (!jwt) return;

            const userResponse = await fetcher(`${STRAPI_URL}/api/users/me?pLevel`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            });

            setUserRole(userResponse.role.name);

            if (userResponse.mecanico) {
                const mecanicoID = userResponse.mecanico.documentId;

                const ordenesResponse = await fetcher(
                    `${STRAPI_URL}/api/mecanicos/${mecanicoID}?pLevel`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                const ordenes = ordenesResponse.data.orden_trabajos_id || [];
                const ordenesIds = ordenes.filter(OT => OT.estado_ot_id.nom_estado !== 'Cotizando' && OT.estado_ot_id.nom_estado !== 'Rechazado');

                setOrdenTrabajo(ordenesIds || []);
                setTotal(ordenesIds.length);
            } else {
                const ordenesResponse = await fetcher(`${STRAPI_URL}/api/orden-trabajos?pLevel`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                const ordenes2 = ordenesResponse.data || [];
                const ordenesIds2 = ordenes2.filter(OT => OT.estado_ot_id.nom_estado !== 'Cotizando' && OT.estado_ot_id.nom_estado !== 'Rechazado');

                setOrdenTrabajo(ordenesIds2 || []);
                setTotal(ordenesIds2.length);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleViewOT = (ordenTrabajo) => {
        navigate(`/detalle_ot/${ordenTrabajo.documentId}`);
    };

    const columns = [
        {
            header: 'N° Orden',
            key: 'nro_orden',
            render: (ordenTrabajo) => ordenTrabajo.id || 'N° Orden no disponible',
        },
        {
            header: 'Cliente',
            key: 'cliente',
            render: (ordenTrabajo) =>
                ordenTrabajo.user
                    ? `${ordenTrabajo.user.nombre} ${ordenTrabajo.user.apellido}`
                    : 'Cliente no disponible',
        },
        {
            header: 'Servicio',
            key: 'servicio',
            render: (ordenTrabajo) => {
                const servicios = ordenTrabajo.catalogo_servicios;
                if (servicios) {

                    return (
                        <div className="relative flex justify-center items-center group">
                            <span className="text-black">
                                {`${servicios.length}`}
                            </span>

                            {servicios && (
                                <div className="absolute left-6 bottom-[-10px] ml-2 hidden w-60 p-2 bg-white border border-gray-300 rounded shadow-lg text-black group-hover:block z-10">
                                    <ul className="space-y-1">
                                        {servicios.map((servicio, index) => (
                                            <li key={index} className="whitespace-nowrap">
                                                {servicio.tp_servicio}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                }
                return 'Servicio no disponible';
            }
        },
        {
            header: 'Estado',
            key: 'estado',
            render: (ordenTrabajo) =>
                ordenTrabajo.estado_ot_id?.nom_estado || 'Estado no disponible',
        },
        {
            header: 'Costo',
            key: 'costo',
            render: (ordenTrabajo) =>
                ordenTrabajo.costo
                    ? new Intl.NumberFormat('es-CL').format(ordenTrabajo.costo)
                    : 'Costo no disponible',
        },
    ];

    return (
        <div
            className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
                }`}
        >
            <DashboardSidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                userRole={userRole}
            />

            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} />

                <div className="container mx-auto p-4">
                    <div className="mb-4">
                        <span className="font-semibold">Total de órdenes de trabajo: </span>
                        <span>{total}</span>
                    </div>
                    {loading ? (
                        <p>Cargando datos...</p>
                    ) : (
                        <Tablas
                            servicio={ordenTrabajo}
                            handleViewTabla={handleViewOT}
                            columns={columns}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrdenDeTrabajo;
