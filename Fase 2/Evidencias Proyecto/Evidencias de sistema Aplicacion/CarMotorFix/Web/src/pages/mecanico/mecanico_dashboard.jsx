import { motion } from "framer-motion"; // For animations
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/tables/cards";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/tables/table";
import { Button } from "../../components/ui/button"; // Imported Button component
import { ChevronRight } from "lucide-react"; // Icon library

const DashboardAutos = () => {

  // Datos para los autos registrados
  const autos = [
    { marca: "Honda Odyssey", patente: "XY-2789", ano: "2010", ultimoServicio: "15-05-2023" },
    { marca: "Hyundai Accent", patente: "ABCD-12", ano: "2011", ultimoServicio: "25-05-2024" },
    { marca: "Nissan Skyline", patente: "IJKL-56", ano: "2000", ultimoServicio: "15-06-2024" },
  ];

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
    { title: "Total de Autos", value: 3 },
    { title: "Órdenes Activas", value: 2 },
    { title: "Cotizaciones Pendientes", value: 1 },
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
                  <TableHeader>
                    <TableRow>
                      <TableHead>Marca - Modelo</TableHead>
                      <TableHead>Patente</TableHead>
                      <TableHead>Año</TableHead>
                      <TableHead>Último Servicio</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {autos.map((car, index) => (
                      <TableRow key={index}>
                        <TableCell>{car.marca}</TableCell>
                        <TableCell>{car.patente}</TableCell>
                        <TableCell>{car.ano}</TableCell>
                        <TableCell>{car.ultimoServicio}</TableCell>
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
