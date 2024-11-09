import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/tables/cards";
import { Table } from "../../components/ui/tables/table";
import { Button } from "../../components/ui/button";
import Tablas from "../../components/Tablas";
import { getTokenFromLocalCookie } from "../../lib/cookies";
import { fetcher } from "../../lib/strApi";
import { useNavigate } from "react-router-dom";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const DashboardAutos = () => {
  const navigate = useNavigate();

  const [vehiculos, setVehiculos] = useState([]);
  const [TotalVehiculos, setTotalVehiculos] = useState(0);
  const [Cotizaciones, setCotizaciones] = useState([]);
  const [TotalCotizaciones, setTotalCotizaciones] = useState(0);
  const [idMecanico, setIdMecanico] = useState(0);
  const [ordenes, setOrdenes] = useState([]);
  const [TotalOrdenes, setTotalOrdenes] = useState(0);

  useEffect(() => {
    const jwt = getTokenFromLocalCookie();

    const fetchIDMecanico = async () => {
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
    };

    const fetchOT = async () => {
        try {
            const response = await fetcher(  `${STRAPI_URL}/api/orden-trabajos?populate[catalogo_servicios][fields]=tp_servicio&populate[user][fields]=username&populate[estado_ot_id][fields]=nom_estado&populate[vehiculo][populate][marca_id][fields]=nombre_marca&filters[mecanico_id][documentId][$eq]=${idMecanico}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });
          
          const OT = response.data.map((OT) => {
            return {
              ...OT,
              user: OT.user.username,
              estado_ot_id: OT.estado_ot_id.nom_estado,
              catalogo_servicios: OT.catalogo_servicios.map(servicio => servicio.tp_servicio),
              costo: OT.costo,
              fechainicio: OT.fechainicio,
              vehiculo: {
                anio: OT.vehiculo.anio,
                documentId: OT.vehiculo.documentId,
                modelo: OT.vehiculo.modelo,
                motor: OT.vehiculo.motor,
                patente: OT.vehiculo.patente,
                marca_id: OT.vehiculo.marca_id.nombre_marca,
              }
            };
          });

        const vehiculosUnicos = response.data.reduce((acc, OT) => {
          const documentId = OT.vehiculo.documentId;
        
          if (!acc.has(documentId)) {
            acc.add(documentId);
          }
        
          return acc;
        }, new Set());

        setVehiculos(OT.map(item => item.vehiculo));
        
        setTotalVehiculos(vehiculosUnicos.size);
        
        const Cotizacion = OT.filter(cotizacion => cotizacion.estado_ot_id === 'cotizando');
        const Ordenes = OT.filter(Ordenes => Ordenes.estado_ot_id !== 'cotizando');

        setOrdenes(Ordenes);
        setTotalOrdenes(Ordenes.length);

        setCotizaciones(Cotizacion);
        setTotalCotizaciones(Cotizacion.length);

          
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
    };

    fetchIDMecanico();
    fetchOT();
  }, [idMecanico]);

  const handleViewVehiculo = (vehiculo) => {
    navigate(`/vehiculos/detalle-vehiculo/${vehiculo.documentId}`);
  };

  // Datos para los cuadros de resumen
  const stats = [
    { title: "Total de Autos", value: TotalVehiculos },
    { title: "Órdenes Activas", value: TotalOrdenes },
    { title: "Cotizaciones Pendientes", value: TotalCotizaciones },
  ];

  const columns = [
    {
      header: "Marca",
      key: "marca",
      render: (vehiculo) => vehiculo.marca_id || 'Marca desconocida',
    },
    {
      header: "Modelo",
      key: "modelo",
      render: (vehiculo) => vehiculo.modelo || 'Modelo no disponible',
    },
    {
      header: "Patente",
      key: "patente",
      render: (vehiculo) => vehiculo.patente || 'Patente no disponible',
    },
    {
      header: "Año",
      key: "anio",
      render: (vehiculo) => vehiculo.anio || 'Año no disponible',
    },
  ];

  const columns2 = [
    {
      header: "Cliente",
      key: "cliente",
      render: (ordenes) => ordenes.user || 'Cliente no disponible',
    },
    {
      header: "Servicio",
      key: "servicio",
      render: (ordenes) => {
        if (ordenes.catalogo_servicios && ordenes.catalogo_servicios.length > 0) {
          const firstService = ordenes.catalogo_servicios;
          const moreServices = ordenes.catalogo_servicios.length > 1;
          return moreServices ? `${firstService} (+${ordenes.catalogo_servicios.length - 1} más)` : firstService;
        }
        return 'Servicio no disponible';
      },
    },
    { 
      header: "Valor", 
      key: "valor", 
      render: (ordenes) => 
        ordenes.costo 
          ? new Intl.NumberFormat('es-CL').format(ordenes.costo) 
          : 'Valor no disponible',
    },
    {
      header: "Estado",
      key: "estado",
      render: (ordenes) => ordenes.estado_ot_id || 'Estado no disponible',
    }
  ];

  const columns3 = [
    {
      header: "Cliente",
      key: "cliente",
      render: (Cotizaciones) => Cotizaciones.user || 'Cliente no disponible',
    },
    {
      header: "Servicio",
      key: "servicio",
      render: (Cotizaciones) => {
        if (Cotizaciones.catalogo_servicios && Cotizaciones.catalogo_servicios.length > 0) {
          const firstService = Cotizaciones.catalogo_servicios;
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
    // { 
    //   header: "Fecha", 
    //   key: "fecha", 
    //   render: (Cotizaciones) => {
    //     if (!Cotizaciones.fechainicio) return 'Fecha no disponible';
        
    //     const [year, month, day] = Cotizaciones.fechainicio.split('-');
    //     return `${day}-${month}-${year}`;
    //   }
    // },
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
                  <Tablas servicio={ordenes} handleViewTabla={handleViewVehiculo} columns={columns2} />
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
