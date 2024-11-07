import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/tables/cards";
import { Table } from "../../components/ui/tables/table";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { fetcher } from "../../lib/strApi";
import { getTokenFromLocalCookie } from "../../lib/cookies";
import Tablas from "../../components/Tablas";
import { useNavigate } from "react-router-dom";

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
  const count = useCountUp(value, 1000);
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center"
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
  const [activeTab, setActiveTab] = useState("autos");
  const [vehiculos, setVehiculos] = useState([]);
  const [Cotizaciones, setCotizaciones] = useState([]);
  const [ordenes, setOrdenes] = useState([
    { id: "ORD-001", cliente: "Carlos Rodríguez", servicio: "Cambio de frenos", estado: "En proceso", total: "$80.000" },
    { id: "ORD-002", cliente: "Ana Martínez", servicio: "Alineación y balanceo", estado: "Pendiente", total: "$50.000" },
    { id: "ORD-003", cliente: "Jose Escobar", servicio: "Revisión de frenos", estado: "Pendiente", total: "$30.000" },
  ]);
  const [TotalVehiculos, setTotalVehiculos] = useState(0);
  const [TotalCotizaciones, setTotalCotizaciones] = useState(0);
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
          const response = await fetcher(`${STRAPI_URL}/api/vehiculos?populate[marca_id][fields][0]=nombre_marca`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });
          const validVehiculoIds = response.data.filter(v => v && v.id);
          setTotalVehiculos(response.data.length);
          setVehiculos(validVehiculoIds);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    const fetchOT = async () => {
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos?populate=*`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });
          const validOtIds = response.data.filter(v => v && v.id);
          setCotizaciones(validOtIds);
          setTotalCotizaciones(response.data.length);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    fetchOT();
    fetchVehiculos();
  }, []);

  const handleViewVehiculo = (vehiculo) => {
    navigate(`/vehiculos/detalle-vehiculo/${vehiculo.documentId}`);
  };

  // Funciones de cambio de página para cada tabla
  const handlePageChange = (setCurrentPage, totalPages, newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Cálculos de paginación para cada tabla
  const paginate = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const currentAutos = paginate(vehiculos, currentPageAutos);
  const currentCotizaciones = paginate(Cotizaciones, currentPageCotizaciones);
  const currentOrdenes = paginate(ordenes, currentPageOrdenes);

  const columns = [
    { header: "Marca", key: "marca", render: (vehiculo) => vehiculo.marca_id ? vehiculo.marca_id.nombre_marca : 'Marca desconocida' },
    { header: "Modelo", key: "modelo", render: (vehiculo) => vehiculo.modelo || 'Modelo no disponible' },
    { header: "Patente", key: "patente", render: (vehiculo) => vehiculo.patente || 'Patente no disponible' },
    { header: "Año", key: "anio", render: (vehiculo) => vehiculo.anio || 'Año no disponible' },
  ];

  const columns2 = [
    { header: "Fecha", key: "fecha", render: (cotizacion) => cotizacion.fechainicio || 'Fecha no disponible' },
    { header: "Valor", key: "valor", render: (cotizacion) => cotizacion.costo || 'Valor no disponible' },
    { header: "Estado", key: "estado", render: (cotizacion) => cotizacion.estado_ot_id ? cotizacion.estado_ot_id.nom_estado : 'Estado no disponible' },
  ];

  const columns3 = [
    { header: "ID", key: "id" },
    { header: "Cliente", key: "cliente" },
    { header: "Servicio", key: "servicio" },
    { header: "Estado", key: "estado" },
    { header: "Total", key: "total" },
  ];

  const renderPaginationControls = (currentPage, setCurrentPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div className="flex items-center space-x-2">
        <button onClick={() => handlePageChange(setCurrentPage, totalPages, currentPage - 1)} disabled={currentPage === 1} className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-xs text-gray-500">Página {currentPage} de {totalPages}</span>
        <button onClick={() => handlePageChange(setCurrentPage, totalPages, currentPage + 1)} disabled={currentPage === totalPages} className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  // Animations: Define simple fade-in/slide-in transition
  const variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <CountUpCard title="Total de Autos" value={TotalVehiculos} />
            <CountUpCard title="Cotizaciones Pendientes" value={TotalCotizaciones} />
            <CountUpCard title="Órdenes Activas" value={12} />
            <CountUpCard title="Órdenes Pendientes" value={12} />
          </div>

          <div className="mb-6">
            <div className="flex space-x-4">
              <button onClick={() => setActiveTab("autos")} className={`px-4 py-2 font-medium ${activeTab === "autos" ? "text-black border-b-2 border-black" : "text-gray-500"}`}>Autos</button>
              <button onClick={() => setActiveTab("cotizaciones")} className={`px-4 py-2 font-medium ${activeTab === "cotizaciones" ? "text-black border-b-2 border-black" : "text-gray-500"}`}>Cotizaciones</button>
              <button onClick={() => setActiveTab("ordenes")} className={`px-4 py-2 font-medium ${activeTab === "ordenes" ? "text-black border-b-2 border-black" : "text-gray-500"}`}>Órdenes</button>
            </div>

            {activeTab === "autos" && (
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants}>
                <Card>
                  <CardHeader className="flex justify-between items-center w-full px-4">
                    <div className="flex w-full items-center">
                      <CardTitle className="flex-grow">Autos registrados en el Taller</CardTitle>
                      <div className="flex items-center space-x-2">
                        {renderPaginationControls(currentPageAutos, setCurrentPageAutos, vehiculos.length)}
                      </div>
                    </div>
                  </CardHeader>


                  <CardContent className="overflow-x-auto">
                    <Table className="min-w-full">
                      <Tablas servicio={currentAutos} handleViewTabla={handleViewVehiculo} columns={columns} />
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "cotizaciones" && (
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants}>
                <Card>
                  <CardHeader className="flex justify-between items-center w-full px-4">
                    <div className="flex w-full items-center">
                      <CardTitle className="flex-grow">Historial de Cotizaciones</CardTitle>
                      <div className="flex items-center space-x-2">
                        {renderPaginationControls(currentPageCotizaciones, setCurrentPageCotizaciones, Cotizaciones.length)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table className="min-w-full">
                      <Tablas servicio={currentCotizaciones} handleViewTabla={handleViewVehiculo} columns={columns2} />
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "ordenes" && (
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants}>
                <Card>
                  <CardHeader className="flex justify-between items-center w-full px-4">
                    <div className="flex w-full items-center">
                      <CardTitle className="flex-grow">Historial de Órdenes</CardTitle>
                      <div className="flex items-center space-x-2">
                        {renderPaginationControls(currentPageOrdenes, setCurrentPageOrdenes, ordenes.length)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table className="min-w-full">
                      <Tablas servicio={currentOrdenes} handleViewTabla={handleViewVehiculo} columns={columns3} />
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

export default DashboardAdmin;
