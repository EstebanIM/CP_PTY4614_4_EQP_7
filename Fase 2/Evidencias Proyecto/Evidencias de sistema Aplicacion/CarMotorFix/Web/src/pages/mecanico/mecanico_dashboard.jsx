import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/tables/cards";
import { Table } from "../../components/ui/tables/table";
import Modal from "../../components/forms/modal";
import Tablas from "../../components/Tablas";
import { getTokenFromLocalCookie } from "../../lib/cookies";
import { fetcher } from "../../lib/strApi";
import { useNavigate } from "react-router-dom";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const DashboardAutos = () => {
  const navigate = useNavigate();

  const [totalServicios, setTotalServicios] = useState(0);
  const [vehiculos, setVehiculos] = useState([]);
  const [TotalVehiculos, setTotalVehiculos] = useState(0);
  const [Cotizaciones, setCotizaciones] = useState([]);
  const [TotalCotizaciones, setTotalCotizaciones] = useState(0);
  const [idMecanico, setIdMecanico] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [TotalOrdenes, setTotalOrdenes] = useState(0);
  const [showCotizacionModal, setShowCotizacionModal] = useState(false);
  const [servicios, setServicios] = useState([]);

  const [formData, setFormData] = useState({
    costo: '',
    vehiculo: '',
    descripcion: '',
    fecharecepcion: '',
    fechaentrega: '',
    catalogo_servicios: []
  });

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

    fetchIDMecanico();
  }, []);

  useEffect(() => {
    if (!idMecanico) return;

    const jwt = getTokenFromLocalCookie();

    const fetchOT = async () => {
      try {
        const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos?populate[catalogo_servicios][fields]=tp_servicio&populate[user][fields]=username&populate[estado_ot_id][fields]=nom_estado&populate[vehiculo][fields]=id,anio,modelo,motor,patente&populate[vehiculo][populate][marca_id][fields]=nombre_marca&populate[vehiculo][populate][user_id][fields]=id&filters[mecanico_id][documentId][$eq]=${idMecanico}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });

        const OT = response.data.map((OT) => ({
          ...OT,
          user: OT.user.username,
          estado_ot_id: OT.estado_ot_id.nom_estado,
          catalogo_servicios: OT.catalogo_servicios.map(servicio => servicio.tp_servicio),
          costo: OT.costo,
          fechainicio: OT.fechainicio,
          vehiculo: {
            id: OT.vehiculo.id,
            anio: OT.vehiculo.anio,
            documentId: OT.vehiculo.documentId,
            modelo: OT.vehiculo.modelo,
            motor: OT.vehiculo.motor,
            patente: OT.vehiculo.patente,
            user_id: OT.vehiculo.user_id.id,
            marca_id: OT.vehiculo.marca_id.nombre_marca,
          }
        }));

        const vehiculosUnicos = new Set(OT.map(OT => OT.vehiculo.documentId));

        setVehiculos(Array.from(new Map(OT.map(item => [item.vehiculo.documentId, item.vehiculo])).values()));
        setTotalVehiculos(vehiculosUnicos.size);

        const Cotizacion = OT.filter(cotizacion => cotizacion.estado_ot_id === 'Cotizando');
        const Ordenes = OT.filter(Ordenes => Ordenes.estado_ot_id !== 'Cotizando');

        setOrdenes(Ordenes);

        setTotalOrdenes(Ordenes.length);
        setCotizaciones(Cotizacion);
        setTotalCotizaciones(Cotizacion.length);

      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    const fetchServicios = async () => {
      try {
        const response = await fetcher(`${STRAPI_URL}/api/catalogo-servicios`, {
          headers: {
            'Content-Type': 'application/json'
          },
        });
        setServicios(response.data || []);
      } catch (error) {
        console.error('Error fetching servicios:', error);
      }
    };

    fetchServicios();
    fetchOT();
  }, [idMecanico]);

  const handleViewVehiculo = (vehiculo) => {
    navigate(`/vehiculos/detalle-vehiculo/${vehiculo.documentId}`);
  };

  const handleViewOT = (DetalleOT) => {
    navigate(`/detalle_ot/${DetalleOT.documentId}`);
  };

  const handleServicioSelect = (e, servicio) => {
    const { checked } = e.target;

    setFormData((prevData) => {
      const newCatalogoServicios = checked
        ? [...prevData.catalogo_servicios, { id: servicio.id }]
        : prevData.catalogo_servicios.filter((item) => item.id !== servicio.id);

      return {
        ...prevData,
        catalogo_servicios: newCatalogoServicios,
      };
    });

    setTotalServicios((prevTotal) =>
      checked ? prevTotal + servicio.costserv : prevTotal - servicio.costserv
    );
  };


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
  ];

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const handleSubmitCotizacion = async (e) => {
    e.preventDefault();

    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        const CotizacionData = {
          data: {
            fechainicio: new Date().toISOString().split('T')[0],
            costo: totalServicios,
            mecanico_id: idMecanico,
            vehiculo: formData.vehiculo.id,
            estado_ot_id: 1,
            user: formData.vehiculo.user_id,
            fecharecepcion: formData.fecharecepcion,
            fechaentrega: formData.fechaentrega,
            descripcion: formData.descripcion,
            catalogo_servicios: formData.catalogo_servicios.map((servicio) => servicio.id)
          }
        };

        const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(CotizacionData),
        });

        console.log('Cotización creada:', CotizacionData);

        if (response && response.data) {
          setCotizaciones((prevOT) => [...prevOT, response.data]);
        }

        setFormData({
          costo: '',
          vehiculo: '',
          descripcion: '',
          fecharecepcion: '',
          fechaentrega: '',
          catalogo_servicios: []
        });
        setTotalServicios(0);

        setShowCotizacionModal(false);

      } catch (error) {
        console.error('Error al crear la cotización:', error);
      }
    }
  };

  const handleChangeCotizacion = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name === "vehiculo") {
        const selectedVehiculo = vehiculos.find(v => v.id === Number(value));

        if (selectedVehiculo) {
          return {
            ...prevData,
            vehiculo: {
              id: selectedVehiculo.id,
              user_id: selectedVehiculo.user_id
            }
          };
        } else {
          console.warn("Vehículo no encontrado");
          return prevData;
        }
      }

      return {
        ...prevData,
        [name]: value,
      };
    });
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
            <h2 className="pb-3 text-xl font-bold mb-4">Órdenes Activas</h2>
            <Card>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-full">
                  {ordenes.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                      <h4 className="text-xl">No hay ordenes activas.</h4>
                    </div>
                  ) : (

                    <Tablas servicio={ordenes} handleViewTabla={handleViewOT} columns={columns2} />
                  )}
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cotizaciones Pendientes */}
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cotizaciones Pendientes</h2>
              <button
                onClick={() => setShowCotizacionModal(true)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
              >
                Nueva Cotización
              </button>
            </div>
            <Card>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-full">
                  <Tablas servicio={Cotizaciones} handleViewTabla={handleViewOT} columns={columns3} />
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={showCotizacionModal} onClose={() => setShowCotizacionModal(false)}>
        <h4 className="text-xl font-semibold mb-4">Nueva Cotización</h4>
        <form onSubmit={handleSubmitCotizacion}>
          {/* Selección de Servicios */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Seleccionar Servicios</label>
            <div className="mt-1">
              {servicios.map((servicio) => (
                <div key={servicio.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`servicio-${servicio.id}`}
                    value={servicio.id}
                    checked={formData.catalogo_servicios.some((item) => item.id === servicio.id)}
                    onChange={(e) => handleServicioSelect(e, servicio)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`servicio-${servicio.id}`} className="ml-2 block text-sm text-gray-900">
                    {servicio.tp_servicio} - {servicio.costserv && new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(servicio.costserv)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Total de Servicios */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Total de Servicios: {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalServicios)}</h2>
          </div>

          {/* Vehículo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Vehículo</label>
            <select
              id="vehiculo-select"
              name="vehiculo"
              value={formData.vehiculo?.id || ""}
              onChange={handleChangeCotizacion}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Selecciona un vehículo</option>
              {vehiculos.map((vehiculo) => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.marca_id.nombre_marca} {vehiculo.modelo} - {vehiculo.patente}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de Recepción */}
          <div className="mb=4">
            <label htmlFor="fecharecepcion" className="block text-sm font-medium text-gray-700">
              Fecha de Recepción
            </label>
            <input
              type="date"
              id="fecharecepcion"
              name="fecharecepcion"
              value={formData.fecharecepcion}
              onChange={handleChangeCotizacion}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Fecha de Entrega */}
          <div className="mb=4">
            <label htmlFor="fechaentrega" className="block text-sm font-medium text-gray-700">
              Fecha de Entrega
            </label>
            <input
              type="date"
              id="fechaentrega"
              name="fechaentrega"
              value={formData.fechaentrega}
              onChange={handleChangeCotizacion}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={formData.descripcion}
              onChange={handleChangeCotizacion}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="Descripción de la cotización"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Agregar Cotización
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default DashboardAutos;
