import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import DashboardSidebar from '../../components/menu/DashboardSidebar';
import DashboardHeader from '../../components/menu/DashboardHeader';
import { Button } from '../../components/ui/button';
import { Table } from "../../components/ui/tables/table";
import Tablas from "../../components/Tablas";
import LoadingComponent from '../../components/animation/loading';
import { getDarkModeFromLocalCookie } from '../../lib/cookies'; 
import Modal  from "../../components/forms/modal";
function DetalleVehiculo() {
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [vehiculo, setVehiculo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [ots, setOts] = useState([]);
    const navigate = useNavigate();

    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

    const fetchVehiculo = useCallback(async () => {
        if (id) {
            const jwt = getTokenFromLocalCookie();
            if (jwt) {
                try {
                    const response = await fetcher(`${STRAPI_URL}/api/vehiculos/${id}?populate[marca_id][fields]=nombre_marca&populate[tp_vehiculo_id][fields]=nom_tp_vehiculo&populate=ots`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    });

                    setVehiculo(response.data);
                    setEditData(response.data);
                    setOts(response.data.ots || []);

                } catch (error) {
                    console.error('Error fetching vehicle details:', error);
                }
            }
        }
    }, [id, STRAPI_URL]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
        fetchVehiculo();
        fetchUserRole();
    }, []);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const jwt = getTokenFromLocalCookie();
        const changes = Object.keys(editData).reduce((acc, key) => {
            if (editData[key] !== vehiculo[key]) {
                acc[key] = editData[key];
            }
            return acc;
        }, {});

        if (Object.keys(changes).length === 0) {
            console.log("No hay cambios para guardar.");
            setIsEditing(false);
            return;
        }

        try {
            const response = await fetch(`${STRAPI_URL}/api/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ data: changes }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error en la actualización:', errorData);
                return;
            }

            await fetchVehiculo();
            setIsEditing(false);
        } catch (error) {
            console.error('Error al actualizar el vehículo:', error);
        }
    };

    const handleViewOT = (id) => {
        console.log("Ver OT:", id);
    };

    if (!vehiculo) return <LoadingComponent />;

    const columns = [
        {
            header: "#",
            key: "id",
            render: (ots) => ots.id || 'Sin ID',
        },
        {
            header: "Fecha",
            key: "fecha",
            render: (ots) => {
                if (!ots.fechainicio) return 'Fecha no disponible';
                const [year, month, day] = ots.fechainicio.split('-');
                return `${day}-${month}-${year}`;
            }
        },
        {
            header: "Tipo de mantención",
            key: "tipo_mantencion",
            render: (ots) => ots.tipo_mantencion || 'Sin tipo',
        },
        {
            header: "Valor",
            key: "valor",
            render: (ots) => ots.costo
                ? new Intl.NumberFormat('es-CL').format(ots.costo)
                : 'Total no disponible',
        }
    ];

    // Get dark mode from cookies
    const darkMode = getDarkModeFromLocalCookie();

    return (
        <div className={`flex flex-col lg:flex-row h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} />

                <div className={`p-4 sm:p-6 flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                        <Button onClick={handleBack} variant="default" size="md">Volver</Button>
                        <h1 className="text-2xl sm:text-4xl font-bold text-center sm:w-full">{vehiculo.modelo}</h1>
                    </div>

                    <div className={`rounded-lg shadow-md p-4 sm:p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {!isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                                <p><strong>Marca:</strong> {vehiculo.marca_id?.nombre_marca || 'Sin marca'}</p>
                                <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                                <p><strong>Patente:</strong> {vehiculo.patente}</p>
                                <p><strong>Color:</strong> {vehiculo.color}</p>
                                <p><strong>Motor:</strong> {vehiculo.motor}</p>
                                <p><strong>Kilometraje:</strong> {vehiculo.kilometraje}</p>
                                <div className="col-span-full flex justify-start">
                                    <Button onClick={handleEditClick} variant="default" size="md">Modificar</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                                <div>
                                    <label><strong>Kilometraje:</strong></label>
                                    <p className="w-full p-2 border rounded bg-gray-100">{editData.kilometraje}</p>
                                </div>
                                <div>
                                    <label><strong>Marca:</strong></label>
                                    <p className="w-full p-2 border rounded bg-gray-100">{editData.marca_id?.nombre_marca || 'Sin marca'}</p>
                                </div>
                                <div>
                                    <label><strong>Patente:</strong></label>
                                    <p className="w-full p-2 border rounded bg-gray-100">{editData.patente}</p>
                                </div>
                                <div>
                                    <label><strong>Modelo:</strong></label>
                                    <p className="w-full p-2 border rounded bg-gray-100">{editData.modelo}</p>
                                </div>
                                <div>
                                    <label><strong>Color:</strong></label>
                                    <input type="text" name="color" value={editData.color} onChange={handleInputChange} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label><strong>Motor:</strong></label>
                                    <input type="text" name="motor" value={editData.motor} onChange={handleInputChange} className="w-full p-2 border rounded" />
                                </div>
                                <div className="col-span-full flex justify-start">
                                    <Button onClick={handleSave} variant="default" size="md">Guardar</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`rounded-lg shadow-md p-4 sm:p-6 overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="text-lg sm:text-xl font-semibold mb-4">Historial de Mantenimiento</h3>
                        <Table className="min-w-full">
                        {ots.length === 0 ? (
                                <div className="text-center text-gray-500 mt-4">
                                    <h4 className="text-xl">No hay historial sobre este vehiculo.</h4>
                                </div>
                            ) : (
                                <div>
                                    <Tablas servicio={ots} handleViewTabla={handleViewOT} columns={columns} />
                                </div>
                            )}
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleVehiculo;
