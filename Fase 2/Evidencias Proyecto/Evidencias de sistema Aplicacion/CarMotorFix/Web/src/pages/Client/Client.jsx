import { useEffect, useState, useContext } from 'react';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Tablas from '../../components/Tablas';
import Modal from '../../components/forms/modal';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardHeader from '../../components/menu/DashboardHeader';
import DashboardSidebar from '../../components/menu/DashboardSidebar';
import Spinner from '../../components/animation/spinner';
import { DarkModeContext } from '../../context/DarkModeContext';

function Client() {
  
  const { darkMode } = useContext(DarkModeContext);
  const [vehiculos, setVehiculos] = useState([]);
  const [totalServicios, setTotalServicios] = useState(0);
  const [servicios, setServicios] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [mecanico, setMecanico] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [OT, SetOT] = useState([]);
  const [showAddVehiculoModal, setShowAddVehiculoModal] = useState(false);
  const [showCotizacionModal, setShowCotizacionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [newVehiculo, setNewVehiculo] = useState({
    marca_id: '',
    tp_vehiculo_id: '',
    modelo: '',
    patente: '',
    anio: '',
    kilometraje: '',
    motor: '',
    color: ''
  });

  const [formData, setFormData] = useState({
    costo: '',
    mecanico_id: '',
    vehiculo: '',
    catalogo_servicios: []
  });

  const validatePatente = () => {
    const selectedTipo = tiposVehiculo.find(
      (tipo) => tipo.id === Number(newVehiculo.tp_vehiculo_id)
    );

    if (selectedTipo && selectedTipo.nom_tp_vehiculo === "Moto/motocicleta") {
      const motoPattern = /^[A-Z]{2}\d{3}$|^[A-Z]{3}\d{2}$/;
      if (!motoPattern.test(newVehiculo.patente)) {
        toast.error("Formato de patente para moto no válido. Debe ser en formato AA-000 o AAA-00 en mayúsculas.");
        return false;
      }
    } else {
      const autoPattern = /^[A-Z]{2}\d{4}$|^[A-Z]{4}\d{2}$/;
      if (!autoPattern.test(newVehiculo.patente)) {
        toast.error("Formato de patente no válido. Debe ser en formato AA-0000 o AAAA-00 en mayúsculas.");
        return false;
      }
    }
    return true;
  };

  const isPatenteDuplicada = (patente) => {
    return vehiculos.some((vehiculo) => vehiculo.patente === patente);
  };

  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

  useEffect(() => {
    const jwt = getTokenFromLocalCookie();

    const fetchVehiculos = async () => {
      if (jwt) {
        setLoading(true);
        try {
          const response = await fetcher(`${STRAPI_URL}/api/users/me?pLevel=3`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },

          });
          const vehiculoIds = response.vehiculo_ids || [];
          setUserRole(response.role.name);
          const validVehiculoIds = vehiculoIds.filter(v => v && v.id);
          const OT = response.ots || [];

          SetOT(OT);
          setVehiculos(validVehiculoIds);

        } catch (error) {
          console.error('Error fetching vehicles:', error);
          toast.error("Error al obtener la lista de vehículos.");
        }
        finally {
          setLoading(false);
        }
      }
    };

    const fetchMarcas = async () => {
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/marcas`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });
          setMarcas(response.data);
        } catch (error) {
          console.error('Error fetching marcas:', error);
          toast.error("Error al obtener la lista de marcas.");
        }
      }
    };

    const fetchTiposVehiculo = async () => {
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/tp-vehiculos`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });
          setTiposVehiculo(response.data);
        } catch (error) {
          console.error('Error fetching tipos vehiculo:', error);
          toast.error("Error al obtener los tipos de vehículos.");
        }
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
        toast.error("Error al obtener el catálogo de servicios.");
      }
    };

    const fetchMecanicos = async () => {
      try {
        const response = await fetcher(`${STRAPI_URL}/api/mecanicos?fields=id,prim_nom,prim_apell`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
        setMecanico(response.data || []);

      } catch (error) {
        console.error('Error fetching Mecanico:', error);
        toast.error("Error al obtener a los Mecanicos.");
      }
    };

    fetchServicios();
    fetchMarcas();
    fetchTiposVehiculo();
    fetchVehiculos();
    fetchMecanicos();
  }, [STRAPI_URL]);

  const handleServicioSelect = (e, servicio) => {
    setTotalServicios((prevTotal) =>
      e.target.checked ? prevTotal + servicio.costserv : prevTotal - servicio.costserv
    );

    setFormData((prevData) => {
      const isSelected = prevData.catalogo_servicios.some((item) => item.id === servicio.id);
      const newServicios = isSelected
        ? prevData.catalogo_servicios.filter((item) => item.id !== servicio.id)
        : [...prevData.catalogo_servicios, { id: servicio.id }];

      return {
        ...prevData,
        catalogo_servicios: newServicios,
        costo: totalServicios + (e.target.checked ? servicio.costserv : -servicio.costserv),
      };
    });
  };

  const handleChange = (e) => {
    setNewVehiculo({ ...newVehiculo, [e.target.name]: e.target.value });
  };

  const handleChangeCotizacion = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddVehiculo = async (e) => {
    e.preventDefault();

    if (isPatenteDuplicada(newVehiculo.patente)) {
      toast.error("La patente ya está registrada. Intente con otra.");
      return;
    }

    if (!validatePatente()) {
      return;
    }

    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        setLoading(true);
        const vehiculoData = {
          data: {
            user_id: Cookies.get('id'),
            marca_id: newVehiculo.marca_id,
            tp_vehiculo_id: newVehiculo.tp_vehiculo_id,
            modelo: newVehiculo.modelo,
            patente: newVehiculo.patente,
            anio: newVehiculo.anio,
            kilometraje: Number(newVehiculo.kilometraje),
            motor: newVehiculo.motor,
            color: newVehiculo.color
          }
        };

        const response = await fetcher(`${STRAPI_URL}/api/vehiculos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(vehiculoData),
        });

        setVehiculos([...vehiculos, response.data]);
        setNewVehiculo({
          patente: '',
          anio: '',
          kilometraje: '',
          modelo: '',
          motor: '',
          color: '',
          marca_id: '',
          tp_vehiculo_id: ''
        });
        setShowAddVehiculoModal(false);
        toast.success("Vehículo agregado correctamente");
      } catch (error) {
        console.error('Error adding vehicle:', error);
        toast.error("Error al agregar el vehículo");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewVehiculo = (vehiculo) => {
    navigate(`/detalle-vehiculo/${vehiculo.documentId}`);
  };

  const handleViewCotizacion = (cotizacion) => {
    navigate(`/detalle_ot/${cotizacion.documentId}`);
  };

  const formatPatente = (patente) => {
    const letras = patente.substring(0, 4);
    const numeros = patente.substring(4);
    return (letras.length === 4 && numeros.length === 2) || (letras.length === 2 && numeros.length === 4) ? `${letras}-${numeros}` : patente;
  };

  const handleSubmitCotizacion = async (e) => {
    e.preventDefault();

    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        setLoading(true);
        const CotizacionData = {
          data: {
            fechainicio: new Date().toISOString().split('T')[0],
            costo: formData.costo,
            mecanico_id: formData.mecanico_id,
            vehiculo: formData.vehiculo,
            estado_ot_id: 1,
            user: Cookies.get('id'),
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

        if (response && response.data) {
          SetOT((prevOT) => [...prevOT, response.data]);
        }

        setFormData({
          costo: '',
          mecanico_id: '',
          vehiculo: '',
          catalogo_servicios: []
        });

        setShowCotizacionModal(false);
        toast.success("Cotización creada correctamente");
      } catch (error) {
        console.error('Error al crear la cotización:', error);
        toast.error("Hubo un error al intentar crear la cotización");
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
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
      render: (vehiculo) => vehiculo.patente ? formatPatente(vehiculo.patente) : 'Patente no disponible'
    },
    {
      header: "Año",
      key: "anio",
      render: (vehiculo) => vehiculo.anio || 'Año no disponible'
    },
  ];

  const columns2 = [
    {
      header: "Servicio",
      key: "servicio",
      render: (OT) => {
        if (OT.catalogo_servicios && OT.catalogo_servicios.length > 0) {
          const firstService = OT.catalogo_servicios[0].tp_servicio;
          const moreServices = OT.catalogo_servicios.length > 1;
          return moreServices ? `${firstService} (+${OT.catalogo_servicios.length - 1} más)` : firstService;
        }
        return 'Servicio no disponible';
      },
    },
    {
      header: "Costo",
      key: "costo",
      render: (OT) =>
        OT.costo
          ? new Intl.NumberFormat('es-CL').format(OT.costo)
          : 'Costo no disponible',
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex flex-col h-screen md:flex-row">
        <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} darkMode={darkMode} userRole={userRole} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} darkMode={darkMode} />

          <div className={`container mx-auto p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <h1 className='text-2xl font-bold mb-4'>Mantenimiento de Autos</h1>

            <div className='grid gap-4 md:grid-cols-2'>
              {/* Mis Autos  */}
              <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-card text-card-foreground border-gray-200'} shadow-sm p-6`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mis Autos</h3>
                  {vehiculos.length < 3 && (
                    <button
                      className={`px-4 py-2 rounded hover:bg-gray-700 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-gray-700'}`}
                      onClick={() => setShowAddVehiculoModal(true)}
                    >
                      Agregar
                    </button>
                  )}
                </div>

                {vehiculos.length === 0 ? (
                  <div className={`text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <h4 className="text-xl">No tienes vehículos registrados.</h4>
                  </div>
                ) : (
                  <Tablas servicio={vehiculos} handleViewTabla={handleViewVehiculo} columns={columns} />
                )}

                {/* Modal del Vehiculo */}
                <Modal isOpen={showAddVehiculoModal} onClose={() => setShowAddVehiculoModal(false)} loading={loading}>
                  <h4 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Agregar Vehículo</h4>
                  {loading ? (
                    <Spinner size="large" />
                  ) : (
                    <form onSubmit={handleAddVehiculo}>
                      <div className={`grid gap-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        <select
                          name="tp_vehiculo_id"
                          value={newVehiculo.tp_vehiculo_id}
                          onChange={handleChange}
                          required
                          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        >
                          <option value="">Seleccione Tipo</option>
                          {tiposVehiculo.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nom_tp_vehiculo}</option>
                          ))}
                        </select>
                        <select
                          name="marca_id"
                          value={newVehiculo.marca_id}
                          onChange={handleChange}
                          required
                          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        >
                          <option value="">Seleccione Marca</option>
                          {marcas.map((marca) => (
                            <option key={marca.id} value={marca.id}>{marca.nombre_marca}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          name="modelo"
                          placeholder="Modelo"
                          value={newVehiculo.modelo}
                          onChange={handleChange}
                          required
                          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                        <input
                          type="text"
                          name="patente"
                          placeholder="Patente"
                          value={newVehiculo.patente}
                          onChange={handleChange}
                          required
                          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                        <input
                          type="number"
                          name="anio"
                          placeholder="Año"
                          value={newVehiculo.anio}
                          onChange={handleChange}
                          required
                          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                        <input
                          type="number"
                          name="kilometraje"
                          placeholder="Kilometraje"
                          value={newVehiculo.kilometraje}
                          onChange={handleChange}
                          required
                          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                        <input
                          type="text"
                          name="motor"
                          placeholder="Motor"
                          value={newVehiculo.motor}
                          onChange={handleChange}
                          required
                          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                        <input
                          type="text"
                          name="color"
                          placeholder="Color"
                          value={newVehiculo.color}
                          onChange={handleChange}
                          required
                          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <button
                        type="submit"
                        className={`mt-4 px-4 py-2 rounded hover:bg-blue-500 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        Agregar Vehículo
                      </button>
                    </form>
                  )}
                </Modal>
              </div>

              {/* Cotizaciones Section */}
              <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-card text-card-foreground border-gray-200'} shadow-sm p-6`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mis Cotizaciones</h3>
                  <button
                    onClick={() => setShowCotizacionModal(true)}
                    className={`px-4 py-2 rounded hover:bg-gray-700 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-gray-700'}`}
                  >
                    Solicitar
                  </button>
                </div>

                <Modal isOpen={showCotizacionModal} onClose={() => setShowCotizacionModal(false)}>
                  <h4 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Nueva Cotización</h4>
                  <form onSubmit={handleSubmitCotizacion}>
                    {/* Selección de Servicios */}
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Seleccionar Servicios</label>
                      <div className="mt-1">
                        {servicios.map((servicio) => (
                          <div key={servicio.id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`servicio-${servicio.id}`}
                              value={servicio.id}
                              checked={formData.catalogo_servicios.some((item) => item.id === servicio.id)}
                              onChange={(e) => handleServicioSelect(e, servicio)}
                              className={`h-4 w-4 ${darkMode ? 'text-blue-600 bg-gray-700 border-gray-600' : 'text-blue-600 bg-white border-gray-300'} rounded`}
                            />
                            <label htmlFor={`servicio-${servicio.id}`} className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {servicio.tp_servicio} - {servicio.costserv && new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(servicio.costserv)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total de Servicios */}
                    <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <h2 className="text-xl font-semibold">Total de Servicios: {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalServicios)}</h2>
                    </div>

                    {/* Vehículo */}
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vehículo</label>
                      <select
                        id="vehiculo-select"
                        name="vehiculo"
                        onChange={handleChangeCotizacion}
                        className={`block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        required
                      >
                        <option value="">Selecciona un vehículo</option>
                        {vehiculos.map((vehiculo) => (
                          <option key={vehiculo.id} value={vehiculo.id}>
                            {vehiculo.marca_id ? vehiculo.marca_id.nombre_marca : 'Marca desconocida'} {vehiculo.modelo} - {formatPatente(vehiculo.patente)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mecánico ID */}
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Seleccionar Mecánico</label>
                      <div className="mt-1">
                        <select
                          id="mecanico-select"
                          name="mecanico_id"
                          onChange={handleChangeCotizacion}
                          className={`block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        >
                          <option value="">Selecciona un mecánico</option>
                          {mecanico.map((mec) => (
                            <option key={mec.id} value={mec.id}>
                              {mec.prim_nom} {mec.prim_apell}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full px-4 py-2 rounded hover:bg-blue-700 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      Agregar Cotización
                    </button>
                  </form>
                </Modal>

                <div>
                  {OT.length === 0 ? (
                    <div className={`text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <h4 className="text-xl">No tienes Cotizaciones.</h4>
                    </div>
                  ) : (
                    <Tablas servicio={OT} handleViewTabla={handleViewCotizacion} columns={columns2} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Client;