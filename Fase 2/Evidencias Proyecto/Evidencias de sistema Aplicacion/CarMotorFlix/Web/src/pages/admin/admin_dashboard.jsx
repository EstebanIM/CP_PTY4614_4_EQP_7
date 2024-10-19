import { useState } from "react";
import DashboardHeader from "../../components/menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../components/menu/DashboardSidebar"; // Importar el sidebar del dashboard
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/tables/cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tables/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/tables/table";
import { ChevronRight } from "lucide-react"; // Asegúrate de tener lucide-react instalado

const DashboardAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Control del sidebar
  const [activeTab, setActiveTab] = useState("autos"); // Manejo de estado para Tabs

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Alternar sidebar
  };

  // Datos para los autos registrados
  const autos = [
    { marca: "Honda Odyssey", patente: "XY-2789", ano: "2010", ultimoServicio: "15-05-2023" },
    { marca: "Hyundai Accent", patente: "ABCD-12", ano: "2011", ultimoServicio: "25-05-2024" },
    { marca: "Nissan Skyline", patente: "IJKL-56", ano: "2000", ultimoServicio: "15-06-2024" },
  ];

  // Datos para los cuadros de resumen
  const stats = [
    { title: "Total de Autos", value: "24" },
    { title: "Cotizaciones Pendientes", value: "7" },
    { title: "Órdenes Activas", value: "12" },
    { title: "Órdenes Pendientes", value: "12" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <div className="flex-1">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Dashboard de Administrador</h1>

          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((item, index) => (
              <Card key={index} className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sección de Tabs */}
          <Tabs defaultValue="autos" className="mb-6">
            <TabsList>
              <TabsTrigger value="autos" activeTab={activeTab} setActiveTab={setActiveTab}>Autos</TabsTrigger>
              <TabsTrigger value="cotizaciones" activeTab={activeTab} setActiveTab={setActiveTab}>Cotizaciones</TabsTrigger>
              <TabsTrigger value="ordenes" activeTab={activeTab} setActiveTab={setActiveTab}>Órdenes</TabsTrigger>
            </TabsList>

            {/* Tab: Autos */}
            <TabsContent value="autos" activeTab={activeTab}>
              <Card>
                <CardHeader>
                  <CardTitle>Autos registrados en el Taller</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
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
            </TabsContent>

            {/* Tab: Cotizaciones */}
            <TabsContent value="cotizaciones" activeTab={activeTab}>
              <Card>
                <CardHeader>
                  <CardTitle>Cotizaciones Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Aquí va el contenido de cotizaciones pendientes.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Órdenes */}
            <TabsContent value="ordenes" activeTab={activeTab}>
              <Card>
                <CardHeader>
                  <CardTitle>Órdenes Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Aquí va el contenido de órdenes activas.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
