import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/tables/cards";
import { Table } from "../../components/ui/tables/table";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { fetcher } from "../../lib/strApi";
import { getTokenFromLocalCookie } from "../../lib/cookies";
import Tablas from "../../components/Tablas";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from '../../context/DarkModeContext';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

// Helper function for counting animation
const useCountUp = (targetValue, duration) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * targetValue));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [targetValue, duration]);

  return count;
};

// Component to display stats with counting animation
const CountUpCard = ({ title, value }) => {
  const { darkMode } = useContext(DarkModeContext);
  const count = useCountUp(value, 1000);
  return (
    <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`${darkMode ? 'text-white' : 'text-gray-900'} text-sm font-medium`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`text-4xl font-bold text-center ${darkMode ? 'text-gray-300' : 'text-black'}`}
        >
          {count}
        </motion.div>
      </CardContent>
    </Card>
  );
};

CountUpCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

const DashboardAdmin = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState("autos");
  const [vehiculos, setVehiculos] = useState([]);
  const [Cotizaciones, setCotizaciones] = useState([]);
  const [TotalVehiculos, setTotalVehiculos] = useState(0);
  const [TotalCotizaciones, setTotalCotizaciones] = useState(0);
  const [Ordenes, setOrdenes] = useState(0);
  const [TotalOrdenes, setTotalOrdenes] = useState(0);

  const navigate = useNavigate();

  // Estados de paginación para cada tabla
  const [currentPageAutos, setCurrentPageAutos] = useState(1);
  const [currentPageCotizaciones, setCurrentPageCotizaciones] = useState(1);
  const [currentPageOrdenes, setCurrentPageOrdenes] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const jwt = getTokenFromLocalCookie();
    const fetchVehiculos = async () => {
      if (jwt) {
        try {
          const response = await fetcher(
            `${STRAPI_URL}/api/vehiculos?filters[estado][$eq]=true&populate[user_id][fields]=username&populate[marca_id][fields]=nombre_marca`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
              },
            }
          );

          const vehiculoIds = response.data || [];
          const validVehiculoIds = vehiculoIds.filter(v => v && v.id && v.estado === true); // Asegurarse de que estado sea true

          setTotalVehiculos(validVehiculoIds.length); // Actualizar con la cantidad filtrada
          setVehiculos(validVehiculoIds);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    const fetchOTCotizaciones = async () => {
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos?populate[user][fields]=username&populate=estado_ot_id&filters[estado_ot_id][nom_estado][$eq]=Cotizando`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });
          const otIds = response.data || [];
          const validOtIds = otIds.filter(v => v && v.id);

          setCotizaciones(validOtIds);
          setTotalCotizaciones(response.data.length);
        } catch (error) {
          console.error('Error fetching cotizaciones:', error);
        }
      }
    };

    const fetchOEnproceso = async () => {
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos?populate[estado_ot_id][fields][0]=nom_estado&populate[user][fields][0]=username&populate[catalogo_servicios][fields]=tp_servicio&filters[estado_ot_id][nom_estado][$nei]=Cotizando`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });

          const otIds = response.data || [];
          const validOtIds = otIds.filter(v => v && v.id);

          setOrdenes(validOtIds);
          setTotalOrdenes(response.data.length);

        } catch (error) {
          console.error('Error fetching órdenes:', error);
        }
      }
    };

    fetchOEnproceso();
    fetchOTCotizaciones();
    fetchVehiculos();
  }, []);

  const handleViewVehiculo = (vehiculo) => {
    navigate(`/vehiculos/detalle-vehiculo/${vehiculo.documentId}`);
  };

  const handleViewCotizacion = (cotizacion) => {
    navigate(`/detalle_ot/${cotizacion.documentId}`);
  };

  // Funciones de cambio de página para cada tabla
  const handlePageChange = (setCurrentPage, totalPages, newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Cálculos de paginación para cada tabla
  const paginate = (data, currentPage) => {
    if (!Array.isArray(data)) {
      return [];
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const currentAutos = paginate(vehiculos, currentPageAutos);
  const currentCotizaciones = paginate(Cotizaciones, currentPageCotizaciones);
  const currentOrdenes = paginate(Ordenes, currentPageOrdenes);

  const columns = [
    {
      header: "Cliente",
      key: "cliente",
      render: (vehiculo) => vehiculo.user_id ? vehiculo.user_id.username : 'Cliente desconocida'
    },
    {
      header: "Marca",
      key: "marca",
      render: (vehiculo) => vehiculo.marca_id ? vehiculo.marca_id.nombre_marca : 'Marca desconocida'
    },
    {
      header: "Modelo",
      key: "modelo",
      render: (vehiculo) => vehiculo.modelo || 'Modelo no disponible'
    },
    {
      header: "Patente",
      key: "patente",
      render: (vehiculo) => vehiculo.patente || 'Patente no disponible'
    },
    {
      header: "Año",
      key: "anio",
      render: (vehiculo) => vehiculo.anio || 'Año no disponible'
    },
  ];

  const columns2 = [
    {
      header: "Cliente",
      key: "cliente",
      render: (cotizacion) => cotizacion.user?.username || 'Cliente no disponible'
    },
    {
      header: "Fecha",
      key: "fecha",
      render: (cotizacion) => {
        if (!cotizacion.fechainicio) return 'Fecha no disponible';

        const [year, month, day] = cotizacion.fechainicio.split('-');
        return `${day}-${month}-${year}`;
      }
    },
    {
      header: "Valor",
      key: "valor",
      render: (cotizacion) =>
        cotizacion.costo
          ? new Intl.NumberFormat('es-CL').format(cotizacion.costo)
          : 'Total no disponible',
    },
    {
      header: "Estado",
      key: "estado",
      render: (cotizacion) => cotizacion.estado_ot_id ? cotizacion.estado_ot_id.nom_estado : 'Estado no disponible'
    },
  ];

  const columns3 = [
    {
      header: "ID",
      key: "id",
      render: (Ordenes) => Ordenes?.id ? Ordenes?.id : 'ID no disponible',
    },
    {
      header: "Cliente",
      key: "cliente",
      render: (Ordenes) => Ordenes?.user ? Ordenes.user?.username : 'Cliente no disponible',
    },
    {
      header: "Servicio",
      key: "servicio",
      render: (Ordenes) => {
        if (Ordenes.catalogo_servicios && Ordenes.catalogo_servicios.length > 0) {
          const firstService = Ordenes.catalogo_servicios[0].tp_servicio;
          const moreServices = Ordenes.catalogo_servicios.length > 1;
          return moreServices ? `${firstService} (+${Ordenes.catalogo_servicios.length - 1} más)` : firstService;
        }
        return 'Servicio no disponible';
      },
    },
    {
      header: "Estado",
      key: "estado",
      render: (Ordenes) => Ordenes.estado_ot_id ? Ordenes.estado_ot_id.nom_estado : 'Estado no disponible',
    },
    {
      header: "Total",
      key: "total",
      render: (Ordenes) =>
        Ordenes.costo
          ? new Intl.NumberFormat('es-CL').format(Ordenes.costo)
          : 'Total no disponible',
    }

  ];

  const renderPaginationControls = (currentPage, setCurrentPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(setCurrentPage, totalPages, currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-1 hover:text-gray-700 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => handlePageChange(setCurrentPage, totalPages, currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-1 hover:text-gray-700 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  const variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className={`flex flex-col md:flex-row ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex-1">
        <div className="container mx-auto p-4">

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <CountUpCard title="Total de Autos" value={TotalVehiculos} />
            <CountUpCard title="Cotizaciones Pendientes" value={TotalCotizaciones} />
            <CountUpCard title="Órdenes Activas" value={TotalOrdenes} />
            <CountUpCard title="Órdenes Pendientes" value={12} />
          </div>

          <div className="mb-6">
            {/* Botones de navegación por pestañas */}
            <div className="flex flex-wrap space-x-4 mb-4 overflow-auto">
              <button
                onClick={() => setActiveTab("autos")}
                className={`px-4 py-2 font-medium ${activeTab === "autos"
                  ? `${darkMode ? 'text-white border-b-2 border-white' : 'text-black border-b-2 border-black'}`
                  : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                  }`}
              >
                Autos
              </button>
              <button
                onClick={() => setActiveTab("cotizaciones")}
                className={`px-4 py-2 font-medium ${activeTab === "cotizaciones"
                  ? `${darkMode ? 'text-white border-b-2 border-white' : 'text-black border-b-2 border-black'}`
                  : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                  }`}
              >
                Cotizaciones
              </button>
              <button
                onClick={() => setActiveTab("ordenes")}
                className={`px-4 py-2 font-medium ${activeTab === "ordenes"
                  ? `${darkMode ? 'text-white border-b-2 border-white' : 'text-black border-b-2 border-black'}`
                  : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                  }`}
              >
                Órdenes
              </button>
            </div>

            {/* Sección de Autos */}
            {activeTab === "autos" && (
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants}>
                <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <CardHeader className="flex justify-between items-center w-full px-4">
                    <div className="flex w-full items-center">
                      <CardTitle className={`${darkMode ? 'text-white' : 'text-gray-900'} flex-grow`}>Autos registrados en el Taller</CardTitle>
                      <div className="flex items-center space-x-2">
                        {renderPaginationControls(currentPageAutos, setCurrentPageAutos, vehiculos.length)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="overflow-x-auto">
                    <Table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} table-fixed`}>
                      {currentAutos.length === 0 ? (
                        <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No hay autos registrados</div>
                      ) : (
                        <Tablas servicio={currentAutos} handleViewTabla={handleViewVehiculo} columns={columns} />
                      )}
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Sección de Cotizaciones */}
            {activeTab === "cotizaciones" && (
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants}>
                <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <CardHeader className="flex justify-between items-center w-full px-4">
                    <div className="flex w-full items-center">
                      <CardTitle className={`${darkMode ? 'text-white' : 'text-gray-900'} flex-grow`}>Historial de Cotizaciones</CardTitle>
                      <div className="flex items-center space-x-2">
                        {renderPaginationControls(currentPageCotizaciones, setCurrentPageCotizaciones, Cotizaciones.length)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} table-fixed`}>
                      {
                        currentCotizaciones.length === 0 ? (
                          <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No hay cotizaciones registradas</div>
                        ) : (
                          <Tablas servicio={currentCotizaciones} handleViewTabla={handleViewCotizacion} columns={columns2} />
                        )
                      }
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Sección de Órdenes */}
            {activeTab === "ordenes" && (
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants}>
                <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <CardHeader className="flex justify-between items-center w-full px-4">
                    <div className="flex w-full items-center">
                      <CardTitle className={`${darkMode ? 'text-white' : 'text-gray-900'} flex-grow`}>Historial de Órdenes</CardTitle>
                      <div className="flex items-center space-x-2">
                        {renderPaginationControls(currentPageOrdenes, setCurrentPageOrdenes, Ordenes.length)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} table-fixed`}>
                      {/* No se ve no hay cotizaciones */}
                      {currentOrdenes.length === 0 ? (
                        <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No hay órdenes registradas</div>
                      ) : (
                        <Tablas servicio={currentOrdenes} handleViewTabla={handleViewCotizacion} columns={columns3} />
                      )}
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardAdmin.propTypes = {
};

export default DashboardAdmin;