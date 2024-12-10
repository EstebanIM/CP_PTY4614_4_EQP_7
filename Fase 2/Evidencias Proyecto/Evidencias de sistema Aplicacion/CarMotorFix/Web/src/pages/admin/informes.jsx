import { useState, useEffect, useContext } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DarkModeContext } from '../../context/DarkModeContext';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import { fetcher } from '../../lib/strApi';
import LoadingComponent from '../../components/animation/loading';
import DashboardSidebar from '../../components/menu/DashboardSidebar';
import DashboardHeader from '../../components/menu/DashboardHeader';
import { Button } from '../../components/ui/button';
import Tablas from '../../components/Tablas';
import { toast } from 'react-toastify';

const Informes = () => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loadingUserRole, setLoadingUserRole] = useState(true);
    const [mecanicos, setMecanicos] = useState([]);
    const [loadingMecanicos, setLoadingMecanicos] = useState(true);
    const [selectedMecanico, setSelectedMecanico] = useState(null);
    const [selectedMes, setSelectedMes] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });

    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            const jwt = getTokenFromLocalCookie();
            if (jwt) {
                try {
                    const [userResponse, mecanicosResponse] = await Promise.all([
                        fetcher(`${STRAPI_URL}/api/users/me?populate[role]=*`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${jwt}`,
                            },
                        }),
                        fetcher(`${STRAPI_URL}/api/mecanicos?populate=*`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${jwt}`,
                            },
                        }),
                    ]);
                    setUserRole(userResponse.role.name);
                    setMecanicos(mecanicosResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoadingUserRole(false);
                    setLoadingMecanicos(false);
                }
            }
        };
        fetchData();
    }, [STRAPI_URL]);


    // Función para generar informe de órdenes por mes
    const generarInformePorMes = (ordenes) => {
        console.log('Datos de órdenes recibidos:', ordenes);
        
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Informe de Órdenes de Trabajo - ${selectedMes}`, 14, 22);

        if (ordenes.length === 0) {
            doc.setFontSize(12);
            doc.text('No hubo órdenes de trabajo para este mes.', 14, 32);
        } else {
            doc.setFontSize(12);
            doc.text(`Total de Órdenes: ${ordenes.length}`, 14, 32);

            const tableColumn = ['ID', 'Estado', 'Fecha Inicio', 'Fecha Recepción', 'Fecha Entrega', 'Total Servicios', 'Costo'];
            const tableRows = [];

            ordenes.forEach((orden) => {
                // Obtener el estado de la OT
                const estadoOT = orden.estado_ot_id?.nom_estado || 'No disponible';
                
                // Obtener el total de servicios
                const totalServicios = orden.catalogo_servicios?.length || 0;

                const ordenData = [
                    orden.id,
                    estadoOT,
                    orden.fechainicio || 'No disponible',
                    orden.fecharecepcion || 'No disponible',
                    orden.fechaentrega || 'No disponible',
                    totalServicios,
                    orden.costo ? `$${orden.costo}` : 'No disponible',
                ];
                tableRows.push(ordenData);
            });

            doc.autoTable({ head: [tableColumn], body: tableRows, startY: 40 });
        }

        doc.save(`informe_ordenes_${selectedMes}.pdf`);
    };
    const generarInformePorMecanico = (ordenes, mecanico) => {
        if (!mecanico) {
            console.error('No hay mecánico seleccionado');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Informe de Órdenes de ${mecanico.prim_nom} ${mecanico.prim_apell}`, 14, 22);

        // Filtrar las órdenes excluyendo "Cotizando" y "Rechazado"
        const ordenesFiltradas = ordenes.filter(orden => 
            orden.estado_ot_id?.nom_estado !== "Cotizando" && 
            orden.estado_ot_id?.nom_estado !== "Rechazado"
        );

        doc.setFontSize(12);
        doc.text(`Total de Órdenes Realizadas: ${ordenesFiltradas.length}`, 14, 32);

        if (ordenesFiltradas.length === 0) {
            doc.setFontSize(12);
            doc.text('No hay órdenes de trabajo para este mecánico.', 14, 42);
        } else {
            const tableColumn = ['ID', 'Estado', 'Fecha Inicio', 'Fecha Recepción', 'Fecha Entrega', 'Total Servicios', 'Costo'];
            const tableRows = [];

            ordenesFiltradas.forEach((orden) => {
                const estadoOT = orden.estado_ot_id?.nom_estado || 'No disponible';
                const totalServicios = orden.catalogo_servicios?.length || 0;

                const ordenData = [
                    orden.id,
                    estadoOT,
                    orden.fechainicio || 'No disponible',
                    orden.fecharecepcion || 'No disponible',
                    orden.fechaentrega || 'No disponible',
                    totalServicios,
                    orden.costo ? `$${orden.costo}` : 'No disponible',
                ];
                tableRows.push(ordenData);
            });

            doc.autoTable({ head: [tableColumn], body: tableRows, startY: 40 });
        }
        doc.save(`informe_mecanico_${mecanico.prim_nom}.pdf`);
    };

    // Función para generar informe de incidencias por mes
    const generarInformeIncidencias = (ordenes) => {
        console.log('Datos de órdenes recibidos:', ordenes);
        
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Informe de Incidencias - ${selectedMes}`, 14, 22);

        // Filtrar solo las órdenes rechazadas
        const ordenesRechazadas = ordenes.filter(orden => 
            orden.estado_ot_id?.nom_estado === "Rechazado"
        );

        if (ordenesRechazadas.length === 0) {
            doc.setFontSize(12);
            doc.text('No hubo órdenes rechazadas en este mes.', 14, 32);
        } else {
            doc.setFontSize(12);
            doc.text(`Total de Incidencias: ${ordenesRechazadas.length}`, 14, 32);

            const tableColumn = ['ID', 'Estado', 'Fecha Inicio', 'Fecha Recepción', 'Fecha Entrega', 'Total Servicios', 'Costo'];
            const tableRows = [];

            ordenesRechazadas.forEach((orden) => {
                const estadoOT = orden.estado_ot_id?.nom_estado || 'No disponible';
                const totalServicios = orden.catalogo_servicios?.length || 0;

                const ordenData = [
                    orden.id,
                    estadoOT,
                    orden.fechainicio || 'No disponible',
                    orden.fecharecepcion || 'No disponible',
                    orden.fechaentrega || 'No disponible',
                    totalServicios,
                    orden.costo ? `$${orden.costo}` : 'No disponible',
                ];
                tableRows.push(ordenData);
            });

            doc.autoTable({ head: [tableColumn], body: tableRows, startY: 40 });
        }

        doc.save(`informe_incidencias_${selectedMes}.pdf`);
    };

    // Función para obtener órdenes y generar informe de incidencias
    const fetchAndGenerateInformeIncidencias = async () => {
        const jwt = getTokenFromLocalCookie();
        if (jwt && selectedMes) {
            try {
                const [year, month] = selectedMes.split('-');
                const fechaInicio = `${year}-${month}-01`;
                const fechaFin = new Date(year, month, 0).toISOString().split('T')[0];

                const response = await fetcher(
                    `${STRAPI_URL}/api/orden-trabajos?filters[fechainicio][$gte]=${fechaInicio}&filters[fechainicio][$lte]=${fechaFin}&populate=estado_ot_id&populate=catalogo_servicios`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                const ordenes = response?.data || [];
                generarInformeIncidencias(ordenes);
                toast.success('Informe de incidencias generado correctamente.');
            } catch (error) {
                console.error('Error fetching ordenes por mes:', error);
                toast.error('Error al generar el informe de incidencias.');
            }
        } else {
            toast.error('Por favor, selecciona un mes.');
        }
    };

    // Obtener órdenes por mes y generar informe
    const fetchAndGenerateInformePorMes = async () => {
        const jwt = getTokenFromLocalCookie();
        if (jwt && selectedMes) {
            try {
                const [year, month] = selectedMes.split('-');
                const fechaInicio = `${year}-${month}-01`;
                const fechaFin = new Date(year, month, 0).toISOString().split('T')[0]; // Último día del mes

                const response = await fetcher(
                    `${STRAPI_URL}/api/orden-trabajos?filters[fechainicio][$gte]=${fechaInicio}&filters[fechainicio][$lte]=${fechaFin}&populate=estado_ot_id&populate=catalogo_servicios`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                const ordenes = response?.data || [];
                generarInformePorMes(ordenes);
                toast.success('Informe generado correctamente.');
            } catch (error) {
                console.error('Error fetching ordenes por mes:', error);
            }
        } else {
            alert('Por favor, selecciona un mes.');
        }
    };

    // Obtener órdenes por mecánico y generar informe
    const fetchAndGenerateInformePorMecanico = async (mecanico) => {
        if (!mecanico) {
            toast.error('Por favor, selecciona un mecánico válido.');
            return;
        }

        const mecanicoSeleccionado = mecanico;
        const jwt = getTokenFromLocalCookie();

        if (jwt) {
            try {
                const response = await fetcher(
                    `${STRAPI_URL}/api/orden-trabajos?filters[mecanico_id][id][$eq]=${mecanico.id}&populate=estado_ot_id&populate=catalogo_servicios`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    });
                const ordenes = response?.data || [];
                generarInformePorMecanico(ordenes, mecanicoSeleccionado);
                toast.success('Informe generado correctamente.');
            } catch (error) {
                console.error('Error fetching ordenes del mecánico:', error);
                toast.error('Error al generar el informe.');
            }
        } else {
            toast.error('Por favor, selecciona un mecánico válido.');
        }
    };

    const columnsMecanicos = [
        {
            header: 'Nombre',
            key: 'nombre',
            render: (item) => `${item.prim_nom} ${item.prim_apell}`,
        },
        {
            header: 'Email',
            key: 'email',
            render: (item) => item.correo,
        },
        {
            header: 'RUN',
            key: 'run',
            render: (item) => formatearRun(item.run),
        },
    ];

    const formatearRun = (run) => {
        if (!run) return '';
        const runStr = String(run);
        const runSinGuion = runStr.replace('-', '');
        const dv = runStr.slice(-1);
        const cuerpo = runSinGuion.slice(0, -1);
        let formato = '';
        if (cuerpo.length === 7 || cuerpo.length === 8) {
            formato = cuerpo.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv;
        } else {
            formato = runStr;
        }
        return formato;
    };

    if (loadingUserRole || loadingMecanicos) {
        return <LoadingComponent />;
    }

    if (userRole !== 'Admin') {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
                <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
                <p className="text-xl text-gray-700 mb-8">Oops! La página que buscas no existe.</p>
                <button
                    onClick={() => (window.location.href = '/inicio')}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <DashboardSidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                userRole={userRole}
                darkMode={darkMode}
            />
            <div className="flex-1 flex flex-col">
                <DashboardHeader toggleSidebar={toggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <div className={`p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mx-6 my-6`}>
                    <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                        Generar Informes
                    </h1>

                    {/* Informe por Mes */}
                    <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg shadow-md mb-6`}>
                        <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                            Informe de Órdenes por Mes
                        </h2>
                        <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Seleccionar Mes:</label>
                        <input
                            type="month"
                            value={selectedMes}
                            onChange={(e) => setSelectedMes(e.target.value)}
                            className={`w-1/4 px-4 py-2 border rounded-lg focus:outline-none ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        />
                        <div className="flex space-x-4 mt-4">
                            <Button
                                onClick={fetchAndGenerateInformePorMes}
                                className={`py-2 px-4 rounded-lg ${
                                    darkMode ? 'bg-blue-600 hover:bg-gray-900' : 'bg-blue-500 hover:bg-blue-500'
                                } text-white font-semibold`}
                            >
                                Generar Informe General
                            </Button>
                            <Button
                                onClick={fetchAndGenerateInformeIncidencias}
                                className={`py-2 px-4 rounded-lg ${
                                    darkMode ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-400'
                                } text-white font-semibold`}
                            >
                                Generar Informe de Incidencias
                            </Button>
                        </div>
                    </div>

                    {/* Informe por Mecánico */}
                    <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg shadow-md`}>
                        <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                            Informe por Mecánico
                        </h2>
                        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Selecciona un mecánico para generar el informe de órdenes de trabajo que ha realizado.
                        </p>
                        <Tablas
                            servicio={mecanicos}
                            columns={columnsMecanicos}
                            handleViewTabla={fetchAndGenerateInformePorMecanico}
                            loading={loadingMecanicos}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Informes;