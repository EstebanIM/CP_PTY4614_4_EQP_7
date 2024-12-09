import React, { useState, useEffect, useContext } from 'react';
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

const Informes = () => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loadingUserRole, setLoadingUserRole] = useState(true);
    const [mecanicos, setMecanicos] = useState([]);
    const [loadingMecanicos, setLoadingMecanicos] = useState(true);
    const [selectedMes, setSelectedMes] = useState('');
    const [selectedMecanico, setSelectedMecanico] = useState(null);

    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Obtener el rol del usuario
    useEffect(() => {
        const fetchUserRole = async () => {
            const jwt = getTokenFromLocalCookie();
            if (jwt) {
                try {
                    const response = await fetcher(`${STRAPI_URL}/api/users/me?populate[role]=*`, {
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

    // Obtener la lista de mecánicos
    useEffect(() => {
        const fetchMecanicos = async () => {
            const jwt = getTokenFromLocalCookie();
            if (jwt) {
                try {
                    const response = await fetcher(`${STRAPI_URL}/api/mecanicos?populate[taller_id]=*&populate[vehiculos]=*&populate[user]=*&populate[notas]=*&populate[orden_trabajos_id]=*`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    });
                    setMecanicos(response.data);
                } catch (error) {
                    console.error('Error fetching mecanicos:', error);
                } finally {
                    setLoadingMecanicos(false);
                }
            }
        };
        fetchMecanicos();
    }, [STRAPI_URL]);

    // Función para generar informe de órdenes por mes
    const generarInformePorMes = (ordenes) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Informe de Órdenes de Trabajo - ${selectedMes}`, 14, 22);

        if (ordenes.length === 0) {
            doc.setFontSize(12);
            doc.text('No hubo órdenes de trabajo para este mes.', 14, 32);
        } else {
            doc.setFontSize(12);
            doc.text(`Total de Órdenes: ${ordenes.length}`, 14, 32);

            const tableColumn = ['ID', 'Descripción', 'Fecha Inicio', 'Fecha Recepción', 'Fecha Entrega', 'Fecha Salida', 'Costo'];
            const tableRows = [];

            ordenes.forEach((orden) => {
                const ordenData = [
                    orden.id,
                    orden.attributes.descripcion || 'No disponible',
                    orden.attributes.fechainicio || 'No disponible',
                    orden.attributes.fecharecepcion || 'No disponible',
                    orden.attributes.fechaentrega || 'No disponible',
                    orden.attributes.fechasalida || 'No disponible',
                    orden.attributes.costo ? `$${orden.attributes.costo}` : 'No disponible',
                ];
                tableRows.push(ordenData);
            });

            doc.autoTable({ head: [tableColumn], body: tableRows, startY: 40 });
        }

        doc.save(`informe_ordenes_${selectedMes}.pdf`);
    };

    // Función para generar informe por mecánico
    const generarInformePorMecanico = (ordenes) => {
        const doc = new jsPDF();
        const nombreMecanico = selectedMecanico.prim_nom || 'Desconocido';
        const apellidoMecanico = selectedMecanico.prim_apell || '';
        doc.setFontSize(18);
        doc.text(`Informe de Órdenes de ${nombreMecanico} ${apellidoMecanico}`, 14, 22);
        doc.setFontSize(12);
        doc.text(`Total de Órdenes Realizadas: ${ordenes.length}`, 14, 32);
        if (ordenes.length === 0) {
            doc.setFontSize(12);
        } else {
            const tableColumn = ['ID', 'Descripción', 'Fecha Inicio', 'Fecha Recepción', 'Fecha Entrega', 'Fecha Salida', 'Costo'];
            const tableRows = [];

            ordenes.forEach((orden) => {
                const ordenData = [
                    orden.id,
                    orden.attributes.descripcion || 'No disponible',
                    orden.attributes.fechainicio || 'No disponible',
                    orden.attributes.fecharecepcion || 'No disponible',
                    orden.attributes.fechaentrega || 'No disponible',
                    orden.attributes.fechasalida || 'No disponible',
                    orden.attributes.costo ? `$${orden.attributes.costo}` : 'No disponible',
                ];
                tableRows.push(ordenData);
            });

            doc.autoTable({ head: [tableColumn], body: tableRows, startY: 40 });
        }
        doc.save(`informe_mecanico_${selectedMecanico.prim_nom}.pdf`);
    };

    // Obtener órdenes por mes y generar informe
    const fetchAndGenerateInformePorMes = async () => {
        const jwt = getTokenFromLocalCookie();
        if (jwt && selectedMes) {
            try {
                const response = await fetcher(
                    `${STRAPI_URL}/api/orden-trabajos?filters[fechainicio][$containsi]=${selectedMes}&populate=*`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                const ordenes = response?.data || [];
                generarInformePorMes(ordenes);
            } catch (error) {
                console.error('Error fetching ordenes por mes:', error);
                alert('Ocurrió un error al generar el informe.');
            }
        } else {
            alert('Por favor, selecciona un mes.');
        }
    };

    // Obtener órdenes por mecánico y generar informe
    const fetchAndGenerateInformePorMecanico = async (mecanico) => {
        setSelectedMecanico(mecanico);
        const jwt = getTokenFromLocalCookie();
        if (jwt && mecanico) {
            try {
                const response = await fetcher(
                    `${STRAPI_URL}/api/orden-trabajos?filters[mecanicos_permissions_users][id][$eq]=${mecanico.id}&populate=*`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    });
                const ordenes = response?.data || [];
                generarInformePorMecanico(ordenes);
            } catch (error) {
                console.error('Error fetching ordenes del mecánico:', error);
                alert('Ocurrió un error al generar el informe.');
            }
        } else {
            alert('Por favor, selecciona un mecánico válido.');
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
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        />
                        <Button
                            onClick={fetchAndGenerateInformePorMes}
                            className={`mt-4 py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-400'
                                } text-white font-semibold`}
                        >
                            Generar Informe
                        </Button>
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