import { useEffect, useState, useContext } from 'react';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import DashboardHeader from "../../components/menu/DashboardHeader";
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/tables/table";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import opcionesServicios from '../../lib/servicios.json';
import Modal from '../../components/forms/modal';
import { DarkModeContext } from '../../context/DarkModeContext';
import LoadingComponent from '../../components/animation/loading';

function Servicios() {
    const { darkMode } = useContext(DarkModeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loadingUserRole, setLoadingUserRole] = useState(true);
    const [newServicio, setNewServicio] = useState({
        tp_servicio: '',
        Estado: false,
        costserv: '',
        ordentrabajo_catalogoservicio_id: ''
    });

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

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
                    console.error("Error fetching user role:", error);
                } finally {
                    setLoadingUserRole(false); // Actualizamos el estado de carga
                }
            } else {
                setLoadingUserRole(false); // Si no hay JWT, también actualizamos el estado
            }
        };

        const fetchServicios = async () => {
            const jwt = getTokenFromLocalCookie();
            if (jwt) {
                try {
                    const response = await fetcher(`${STRAPI_URL}/api/catalogo-servicios`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    setServicios(response.data || []);
                } catch (error) {
                    console.error('Error fetching services:', error);
                }
            }
        };

        fetchServicios();
        fetchUserRole();
    }, [STRAPI_URL]);

    // Paginación
    const paginate = (data, currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const currentServicios = paginate(servicios, currentPage);

    const handlePageChange = (newPage) => {
        const totalPages = Math.ceil(servicios.length / itemsPerPage);
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewServicio({
            ...newServicio,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setNewServicio({ ...newServicio, tp_servicio: '' });
    };

    const handleOptionChange = (e) => {
        setNewServicio({ ...newServicio, tp_servicio: e.target.value });
    };

    const handleAddServicio = async (e) => {
        e.preventDefault();
        const jwt = getTokenFromLocalCookie();
        setIsLoading(true);

        if (jwt) {
            try {
                const servicioData = {
                    data: {
                        tp_servicio: newServicio.tp_servicio,
                        Estado: newServicio.Estado,
                        costserv: parseFloat(newServicio.costserv)
                    }
                };

                if (newServicio.ordentrabajo_catalogoservicio_id) {
                    servicioData.data.ordentrabajo_catalogoservicio_id = newServicio.ordentrabajo_catalogoservicio_id;
                }

                const response = await fetcher(`${STRAPI_URL}/api/catalogo-servicios`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify(servicioData),
                });

                if (!response.data) {
                    throw new Error("Error: La respuesta no contiene datos.");
                }

                setServicios([...servicios, response.data]);
                setNewServicio({ tp_servicio: '', Estado: false, costserv: '', ordentrabajo_catalogoservicio_id: '' });
                setSelectedCategory('');
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error adding service:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Mostrar el componente de carga mientras se obtiene el userRole
    if (loadingUserRole) {
        return <LoadingComponent />;
    }


    const handleViewServicio = (documentId) => {
        navigate(`/admin/detalle-servicio/${documentId}`);
    };

    if (userRole !== 'Admin' && userRole !== 'Mechanic') {
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
                    <DashboardHeader toggleSidebar={toggleSidebar} darkMode={darkMode} />
                    <div className="container mx-auto p-4">
                        <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Servicios Disponibles</h1>
                        <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-card text-card-foreground border-gray-200'} shadow-sm p-6 w-full`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className={`text-2xl font-semibold leading-none tracking-tight ${darkMode ? 'text-white ' : 'text-gray-900'}`}>Lista de Servicios</h3>
                                <Button onClick={() => setIsModalOpen(true)} className={`${darkMode ? 'bg-blue-700 text-white hover:bg-gray-600' : 'bg-gray-800 text-white hover:bg-gray-700'} transition duration-300`}>
                                    Agregar Servicio
                                </Button>
                            </div>

                            {servicios && servicios.length === 0 ? (
                                <div className={`text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <h4 className="text-xl">No hay servicios registrados.</h4>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} table-fixed`}>
                                        <TableHeader className={`bg-gray-100 sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <TableRow>
                                                <TableHead className="p-2 w-1/4">Tipo de Servicio</TableHead>
                                                <TableHead className="p-2 w-1/4">Estado</TableHead>
                                                <TableHead className="p-2 w-1/4">Costo</TableHead>
                                                <TableHead className="p-2 w-1/4"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentServicios.map((servicio) => (
                                                <TableRow key={servicio.id} className={`hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                                                    <TableCell className="w-1/4">{servicio.tp_servicio || 'Sin especificar'}</TableCell>
                                                    <TableCell className="w-1/4">{servicio.Estado ? 'Activo' : 'Inactivo'}</TableCell>
                                                    <TableCell className="w-1/4">${servicio.costserv || 'N/A'}</TableCell>
                                                    <TableCell className="w-1/4 px-6 py-4 font-medium text-right pr-4">
                                                        <ArrowRight
                                                            className={`inline-block cursor-pointer ${darkMode ? 'text-white' : 'text-gray-600'}`}
                                                            onClick={() => handleViewServicio(servicio.documentId)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* Controles de Paginación */}
                            <div className="flex items-center justify-center space-x-4 mt-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`p-1 hover:text-gray-700 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Página {currentPage} de {Math.ceil(servicios.length / itemsPerPage)}</span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(servicios.length / itemsPerPage)}
                                    className={`p-1 hover:text-gray-700 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                                {isLoading ? (
                                    <div className="relative">
                                        <LoadingComponent isModal={true} />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold mb-4">Agregar Servicio</h2>
                                        <form onSubmit={handleAddServicio}>
                                            <div className="grid gap-4">
                                                <select
                                                    value={selectedCategory}
                                                    onChange={handleCategoryChange}
                                                    required
                                                    className={`p-2 border rounded w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                >
                                                    <option value="" className="text-gray-500">Seleccione una categoría</option>
                                                    {opcionesServicios.map((categoria) => (
                                                        <option key={categoria.categoria} value={categoria.categoria}>
                                                            {categoria.categoria}
                                                        </option>
                                                    ))}
                                                </select>
                                                {selectedCategory && (
                                                    <select
                                                        name="tp_servicio"
                                                        value={newServicio.tp_servicio}
                                                        onChange={handleOptionChange}
                                                        required
                                                        className={`p-2 border rounded w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                    >
                                                        <option value="" className="text-gray-500">Seleccione un tipo de servicio</option>
                                                        {opcionesServicios.find(cat => cat.categoria === selectedCategory)?.opciones.map((opcion) => (
                                                            <option key={opcion} value={opcion}>
                                                                {opcion}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                <label className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    <span>Activo</span>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            name="Estado"
                                                            checked={newServicio.Estado}
                                                            onChange={handleChange}
                                                            className="sr-only"
                                                        />
                                                        <div
                                                            className={`w-10 h-6 bg-gray-300 rounded-full transition duration-200 ${newServicio.Estado ? 'bg-green-500' : 'bg-gray-300'}`}
                                                        ></div>
                                                        <div
                                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${newServicio.Estado ? 'translate-x-4' : 'translate-x-0'}`}
                                                        ></div>
                                                    </div>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="costserv"
                                                    placeholder="Costo"
                                                    value={newServicio.costserv}
                                                    onChange={handleChange}
                                                    required
                                                    className={`p-2 border rounded w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                />
                                            </div>
                                            <Button 
                                                type="submit" 
                                                className={`mt-4 px-4 py-2 text-white rounded w-full ${
                                                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                                                }`}
                                            >
                                                Agregar Servicio
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Servicios;