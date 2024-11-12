import { useState } from 'react';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import { toast } from 'react-toastify';
import DashboardSidebar from '../../components/menu/DashboardSidebar';
import DashboardHeader from '../../components/menu/DashboardHeader';
import { Button } from '../../components/ui/button';

function AsignarMecanico() {
    const [run, setRun] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState("Admin");

    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

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
                    const updatedUser = await response.json();
                    toast.success("Rol de mecánico asignado exitosamente.");
                    setUser({ ...user, role: { id: '3', name: 'Mecánico' } });
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

    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} />
                <div className="p-8 bg-white rounded-lg shadow-lg mx-6 my-6">
                    <h1 className="text-3xl font-bold text-gray-700 mb-6">Asignar Rol de Mecánico</h1>

                    {/* Sección de Buscar Usuario */}
                    <div className="p-6 bg-gray-100 rounded-lg shadow-md mb-6">
                        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Buscar Usuario</h2>
                        <label htmlFor="run" className="block text-sm font-medium text-gray-600 mb-2">
                            Ingrese el RUN del Usuario
                        </label>
                        <input
                            type="text"
                            id="run"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123456789 - Sin punto ni guión"
                            value={run}
                            onChange={(e) => setRun(e.target.value)}
                        />
                        <Button
                            onClick={handleSearchUser}
                            className={`w-1/8 mt-4 py-2 px-4 rounded-lg transition ${loading ? 'cursor-not-allowed' : ''
                                } text-white font-semibold`}
                            disabled={loading}
                        >
                            {loading ? 'Buscando...' : 'Buscar Usuario'}
                        </Button>
                    </div>

                    {/* Sección de Asignar Rol */}
                    {user && (
                        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-green-700 mb-4">Información del Usuario</h2>
                            <div className="text-gray-700 space-y-2">
                                <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>RUN:</strong> {user.run}</p>
                                <p><strong>Rol Actual:</strong> {user.role ? user.role.name : 'Sin rol asignado'}</p>
                            </div>

                            <Button
                                onClick={() => setConfirmModalOpen(true)}
                                className={`w-1/8 mt-6 py-2 px-4 rounded-lg transition ${assigning ? 'cursor-not-allowed' : ''} text-white font-semibold`}
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
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">¿Confirmar Asignación de Rol?</h3>
                        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas asignar el rol de mecánico a este usuario?</p>
                        <div className="flex justify-end space-x-4">
                            <Button
                                onClick={handleAssignRole}
                                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                                disabled={assigning}
                            >
                                Confirmar
                            </Button>
                            <Button
                                onClick={() => setConfirmModalOpen(false)}
                                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AsignarMecanico;
