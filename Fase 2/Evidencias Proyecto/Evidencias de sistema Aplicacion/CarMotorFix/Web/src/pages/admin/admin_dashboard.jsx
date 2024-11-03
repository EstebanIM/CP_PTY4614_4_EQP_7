import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import PropTypes from "prop-types"; // Import PropTypes for type-checking
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/tables/cards";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/tables/table";
import { ChevronRight } from "lucide-react"; // Asegúrate de tener lucide-react instalado
import { fetcher } from "../../lib/strApi";
import { getTokenFromLocalCookie } from "../../lib/cookies";
import VehiculosTabla from "../../components/VehiculosTabla";
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
  const count = useCountUp(value, 1000); // Count up animation over 1 second
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

// Define prop types for CountUpCard
CountUpCard.propTypes = {
  title: PropTypes.string.isRequired, // Title should be a string and is required
  value: PropTypes.number.isRequired, // Value should be a number and is required
};

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState("autos"); // Manejo de estado para Tabs
  const [vehiculos, setVehiculos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = getTokenFromLocalCookie();
    const fetchVehiculos = async () => {
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/vehiculos`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });

          const vehiculoIds = response.vehiculo_ids || [];
          const validVehiculoIds = vehiculoIds.filter(v => v && v.id);

          setVehiculos(validVehiculoIds);
          console.log(jwt)
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    fetchVehiculos();
  }, []);

  const handleViewVehiculo = (vehiculo) => {
    navigate(`/vehiculos/detalle-vehiculo/${vehiculo.documentId}`);
  };

  const formatPatente = (patente) => {
    const letras = patente.substring(0, 4);
    const numeros = patente.substring(4);

    if (letras.length === 4 && numeros.length === 2) {
      return `${letras}-${numeros}`;
    } else if (letras.length === 2 && numeros.length === 4) {
      return `${letras}-${numeros}`;
    } else {
      return patente;
    }
  };

  const columns = [
    {
      header: "Marca",
      key: "marca",
      render: (vehiculo) => vehiculo.marca_id ? vehiculo.marca_id.nombre_marca : 'Marca desconocida',
    },
    {
      header: "Modelo",
      key: "modelo",
      render: (vehiculo) => vehiculo.modelo || 'Modelo no disponible',
    },
    {
      header: "Patente",
      key: "patente",
      render: (vehiculo) => vehiculo.patente ? formatPatente(vehiculo.patente) : 'Patente no disponible',
    },
    {
      header: "Año",
      key: "anio",
      render: (vehiculo) => vehiculo.anio || 'Año no disponible',
    },
  ];


  // Datos para las cotizaciones pendientes
  const cotizaciones = [
    { marca: "Honda Odyssey", cliente: "Pablo Escobar", fecha: "09/05/2024", valor: "$120.000", estado: "Aceptada" },
    { marca: "Hyundai Accent", cliente: "Ivan Sanhueza", fecha: "23/04/2024", valor: "$89.990", estado: "Pendiente" },
    { marca: "Nissan Skyline", cliente: "Bastian Paz", fecha: "02/05/2024", valor: "$69.990", estado: "Aceptada" },
  ];

  // Datos para las órdenes activas
  const ordenes = [
    { id: "ORD-001", cliente: "Carlos Rodríguez", servicio: "Cambio de frenos", estado: "En proceso", total: "$80.000" },
    { id: "ORD-002", cliente: "Ana Martínez", servicio: "Alineación y balanceo", estado: "Pendiente", total: "$50.000" },
    { id: "ORD-003", cliente: "Jose Escobar", servicio: "Revisión de frenos", estado: "Pendiente", total: "$30.000" },
  ];

  // Datos para los cuadros de resumen
  const stats = [
    { title: "Total de Autos", value: 24 },
    { title: "Cotizaciones Pendientes", value: 7 },
    { title: "Órdenes Activas", value: 12 },
    { title: "Órdenes Pendientes", value: 12 },
  ];

  // Animations: Define simple fade-in/slide-in transition
  const variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex">

      {/* Contenido principal */}
      <div className="flex-1">

        <div className="container mx-auto p-4">

          {/* Estadísticas principales con animación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((item, index) => (
              <CountUpCard key={index} title={item.title} value={item.value} />
            ))}
          </div>

          {/* Sección de Tabs */}
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("autos")}
                className={`px-4 py-2 font-medium ${activeTab === "autos" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
              >
                Autos
              </button>
              <button
                onClick={() => setActiveTab("cotizaciones")}
                className={`px-4 py-2 font-medium ${activeTab === "cotizaciones" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
              >
                Cotizaciones
              </button>
              <button
                onClick={() => setActiveTab("ordenes")}
                className={`px-4 py-2 font-medium ${activeTab === "ordenes" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
              >
                Órdenes
              </button>
            </div>

            {/* Content for each Tab */}
            {activeTab === "autos" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={variants} // Apply animation
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Autos registrados en el Taller</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Marca - Modelo</TableHead>
                          <TableHead>Patente</TableHead>
                          <TableHead>Año</TableHead>
                          <TableHead>Último Servicio</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                        <VehiculosTabla vehiculos={vehiculos} handleViewVehiculo={handleViewVehiculo} columns={columns} />
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "cotizaciones" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={variants} // Apply animation
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Cotizaciones</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Marca - Modelo</TableHead>
                          <TableHead>Nombre cliente</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cotizaciones.map((quote, index) => (
                          <TableRow key={index}>
                            <TableCell>{quote.marca}</TableCell>
                            <TableCell>{quote.cliente}</TableCell>
                            <TableCell>{quote.fecha}</TableCell>
                            <TableCell>{quote.valor}</TableCell>
                            <TableCell>{quote.estado}</TableCell>
                            <TableCell>
                              <button className="flex items-center text-sm">
                                Ver
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "ordenes" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={variants} // Apply animation
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Órdenes</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordenes.map((order, index) => (
                          <TableRow key={index}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.cliente}</TableCell>
                            <TableCell>{order.servicio}</TableCell>
                            <TableCell>{order.estado}</TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell>
                              <button className="flex items-center text-sm">
                                Ver
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
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
