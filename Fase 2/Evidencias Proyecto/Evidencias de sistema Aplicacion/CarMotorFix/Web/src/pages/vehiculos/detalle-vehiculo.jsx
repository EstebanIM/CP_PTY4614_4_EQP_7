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
import Modal from "../../components/forms/modal";
import 'react-toastify/dist/ReactToastify.css';

function DetalleVehiculo() {
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [vehiculo, setVehiculo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [ots, setOts] = useState([]);
    const navigate = useNavigate();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [searchRun, setSearchRun] = useState('');
    const [searchResult, setSearchResult] = useState(null);

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



    const handleDisableVehicle = async () => {
        const jwt = getTokenFromLocalCookie();
        try {
            const response = await fetch(`${STRAPI_URL}/api/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ data: { disabled: true } }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al deshabilitar el vehículo:', errorData);
                return;
            }

            await fetchVehiculo();
            alert('Vehículo deshabilitado exitosamente.');
        } catch (error) {
            console.error('Error al deshabilitar el vehículo:', error);
        }
    };

    const handleSearchUser = async () => {
        const jwt = getTokenFromLocalCookie();
        try {
            const response = await fetcher(`${STRAPI_URL}/api/users?filters[run][$eq]=${searchRun}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (response && response.length > 0) {
                setSearchResult(response[0]);
            } else {
                setSearchResult(null);
                alert('Usuario no encontrado.');
            }
        } catch (error) {
            console.error("Error al buscar usuario:", error);
        }
    };

    const handleTransferVehicle = () => {
        setIsTransferModalOpen(true);
    };

    const handleConfirmTransferClick = () => {
        if (!searchResult) {
            toast.error('No hay un usuario seleccionado para transferir el vehículo.');
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const confirmTransfer = async () => {
        const jwt = getTokenFromLocalCookie();
        try {
            const response = await fetch(`${STRAPI_URL}/api/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ data: { user_id: searchResult.id } }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al transferir el vehículo:', errorData);
                toast.error('Error al transferir el vehículo.');
                return;
            }

            await fetchVehiculo();
            setIsTransferModalOpen(false);
            setIsConfirmModalOpen(false);
            toast.success('Vehículo transferido exitosamente.');
        } catch (error) {
            console.error('Error al transferir el vehículo:', error);
            toast.error('Error al transferir el vehículo.');
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
                        <Button className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-800'}`} onClick={handleBack} variant="default" size="md">Volver</Button>
                        <h1 className="text-2xl sm:text-4xl font-bold text-center sm:w-full">{vehiculo.modelo}</h1>
                    </div>

                    <div className={`rounded-lg shadow-md p-4 sm:p-6 mb-6 ${darkMode ? 'bg-gray-500' : 'bg-white'}`}>
                        {!isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                                <p><strong>Marca:</strong> {vehiculo.marca_id?.nombre_marca || 'Sin marca'}</p>
                                <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                                <p><strong>Patente:</strong> {vehiculo.patente}</p>
                                <p><strong>Color:</strong> {vehiculo.color}</p>
                                <p><strong>Motor:</strong> {vehiculo.motor}</p>
                                <p><strong>Kilometraje:</strong> {vehiculo.kilometraje}</p>
                                <div className="col-span-full flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={handleEditClick}
                                            className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-800'}`}
                                            variant="default"
                                            size="md"
                                        >
                                            Modificar
                                        </Button>
                                        <Button
                                            onClick={handleTransferVehicle}
                                            className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-800'}`}
                                            variant="default"
                                            size="md"
                                        >
                                            Transferir Vehículo
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={handleDisableVehicle}
                                        className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-800'}`}
                                        variant="default"
                                        size="md"
                                    >
                                        Deshabilitar Vehículo
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                                <div>
                                    <label><strong>Kilometraje:</strong></label>
                                    <p className={`w-full p-2 border rounded bg-gray-100 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>{editData.kilometraje}</p>
                                </div>
                                <div>
                                    <label><strong>Marca:</strong></label>
                                    <p className={`w-full p-2 border rounded bg-gray-100 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>{editData.marca_id?.nombre_marca || 'Sin marca'}</p>
                                </div>
                                <div>
                                    <label><strong>Patente:</strong></label>
                                    <p className={`w-full p-2 border rounded bg-gray-100 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>{editData.patente}</p>
                                </div>
                                <div>
                                    <label><strong>Modelo:</strong></label>
                                    <p className={`w-full p-2 border rounded bg-gray-100 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>{editData.modelo}</p>
                                </div>
                                <div>
                                    <label><strong>Color:</strong></label>
                                    <input type="text" name="color" value={editData.color} onChange={handleInputChange} className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} />
                                </div>
                                <div>
                                    <label><strong>Motor:</strong></label>
                                    <input type="text" name="motor" value={editData.motor} onChange={handleInputChange} className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} />
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

                {isTransferModalOpen && (
                    <Modal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)}>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-4">Transferir Vehículo</h2>
                            <div className="mb-4">
                                <label className="block mb-2">Busca al usuario al que quieres tranferir el vehiculo:</label>
                                <input
                                    type="text"
                                    value={searchRun}
                                    onChange={(e) => setSearchRun(e.target.value)}
                                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
                                />
                                <Button onClick={handleSearchUser} variant="default" size="md" className={`mt-2 p-2 rounded ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-600'}`}>Buscar</Button>
                            </div>
                            {searchResult && (
                                <div className="mb-4">
                                    <p><strong>Nombre:</strong> {searchResult.username}</p>
                                    <p><strong>Email:</strong> {searchResult.email}</p>
                                    <Button onClick={handleConfirmTransferClick} variant="default" size="md" className={`mt-2 p-2 rounded ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-600'}`}>Transferir Vehículo</Button>
                                </div>
                            )}
                        </div>
                    </Modal>
                )}

                {isConfirmModalOpen && (
                    <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-4">Confirmar Transferencia</h2>
                            <p>¿Estás seguro de que deseas transferir el vehículo a {searchResult.username}?</p>
                            <div className="flex space-x-4 mt-4">
                                <Button onClick={confirmTransfer} variant="default" size="md" className={`p-2 rounded ${darkMode ? 'bg-green-600 text-white' : 'bg-green-500'}`}>Sí</Button>
                                <Button onClick={() => setIsConfirmModalOpen(false)} variant="default" size="md" className={`p-2 rounded ${darkMode ? 'bg-red-600 text-white' : 'bg-red-500'}`}>No</Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}

export default DetalleVehiculo;
