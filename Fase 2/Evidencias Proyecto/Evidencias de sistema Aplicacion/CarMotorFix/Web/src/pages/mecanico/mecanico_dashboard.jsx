import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/tables/cards";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/tables/table";
import { Button } from "../../components/ui/button";
import { ChevronRight } from "lucide-react";
import Tablas from "../../components/Tablas";
import { getTokenFromLocalCookie } from "../../lib/cookies";
import { fetcher } from "../../lib/strApi";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const DashboardAutos = () => {

  const [vehiculos, setVehiculos] = useState([]);
  const [TotalVehiculos, setTotalVehiculos] = useState(0);
  const [Cotizaciones, setCotizaciones] = useState(0);
  const [TotalCotizaciones, setTotalCotizaciones] = useState(0);

  useEffect(() => {
    const jwt = getTokenFromLocalCookie();

    const fetchOT = async () => {
      if (jwt) {
        try {
          // const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos?populate[estado_ot_id][fields][0]=nom_estado`, {
          const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos?populate=*`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });

          // const otIds = response.data || [];
          // const validOtIds = otIds.filter(v => v && v.id);
          console.log(response.data);

          // setCotizaciones(validOtIds);

          // setTotalCotizaciones(response.data.length);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    fetchOT();
  }, []);

  const handleViewVehiculo = (vehiculo) => {
    console.log('Viewing vehiculo:', vehiculo);
  };

  // Datos para las órdenes activas
  const ordenes = [
    { cliente: "Juan Escobar", servicio: "Cambio de aceite", valor: "45.000", estado: "En Progreso" },
    { cliente: "María González", servicio: "Revisión de frenos", valor: "80.000", estado: "Sin iniciar" },
  ];

  // Datos para las cotizaciones pendientes
  const cotizaciones = [
    { cliente: "Ana Martínez", servicio: "Cambio de correa de distribución", valor: "150.000", fecha: "10-07-2023" },
  ];

  // Datos para los cuadros de resumen
  const stats = [
    { title: "Total de Autos", value: TotalVehiculos },
    { title: "Órdenes Activas", value: 2 },
    { title: "Cotizaciones Pendientes", value: TotalCotizaciones },
  ];

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
      render: (vehiculo) => vehiculo.patente ? vehiculo.patente : 'Patente no disponible',
    },
    {
      header: "Año",
      key: "anio",
      render: (vehiculo) => vehiculo.anio || 'Año no disponible',
    },
  ];

  // Animation settings for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex">

      <div className="container mx-auto p-4">

        {/* Estadísticas principales con animación */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          {stats.map((item, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <div className="text-4xl font-bold text-center">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Autos Registrados */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} className="mb-6">
          <h2 className="text-xl font-bold mb-4">Autos Registrados</h2>
          <Card>
            <CardContent className="overflow-x-auto">
              <Table className="min-w-full">
                <Tablas servicio={vehiculos} handleViewTabla={handleViewVehiculo} columns={columns} />
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Órdenes Activas y Cotizaciones Pendientes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <h2 className="text-xl font-bold mb-4">Órdenes Activas</h2>
            <Card>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordenes.map((orden, index) => (
                      <TableRow key={index}>
                        <TableCell>{orden.cliente}</TableCell>
                        <TableCell>{orden.servicio}</TableCell>
                        <TableCell>{orden.valor}</TableCell>
                        <TableCell>{orden.estado}</TableCell>
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

          {/* Cotizaciones Pendientes */}
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cotizaciones Pendientes</h2>
              <Button className="text-sm font-medium border border-black text-black">
                Nueva Cotización
              </Button>
            </div>
            <Card>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cotizaciones.map((cotizacion, index) => (
                      <TableRow key={index}>
                        <TableCell>{cotizacion.cliente}</TableCell>
                        <TableCell>{cotizacion.servicio}</TableCell>
                        <TableCell>{cotizacion.valor}</TableCell>
                        <TableCell>{cotizacion.fecha}</TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default DashboardAutos;
