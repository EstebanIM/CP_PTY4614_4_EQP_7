import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import DashboardSidebar from '../../components/menu/DashboardSidebar';
import DashboardHeader from '../../components/menu/DashboardHeader';
import { Button } from '../../components/ui/button';
import LoadingComponent from '../../components/animation/loading';
import Tablas from '../../components/Tablas';

function DetalleVehiculo() {
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [vehiculo, setVehiculo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();

    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

    const fetchVehiculo = useCallback(async () => {
        if (id) {
            const jwt = getTokenFromLocalCookie();
            if (jwt) {
                try {
                    // const response = await fetcher(`${STRAPI_URL}/api/vehiculos/${id}?populate[marca_id][fields][0]=nombre_marca&populate[tp_vehiculo_id][fields][0]=nom_tp_vehiculo`, {
                    const response = await fetcher(`${STRAPI_URL}/api/vehiculos/${id}?populate=*`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    });
                    setVehiculo(response.data);
                    setEditData(response.data);
                    console.log("OT:", response.data.ots);
                    
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
                console.log("User role:", response);
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

    if (!vehiculo) return <LoadingComponent />;

    const columns = [
        {
            header: "#",
            key: "id",
        },
        {
            header: "Fecha",
            key: "fecha",
        },
        {
            header: "Tipo de mantención",
            key: "tipo_mantencion",
        },
        {
            header: "Valor",
            key: "valor",
        }
    ];

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} />

                <div className="p-4 sm:p-6 flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                        <Button onClick={handleBack} variant="outline" size="md" className="mb-2 sm:mb-0">Volver</Button>
                        <h1 className="text-2xl sm:text-4xl font-bold text-black text-center sm:w-full">{vehiculo.modelo}</h1>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
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

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-x-auto">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4">Historial de Mantenimiento</h3>
                        <div className="min-w-full">
                            <Tablas servicio={vehiculo} columns={columns} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleVehiculo;
