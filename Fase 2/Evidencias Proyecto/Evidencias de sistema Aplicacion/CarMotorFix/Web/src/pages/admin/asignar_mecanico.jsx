import { useEffect, useState, useContext } from 'react';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import { toast } from 'react-toastify';
import DashboardSidebar from '../../components/menu/DashboardSidebar';
import DashboardHeader from '../../components/menu/DashboardHeader';
import { Button } from '../../components/ui/button';
import { DarkModeContext } from '../../context/DarkModeContext';

function AsignarMecanico() {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [run, setRun] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
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
                    console.error('Error fetching user role:', error);
                }
            }
        };

        fetchUserRole();
    }, [STRAPI_URL]);

    const handleSearchUser = async () => {
        const jwt = getTokenFromLocalCookie();
        if (!run) {
            toast.warn("Por favor, ingrese un RUN.");
            return;
        }
        if (jwt) {
            setLoading(true);
            setUser(null);
            try {
                const response = await fetcher(`${STRAPI_URL}/api/users?filters[run][$eq]=${run}&populate=role`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                if (response.error || response.length === 0) {
                    toast.error("Usuario no encontrado.");
                } else {
                    setUser(response[0]);
                    toast.success("Usuario encontrado.");
                }
            } catch (error) {
                console.error("Error buscando usuario:", error);
                toast.error("Ocurrió un error inesperado.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAssignRole = async () => {
        const jwt = getTokenFromLocalCookie();
        if (jwt && user) {
            setAssigning(true);
            try {
                const response = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        role: '3',
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
                    console.error("Error al asignar rol:", errorData);
                    toast.error(errorData.message || "Error al asignar el rol de mecánico.");
                } else {
                    // const updatedUser = await response.json();
                    toast.success("Rol de mecánico asignado exitosamente.");
                    setUser({ ...user, role: { id: '3', name: 'Mecánico' } });

                    // Insertar datos en la tabla Mecanico
                    const mecanicoResponse = await fetch(`${STRAPI_URL}/api/mecanicos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                        body: JSON.stringify({
                            data: {
                                run: user.run,
                                prim_nom: user.nombre,
                                prim_apell: user.apellido,
                                correo: user.email,
                            }
                        }),
                    });

                    if (!mecanicoResponse.ok) {
                        const errorData = await mecanicoResponse.json().catch(() => ({ message: "Error desconocido" }));
                        console.error("Error al insertar en la tabla Mecanico:", errorData);
                        toast.error(errorData.message || "Error al insertar en la tabla Mecanico.");
                    } else {
                        toast.success("Datos insertados en la tabla Mecanico exitosamente.");
                    }
                }
            } catch (error) {
                console.error("Error al asignar rol:", error);
                toast.error("Ocurrió un error inesperado.");
            } finally {
                setAssigning(false);
                setConfirmModalOpen(false);
            }
        }
    };

if (userRole !== 'Admin') {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-8">Oops! La página que buscas no existe.</p>
            <button
                onClick={() => window.location.href = '/inicio'}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
            >
                Volver al inicio
            </button>
        </div>
    );
    
} else {
    return (
        <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} darkMode={darkMode} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <div className={`p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mx-6 my-6`}>
                    <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Asignar Rol de Mecánico</h1>

                    {/* Sección de Buscar Usuario */}
                    <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg shadow-md mb-6`}>
                        <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Buscar Usuario</h2>
                        <label htmlFor="run" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Ingrese el RUN del Usuario
                        </label>
                        <input
                            type="text"
                            id="run"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            placeholder="123456789 - Sin punto ni guión"
                            value={run}
                            onChange={(e) => setRun(e.target.value)}
                        />
                        <Button
                            onClick={handleSearchUser}
                            className={`w-1/8 mt-4 py-2 px-4 rounded-lg transition ${loading ? 'cursor-not-allowed bg-gray-500' : 'bg-gray-700 hover:bg-gray-700'} ${darkMode
                                ? 'bg-blue-700 text-white hover:bg-gray-800'
                                : 'bg-gray-800 text-white hover:bg-gray-700'} text-white font-semibold`}
                            disabled={loading}
                        >
                            {loading ? 'Buscando...' : 'Buscar Usuario'}
                        </Button>
                    </div>

                    {/* Sección de Asignar Rol */}
                    {user && (
                        <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg shadow-md`}>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Información del Usuario</h2>
                            <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>RUN:</strong> {user.run}</p>
                                <p><strong>Rol Actual:</strong> {user.role ? user.role.name : 'Sin rol asignado'}</p>
                            </div>

                            <Button
                                onClick={() => setConfirmModalOpen(true)}
                                className={`w-1/8 mt-6 py-2 px-4 rounded-lg transition ${assigning ? 'cursor-not-allowed bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold`}
                                disabled={assigning}
                            >
                                {assigning ? 'Asignando...' : 'Asignar Rol de Mecánico'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Confirmación */}
            {confirmModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>¿Confirmar Asignación de Rol?</h3>
                        <p className="mb-6">¿Estás seguro de que deseas asignar el rol de mecánico a este usuario?</p>
                        <div className="flex justify-end space-x-4">
                            <Button
                                onClick={handleAssignRole}
                                className={`px-4 py-2 rounded-lg ${assigning ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                disabled={assigning}
                            >
                                Confirmar
                            </Button>
                            <Button
                                onClick={() => setConfirmModalOpen(false)}
                                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
}

export default AsignarMecanico;