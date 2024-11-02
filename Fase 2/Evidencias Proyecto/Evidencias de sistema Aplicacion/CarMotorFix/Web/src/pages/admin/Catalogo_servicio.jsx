import { useEffect, useState } from 'react';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import DashboardHeader from "../../components/menu/DashboardHeader";
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/tables/table";
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Servicios() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newServicio, setNewServicio] = useState({
        tp_servicio: '',
        descripcion: '',
        costserv: '',
        ordentrabajo_catalogoservicio_id: ''
    });

    // Función para alternar el estado del sidebar
    const toggleSidebar = () => {
        console.log("Cambiando estado del sidebar. Estado actual:", sidebarOpen);
        setSidebarOpen(!sidebarOpen); // Cambia el estado a su opuesto
        console.log("Nuevo estado del sidebar:", !sidebarOpen);
    };

    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

    const opcionesServicios = [
        {
            categoria: "Mantenimiento preventivo",
            opciones: ["Cambio de aceite", "Revisión de frenos", "Inspección de neumáticos"]
        },
        {
            categoria: "Reparaciones mecánicas",
            opciones: ["Reparación de motores", "Reparación de transmisiones", "Reparación del sistema de suspensión"]
        },
        {
            categoria: "Servicios eléctricos",
            opciones: ["Diagnóstico y reparación de sistemas eléctricos", "Reemplazo de baterías", "Reparación de alternadores y arranques"]
        },
        {
            categoria: "Servicios de carrocería",
            opciones: ["Reparación de abolladuras", "Pintura de vehículos", "Reemplazo de paneles"]
        },
        {
            categoria: "Alineación y balanceo",
            opciones: ["Alineación de dirección", "Balanceo de neumáticos"]
        },
        {
            categoria: "Reparación de sistemas de escape",
            opciones: ["Sustitución de silenciadores", "Reparación de fugas en el sistema de escape"]
        },
        {
            categoria: "Diagnóstico computarizado",
            opciones: ["Uso de escáneres para diagnosticar problemas electrónicos y mecánicos"]
        },
        {
            categoria: "Reparación de sistemas de climatización",
            opciones: ["Recarga de aire acondicionado", "Reparación de calefacción y ventilación"]
        },
        {
            categoria: "Servicios de frenos",
            opciones: ["Cambio de pastillas y discos", "Revisión del líquido de frenos"]
        },
        {
            categoria: "Sustitución de piezas",
            opciones: ["Reemplazo de correas, filtros y otros componentes"]
        },
        {
            categoria: "Reparación de transmisión",
            opciones: ["Diagnóstico y reparación de cajas de cambios automáticas y manuales"]
        },
        {
            categoria: "Mantenimiento de sistemas de combustible",
            opciones: ["Limpieza de inyectores", "Reemplazo de bombas de combustible"]
        },
    ];

    useEffect(() => {
        const fetchServicios = async () => {
            const jwt = getTokenFromLocalCookie();
            if (jwt) {
                try {
                    const response = await fetcher(`${STRAPI_URL}/api/catalogo-servicios`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    });
                    setServicios(response.data || []);
                } catch (error) {
                    console.error('Error fetching services:', error);
                }
            }
        };

        fetchServicios();
    }, [STRAPI_URL]);

    const handleChange = (e) => {
        setNewServicio({ ...newServicio, [e.target.name]: e.target.value });
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
                        descripcion: newServicio.descripcion,
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
                setNewServicio({ tp_servicio: '', descripcion: '', costserv: '', ordentrabajo_catalogoservicio_id: '' });
                setIsAdding(false);
            } catch (error) {
                console.error('Error adding service:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Función para redirigir al detalle del servicio
    const handleViewServicio = (id) => {
        navigate(`/admin/detalle-servicio/${id}`);
    };

    return (
        <div className="flex h-screen">
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} />
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Servicios Disponibles</h1>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 w-full max-w-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight">Lista de Servicios</h3>
                            <Button onClick={() => setIsAdding(!isAdding)}>
                                {isAdding ? 'Cancelar' : 'Agregar Servicio'}
                            </Button>
                        </div>

                        {servicios && servicios.length === 0 ? (
                            <div className="text-center text-gray-500 mt-4">
                                <h4 className="text-xl">No hay servicios registrados.</h4>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table className="min-w-full divide-y divide-gray-200">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tipo de Servicio</TableHead>
                                            <TableHead>Descripción</TableHead>
                                            <TableHead>Costo</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {servicios.map((servicio) => (
                                            <TableRow key={servicio.id} className="hover:bg-gray-100">
                                                <TableCell>{servicio.tp_servicio || 'Sin especificar'}</TableCell>
                                                {/* Muestra solo una parte de la descripción */}
                                                <TableCell>{servicio.descripcion.slice(0, 30) + '...'}</TableCell>
                                                <TableCell>${servicio.costserv || 'N/A'}</TableCell>
                                                <TableCell className="px-6 py-4 font-medium text-right pr-4">
                                                    <ArrowRight
                                                        className="inline-block cursor-pointer"
                                                        onClick={() => handleViewServicio(servicio.id)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {isAdding && (
                            <form onSubmit={handleAddServicio} className="mt-4">

                                <div className="grid gap-4">
                                    <select
                                        name="tp_servicio"
                                        value={newServicio.tp_servicio}
                                        onChange={handleChange}
                                        required
                                        className="p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" className="text-gray-500">Seleccione un tipo de servicio</option>
                                        {opcionesServicios.map((categoria) => (
                                            <optgroup key={categoria.categoria} label={categoria.categoria} className="text-gray-700 font-semibold">
                                                {categoria.opciones.map((opcion) => (
                                                    <option key={opcion} value={opcion} className="text-gray-600 hover:bg-gray-100 p-1">
                                                        {opcion}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        name="descripcion"
                                        placeholder="Descripción"
                                        value={newServicio.descripcion}
                                        onChange={handleChange}
                                        required
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        name="costserv"
                                        placeholder="Costo"
                                        value={newServicio.costserv}
                                        onChange={handleChange}
                                        required
                                        className="p-2 border rounded"
                                    />
                                </div>
                                {!isLoading && (
                                    <Button type="submit" className="mt-4 px-4 py-2 text-white rounded">
                                        Agregar Servicio
                                    </Button>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Servicios;