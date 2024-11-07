import { useEffect, useState } from 'react';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Tablas from '../../components/Tablas';

function Client() {
  const [vehiculos, setVehiculos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [totalServicios, setTotalServicios] = useState(0);
  const [servicios, setServicios] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [OT, SetOT] = useState([]);
  const navigate = useNavigate();
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

  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

  useEffect(() => {
    const jwt = getTokenFromLocalCookie();
    const fetchVehiculos = async () => {
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/users/me?populate=*`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });

          const vehiculoIds = response.vehiculo_ids || [];
          const validVehiculoIds = vehiculoIds.filter(v => v && v.id);
          const OT = response || [];

          console.log('vehiculos:', response);
          
          SetOT(OT);
          setVehiculos(validVehiculoIds);

        } catch (error) {
          console.error('Error fetching vehicles:', error);
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
        console.log('servicios:', response.data);

      } catch (error) {
        console.error('Error fetching servicios:', error);
      }
    };

    fetchServicios();
    fetchMarcas();
    fetchTiposVehiculo();
    fetchVehiculos();
  }, [STRAPI_URL]);

  const handleServicioSelect = (e, servicio) => {
    if (e.target.checked) {
      // Si el servicio es seleccionado, suma el costo al total
      setTotalServicios((prevTotal) => prevTotal + servicio.costserv);
    } else {
      // Si se deselecciona, resta el costo del total
      setTotalServicios((prevTotal) => prevTotal - servicio.costserv);
    }
  };


  const handleChange = (e) => {
    setNewVehiculo({ ...newVehiculo, [e.target.name.toLowerCase()]: e.target.value });
  };

  const handleAddVehiculo = async (e) => {
    e.preventDefault();
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
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
        setIsAdding(false);
      } catch (error) {
        console.error('Error adding vehicle:', error);
      }
    }
  };

  // Función para redirigir al detalle del vehículo
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

  const columns2 = [
    {
      header: "Servicio",
      key: "servicio",
      render: (OT) => OT.catalogo_servicios ? OT.catalogo_servicios.tp_servicio : 'Servicio no disponible',
    },
    {
      header: "Costo",
      key: "costo",
      render: (OT) => OT.costo || 'Costo no disponible',
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fechainicio: "",
    costo: "",
    estado_ot_id: "",
    ordentrabajo_catalogoservicio_id: "",
    mecanico_id: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para enviar el formulario
    console.log(formData);
    setShowModal(false);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Mantenimiento de Autos</h1>

      <div className='grid gap-4 md:grid-cols-2'>

        {/* Sección de Mis Autos */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Mis Autos</h3>
            <button
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? 'Cancelar' : 'Agregar'}
            </button>
          </div>

          {vehiculos.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              <h4 className="text-xl">No tienes vehículos registrados.</h4>
            </div>
          ) : (
            <div>
              <Tablas servicio={vehiculos} handleViewTabla={handleViewVehiculo} columns={columns} />
            </div>
          )}

          {/* Formulario para agregar vehículo */}
          {isAdding && (
            <form onSubmit={handleAddVehiculo} className="mt-4">
              <div className="grid gap-4">
                <select
                  name="tp_vehiculo_id"
                  value={newVehiculo.tp_vehiculo_id}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
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
                  className="p-2 border rounded"
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
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="patente"
                  placeholder="Patente"
                  value={newVehiculo.patente}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="numeric"
                  name="anio"
                  placeholder="Año"
                  value={newVehiculo.anio}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  name="kilometraje"
                  placeholder="Kilometraje"
                  value={newVehiculo.kilometraje}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="motor"
                  placeholder="motor"
                  value={newVehiculo.motor}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="color"
                  placeholder="color"
                  value={newVehiculo.color}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
              </div>
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                Agregar Vehículo
              </button>
            </form>
          )}
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Mis Cotizaciones</h3>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
            >
              Solicitar
            </button>
          </div>

          {/* Modal del formulario */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <h4 className="text-xl font-semibold mb-4">Nueva Cotización</h4>
                <form onSubmit={handleSubmit}>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Seleccionar Servicios</label>
                    <div className="mt-1">
                      {servicios.map((servicio) => (
                        <div key={servicio.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`servicio-${servicio.id}`}
                            value={servicio.id}
                            onChange={(e) => handleServicioSelect(e, servicio)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <label htmlFor={`servicio-${servicio.id}`} className="ml-2 block text-sm text-gray-900">
                            {servicio.tp_servicio} - ${servicio.costserv}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-xl font-semibold">Total de Servicios: ${totalServicios}</h2>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Mecánico ID</label>
                    <input
                      type="text"
                      name="mecanico_id"
                      value={formData.mecanico_id}
                      onChange={handleInputChange}
                      placeholder="ID del mecánico"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 text-sm text-gray-500 hover:underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <div>
            <Tablas servicio={OT} handleViewTabla={handleViewVehiculo} columns={columns2} />
          </div>
        </div>


      </div>
    </div>
  );
}

export default Client;