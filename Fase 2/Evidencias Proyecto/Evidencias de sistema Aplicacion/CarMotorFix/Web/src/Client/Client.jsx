import { useEffect, useState } from 'react';
import { fetcher } from '../lib/strApi';
import { getTokenFromLocalCookie } from '../lib/cookies';
import Cookies from 'js-cookie';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Client() {
  const [vehiculos, setVehiculos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
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

  const [marcas, setMarcas] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const navigate = useNavigate(); // Inicializa useNavigate para redirecciones
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

  useEffect(() => {
    const jwt = getTokenFromLocalCookie();
    const fetchVehiculos = async () => {
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/users/me?populate=vehiculo_ids`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });

          const vehiculoIds = response.vehiculo_ids || [];
          const validVehiculoIds = vehiculoIds.filter(v => v && v.id);
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

    fetchMarcas();
    fetchTiposVehiculo();
    fetchVehiculos();
  }, [STRAPI_URL]);

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
            user_id: Cookies.get('user_id'),
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca - Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patente - Año
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehiculos.filter(vehiculo => vehiculo && vehiculo.id).map((vehiculo) => (
                    <tr
                      key={vehiculo.id}
                      onClick={() => handleViewVehiculo(vehiculo)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vehiculo.marca ? `${vehiculo.marca} - ${vehiculo.modelo}` : 'Marca desconocida'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vehiculo.patente ? formatPatente(vehiculo.patente) : 'Patente no disponible'} - {vehiculo.anio || 'Año no disponible'}
                      </td>
                      <td className="px-6 py-4 font-medium text-right pr-4">
                        <ArrowRight className="inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  type="date"
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

        {/* Sección de Mis Cotizaciones */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Mis Cotizaciones</h3>
            <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700">
              Solicitar
            </button>
          </div>

          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="cursor-pointer hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">Mantenimiento General</td>
                  <td className="px-6 py-4 whitespace-nowrap">99.990</td>
                  <td className="px-6 py-4 font-medium">
                    <button className="text-blue-600 hover:underline">Ver</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Client;
