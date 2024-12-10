import { useEffect, useState, useContext } from 'react';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import { toast } from 'react-toastify';
import DashboardSidebar from '../../components/menu/DashboardSidebar';
import DashboardHeader from '../../components/menu/DashboardHeader';
import { Button } from '../../components/ui/button';
import { DarkModeContext } from '../../context/DarkModeContext';
import LoadingComponent from '../../components/animation/loading';
import Tablas from '../../components/Tablas';

function AsignarMecanico() {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    // const [run, setRun] = useState('');
    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(false);
    // const [assigning, setAssigning] = useState(false);
    // const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loadingUserRole, setLoadingUserRole] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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
                } finally {
                    setLoadingUserRole(false);
                }
            } else {
                setLoadingUserRole(false);
            }
        };

        fetchUserRole();
    }, [STRAPI_URL]);

    useEffect(() => {
        const obtenerUsuarios = async () => {
            const jwt = getTokenFromLocalCookie();
            if (jwt) {
                try {
                    const response = await fetcher(`${STRAPI_URL}/api/users?populate=role`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    });
                    setUsuarios(response);
                } catch (error) {
                    console.error("Error obteniendo usuarios:", error);
                    toast.error("Ocurrió un error al obtener los usuarios.");
                } finally {
                    setLoadingUsuarios(false);
                }
            }
        };

        obtenerUsuarios();
    }, [STRAPI_URL]);

    // const handleSearchUser = async () => {
    //     const jwt = getTokenFromLocalCookie();
    //     if (!run) {
    //         toast.warn("Por favor, ingrese un RUN.");
    //         return;
    //     }
    //     if (jwt) {
    //         setLoading(true);
    //         setUser(null);
    //         try {
    //             const response = await fetcher(`${STRAPI_URL}/api/users?filters[run][$eq]=${run}&populate=role`, {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${jwt}`,
    //                 },
    //             });

    //             if (response.error || response.length === 0) {
    //                 toast.error("Usuario no encontrado.");
    //             } else {
    //                 setUser(response[0]);
    //                 toast.success("Usuario encontrado.");
    //             }
    //         } catch (error) {
    //             console.error("Error buscando usuario:", error);
    //             toast.error("Ocurrió un error inesperado.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    // };

    // const handleAssignRole = async () => {
    //     const jwt = getTokenFromLocalCookie();
    //     if (jwt && user) {
    //         setAssigning(true);
    //         try {
    //             const response = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
    //                 method: 'PUT',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${jwt}`,
    //                 },
    //                 body: JSON.stringify({
    //                     role: '3',
    //                 }),
    //             });

    //             if (!response.ok) {
    //                 const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
    //                 console.error("Error al asignar rol:", errorData);
    //                 toast.error(errorData.message || "Error al asignar el rol de mecánico.");
    //             } else {
    //                 toast.success("Rol de mecánico asignado exitosamente.");
    //                 setUser({ ...user, role: { id: '3', name: 'Mecánico' } });

    //                 // Insertar datos en la tabla Mecanico
    //                 const mecanicoResponse = await fetch(`${STRAPI_URL}/api/mecanicos`, {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         Authorization: `Bearer ${jwt}`,
    //                     },
    //                     body: JSON.stringify({
    //                         data: {
    //                             run: user.run,
    //                             prim_nom: user.nombre,
    //                             prim_apell: user.apellido,
    //                             correo: user.email,
    //                         }
    //                     }),
    //                 });

    //                 if (!mecanicoResponse.ok) {
    //                     const errorData = await mecanicoResponse.json().catch(() => ({ message: "Error desconocido" }));
    //                     console.error("Error al insertar en la tabla Mecanico:", errorData);
    //                     toast.error(errorData.message || "Error al insertar en la tabla Mecanico.");
    //                 } else {
    //                     toast.success("Datos insertados en la tabla Mecanico exitosamente.");
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Error al asignar rol:", error);
    //             toast.error("Ocurrió un error inesperado.");
    //         } finally {
    //             setAssigning(false);
    //             setConfirmModalOpen(false);
    //         }
    //     }
    // };

    const handleToggleRole = async () => {
        const jwt = getTokenFromLocalCookie();
        if (!jwt || !selectedUser) return;

        try {
            if (selectedUser.role === 'Mechanic') {
                await fetch(`${STRAPI_URL}/api/users/${selectedUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        role: '1',
                    }),
                });
                toast.success("Rol de Cliente asignado exitosamente.");
                setIsModalOpen(false)
            } else {
                await fetch(`${STRAPI_URL}/api/users/${selectedUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        role: '3',
                    }),
                });
                toast.success("Rol de Mecánico asignado exitosamente.");
                setIsModalOpen(false)
            }

            setSelectedUser(prev => ({
                ...prev,
                role: selectedUser.role === 'Mechanic' ? 'Authenticated' : 'Mechanic',
            }));

            setUsuarios(prevUsuarios => prevUsuarios.map(usuario =>
                usuario.id === selectedUser.id
                    ? { ...usuario, role: selectedUser.role === 'Mechanic' ? 'Authenticated' : 'Mechanic' }
                    : usuario
            ));
        } catch (error) {
            console.error("Error al actualizar el rol:", error);
            toast.error("Ocurrió un error al actualizar el rol.");
        }
    };

    const handleToggleBlocked = async () => {
        const jwt = getTokenFromLocalCookie();
        if (!jwt || !selectedUser) return;

        try {
            if (selectedUser.blocked === false) {
                await fetch(`${STRAPI_URL}/api/users/${selectedUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        blocked: true,
                    }),
                });
                toast.success("Usuario desactivado exitosamente.");
                setIsModalOpen(false)
            } else {
                await fetch(`${STRAPI_URL}/api/users/${selectedUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        blocked: false,
                    }),
                });
                toast.success("Usuario activado exitosamente.");
                setIsModalOpen(false)
            }

            setSelectedUser(prev => ({
                ...prev,
                blocked: selectedUser.blocked === true ? false : true,
            }));

            setUsuarios(prevUsuarios => prevUsuarios.map(usuario =>
                usuario.id === selectedUser.id
                    ? { ...usuario, blocked: selectedUser.blocked === true ? false : true }
                    : usuario
            ));
        } catch (error) {
            console.error("Error al actualizar el Estado:", error);
            toast.error("Ocurrió un error al actualizar el Estado.");
        }
    };

    const formatearRun = (run) => {
        if (!run) return '';
        const runStr = String(run);
        const runSinGuion = runStr.replace('-', '');
        const dv = runStr.slice(-1);
        const cuerpo = runSinGuion.slice(0, -1);
        let formato = '';
        if (cuerpo.length === 7) { // Formato "1.111.111-1"
            formato = cuerpo.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv;
        } else if (cuerpo.length === 8) { // Formato "11.111.111-1"
            formato = cuerpo.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv;
        } else {
            formato = runStr; // Retorna el RUN original si no coincide con los formatos esperados
        }

        return formato;
    };

    const columns = [
        {
            header: 'Nombre Completo',
            key: 'nombreCompleto',
            render: (item) => `${item.nombre} ${item.apellido}`,
        },
        {
            header: 'Email',
            key: 'email',
        },
        {
            header: 'Rol',
            key: 'role',
            render: (item) => {
                if (item.role === 'Mechanic') return 'Mecánico';
                if (item.role === 'Authenticated') return 'Cliente';
                return item.role;
            },
        },
        {
            header: 'RUN',
            key: 'run',
            render: (item) => formatearRun(item.run),
        },
        {
            header: 'Estado',
            key: 'blocked',
            render: (item) => item.blocked ? 'Desactivado' : 'Activo',
        },
    ];

    const handleViewTabla = (item) => {
        setSelectedUser(item);
        setIsModalOpen(true);
    };

    if (loadingUserRole || loadingUsuarios) {
        return <LoadingComponent />;
    }

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
    }

    return (
        <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} darkMode={darkMode} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <div className={`p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mx-6 my-6`}>
                    <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Gestión de Usuarios</h1>

                    <Tablas
                        servicio={usuarios
                            .filter(usuario => usuario.role.name !== 'Admin')
                            .map(usuario => ({
                                ...usuario,
                                nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
                                role: usuario.role.name,
                            }))}
                        columns={columns}
                        handleViewTabla={handleViewTabla}
                        loading={loadingUsuarios}
                    />

                    {isModalOpen && selectedUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                                    Información del Usuario
                                </h3>
                                <div className="space-y-2">
                                    <p><strong>Nombre:</strong> {selectedUser.nombre} {selectedUser.apellido}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>RUN:</strong> {formatearRun(selectedUser.run)}</p>
                                    <p><strong>Rol Actual:</strong> {selectedUser.role === 'Mechanic' ? 'Mecánico' : selectedUser.role === 'Authenticated' ? 'Cliente' : selectedUser.role}</p>
                                    <p><strong>Estado:</strong> {selectedUser.blocked ? 'Desactivado' : 'Activo'}</p>
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
                                <Button
                                        onClick={handleToggleBlocked}
                                        className={`px-4 py-2 rounded-lg ${selectedUser.blocked === false ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                    >
                                        {selectedUser.blocked === true ? 'Activar Usuario' : 'Desactivar Usuario'}
                                    </Button>
                                    <Button
                                        onClick={handleToggleRole}
                                        className={`px-4 py-2 rounded-lg ${selectedUser.role === 'Mechanic' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                    >
                                        {selectedUser.role === 'Mechanic' ? 'Quitar Rol de Mecánico' : 'Asignar Rol de Mecánico'}
                                    </Button>
                                    <Button
                                        onClick={() => setIsModalOpen(false)}
                                        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                                    >
                                        Cerrar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AsignarMecanico;