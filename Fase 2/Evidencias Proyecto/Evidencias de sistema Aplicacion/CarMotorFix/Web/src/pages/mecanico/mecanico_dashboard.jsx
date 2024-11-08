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
  const [idMecanico, setIdMecanico] = useState(0);

  useEffect(() => {
    const jwt = getTokenFromLocalCookie();

    const fetchIDMecanico = async () => {
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/users/me?populate[mecanico][fields]=documentId`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });

          setIdMecanico(response.mecanico.documentId);

        } catch (error) {
          console.error('Error fetching IDMecanico:', error);
        }
      }
    };

    const fetchCotizaciones = async () => {
      if (jwt) {
        try {
          // const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos?populate[catalogo_servicios][fields]=tp_servicio&populate[user][fields]=username&filters[estado_ot_id][nom_estado][$eq]=cotizando&filters[mecanico_id][documentId][$eq]=${idMecanico}`, {
          const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos?populate[catalogo_servicios][fields]=tp_servicio&populate[user][fields]=username&filters[mecanico_id][documentId][$eq]=${idMecanico}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });

          console.log('Cotizaciones:', response.data);
          
          setCotizaciones(response.data);

          setTotalCotizaciones(response.data.length);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    fetchIDMecanico();
    fetchCotizaciones();
  }, [idMecanico]);

  const handleViewVehiculo = (vehiculo) => {
    console.log('Viewing vehiculo:', vehiculo);
  };

  // Datos para las órdenes activas
  const ordenes = [
    { cliente: "Juan Escobar", servicio: "Cambio de aceite", valor: "45.000", estado: "En Progreso" },
    { cliente: "María González", servicio: "Revisión de frenos", valor: "80.000", estado: "Sin iniciar" },
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

  const columns3 = [
    {
      header: "Cliente",
      key: "cliente",
      render: (Cotizaciones) => Cotizaciones.user ? Cotizaciones.user.username : 'Cliente no disponible',
    },
    {
      header: "Servicio",
      key: "servicio",
      render: (Cotizaciones) => {
        if (Cotizaciones.catalogo_servicios && Cotizaciones.catalogo_servicios.length > 0) {
          const firstService = Cotizaciones.catalogo_servicios[0].tp_servicio;
          const moreServices = Cotizaciones.catalogo_servicios.length > 1;
          return moreServices ? `${firstService} (+${Cotizaciones.catalogo_servicios.length - 1} más)` : firstService;
        }
        return 'Servicio no disponible';
      },
    },
    { 
      header: "Valor", 
      key: "valor", 
      render: (Cotizaciones) => 
        Cotizaciones.costo 
          ? new Intl.NumberFormat('es-CL').format(Cotizaciones.costo) 
          : 'Valor no disponible',
    },
    { 
      header: "Fecha", 
      key: "fecha", 
      render: (Cotizaciones) => {
        if (!Cotizaciones.fechainicio) return 'Fecha no disponible';
        
        const [year, month, day] = Cotizaciones.fechainicio.split('-');
        return `${day}-${month}-${year}`;
      }
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
                    <Tablas servicio={Cotizaciones} handleViewTabla={handleViewVehiculo} columns={columns3} />
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
