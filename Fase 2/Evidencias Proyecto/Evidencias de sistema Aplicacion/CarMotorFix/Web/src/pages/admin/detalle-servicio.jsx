import { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import DashboardHeader from "../../components/menu/DashboardHeader";
import { Button } from '../../components/ui/button';
import LoadingComponent from '../../components/animation/loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DarkModeContext } from '../../context/DarkModeContext';

function DetalleServicio() {
    const { darkMode } = useContext(DarkModeContext);
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [servicio, setServicio] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();
    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

    const fetchServicio = useCallback(async () => {
        if (id) {
            const jwt = getTokenFromLocalCookie();
            if (jwt) {
                try {
                    const response = await fetcher(`${STRAPI_URL}/api/catalogo-servicios/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    });
                    setServicio(response.data);
                    setEditData(response.data);
                } catch (error) {
                    console.error('Error fetching service details:', error);
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
        fetchServicio();
        fetchUserRole();
    }, [fetchServicio]);

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
            if (editData[key] !== servicio[key]) {
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
            const response = await fetch(`${STRAPI_URL}/api/catalogo-servicios/${id}`, {
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
                toast.error('Error al actualizar el servicio');
                return;
            }

            await fetchServicio();
            setIsEditing(false);
            toast.success('Servicio actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            toast.error('Error al actualizar el servicio');
        }
    };

    if (!servicio) return <LoadingComponent />;

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <ToastContainer />
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} darkMode={darkMode} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} darkMode={darkMode} />
                <div className={`p-8 flex flex-col items-start ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-4`}>
                    <Button
                        onClick={() => navigate(-1)}
                        className={`mb-4 px-4 py-2 font-semibold rounded-lg shadow ${darkMode
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                            } transition duration-300`}
                    >
                        Volver
                    </Button>

                    {/* Card de Detalle de Servicio */}
                    <div className={`w-full max-w-2xl rounded-lg p-8 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} shadow-lg`}>
                        <h1 className={`text-3xl font-extrabold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>{servicio.tp_servicio}</h1>

                        {!isEditing ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Costo:</span>
                                    <span className="text-xl font-bold text-green-600">${servicio.costserv}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Estado:</span>
                                    <span className={`text-xl font-bold ${servicio.Estado ? 'text-green-600' : 'text-red-600'}`}>
                                        {servicio.Estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                <div className="flex justify-center mt-6">
                                    <Button
                                        onClick={handleEditClick}
                                        className={`px-6 py-2 font-semibold rounded-lg shadow ${darkMode
                                            ? 'bg-blue-600 text-white hover:bg-blue-500'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            } transition duration-300`}
                                    >
                                        Modificar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}><strong>Costo:</strong></label>
                                    <input
                                        type="number"
                                        name="costserv"
                                        value={editData.costserv || ''}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 border rounded-lg mt-1 focus:border-blue-500 ${darkMode
                                            ? 'bg-gray-600 border-gray-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}><strong>Estado:</strong></label>
                                    <select
                                        name="Estado"
                                        value={editData.Estado}
                                        onChange={(e) => setEditData(prev => ({ ...prev, Estado: e.target.value === 'true' }))}
                                        className={`w-full p-3 border rounded-lg mt-1 focus:border-blue-500 ${darkMode
                                            ? 'bg-gray-600 border-gray-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <div className="flex justify-center space-x-4 mt-6">
                                    <Button
                                        onClick={handleSave}
                                        className={`px-6 py-2 font-semibold rounded-lg shadow ${darkMode
                                            ? 'bg-green-600 text-white hover:bg-green-500'
                                            : 'bg-green-600 text-white hover:bg-green-500'
                                            } transition duration-300`}
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        onClick={() => setIsEditing(false)}
                                        className={`px-6 py-2 font-semibold rounded-lg shadow ${darkMode
                                            ? 'bg-red-600 text-white hover:bg-red-500'
                                            : 'bg-red-600 text-white hover:bg-red-500'
                                            } transition duration-300`}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleServicio;