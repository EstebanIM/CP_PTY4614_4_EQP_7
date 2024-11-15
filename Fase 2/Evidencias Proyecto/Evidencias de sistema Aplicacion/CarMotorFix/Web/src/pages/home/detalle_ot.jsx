import { useState, useEffect, useContext } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/tables/cards";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../lib/strApi";
import { useParams } from "react-router-dom";
import Modal from '../../components/forms/modal';
import { getTokenFromLocalCookie } from "../../lib/cookies";
import DashboardHeader from "../../components/menu/DashboardHeader";
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import Loading from "../../components/animation/loading";
import { DarkModeContext } from '../../context/DarkModeContext';

export default function WorkOrderDetails() {
  const { darkMode } = useContext(DarkModeContext);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [Orden, setOrden] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);
  const [VehiculoID, setVehiculoID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [showAddEstado, setshowAddEstado] = useState(false);
  const [newEstado, setNewEstado] = useState([]);

  const [formData, setFormData] = useState({
    descripcion: '',
    fecharecepcion: '',
    fechaentrega: '',
    catalogo_servicios: []
  });

  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

  const fetchOrden = async () => {
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos/${id}?pLevel`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });

        setOrden(response.data);
        console.log(response.data);

        setVehiculoID(response.data.vehiculo.documentId);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    }
  };

  const fetchUserRole = async () => {
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        const response = await fetcher(`${STRAPI_URL}/api/users/me?populate=*`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });

        setUserRole(response.role.name);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    }
  }

  const fetchVehiculo = async () => {
    if (VehiculoID) {
      const jwt = getTokenFromLocalCookie();
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/vehiculos/${VehiculoID}?populate=*`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });

          setVehiculo(response.data);

          // console.log(response.data);


        } catch (error) {
          console.error('Error fetching vehicle:', error);
        }
      }
    }
  };

  const fetchEstados = async () => {
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        const response = await fetcher(`${STRAPI_URL}/api/estado-ots?fields=nom_estado`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });

        setNewEstado(response.data || []);

      } catch (error) {
        console.error('Error fetching order states:', error);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrden();
    fetchUserRole();
    fetchEstados();
  }, [id]);

  useEffect(() => {
    if (VehiculoID) {
      fetchVehiculo();
    }
  }, [VehiculoID]);

  useEffect(() => {
    if (Orden && vehiculo) {
      setLoading(false);
    }
  }, [Orden, vehiculo]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const formatPatente = (patente) => {
    if (typeof patente !== 'string') {
      return patente;
    }

    const cleanPatente = patente.replace(/[^A-Za-z0-9]/g, '');

    if (cleanPatente.length === 6) {
      return `${cleanPatente.slice(0, 2)}-${cleanPatente.slice(2)}`;
    } else if (cleanPatente.length === 8) {
      return `${cleanPatente.slice(0, 4)}-${cleanPatente.slice(4)}`;
    } else if (cleanPatente.length === 7) {
      return `${cleanPatente.slice(0, 3)}-${cleanPatente.slice(3)}`;
    }

    return patente;
  };

  if (loading) {
    return <Loading />;
  }

  const handleSubmitEstado = async (e) => {
    e.preventDefault();

    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {

        // setLoading(true);
        // const vehiculoData = {
        //   data: {
        //     user_id: Cookies.get('id'),
        //     marca_id: newVehiculo.marca_id,
        //     tp_vehiculo_id: newVehiculo.tp_vehiculo_id,
        //     modelo: newVehiculo.modelo,
        //     patente: newVehiculo.patente,
        //     anio: newVehiculo.anio,
        //     kilometraje: Number(newVehiculo.kilometraje),
        //     motor: newVehiculo.motor,
        //     color: newVehiculo.color
        //   }
        // };

        // const response = await fetcher(`${STRAPI_URL}/api/vehiculos`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${jwt}`,
        //   },
        //   body: JSON.stringify(vehiculoData),
        // });

        // setVehiculos([...vehiculos, response.data]);
        // setNewVehiculo({
        //   patente: '',
        //   anio: '',
        //   kilometraje: '',
        //   modelo: '',
        //   motor: '',
        //   color: '',
        //   marca_id: '',
        //   tp_vehiculo_id: ''
        // });
        // setShowAddVehiculoModal(false);
        // toast.success("Vehículo agregado correctamente");
      } catch (error) {
        console.error('Error adding vehicle:', error);
        // toast.error("Error al agregar el vehículo");
      } finally {
        setLoading(false);
      }
    }
  };

  const actualizarEstadoOrden = async (id, nuevoEstado) => {
    const jwt = getTokenFromLocalCookie();
    try {
      const updateData = {
        data: {
          estado_ot_id: nuevoEstado,
        },
      };

      const response = await fetch(`${STRAPI_URL}/api/orden-trabajos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar la orden: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Orden actualizada exitosamente:', data);

      const clienteEmail = Orden.user.email;
      const mecanicoEmail = Orden.mecanico_id.correo;

      const clienteEmailData = {
        to: clienteEmail,
        subject: "Actualización de Estado de su Orden de Trabajo",
        html: `
        <p>El estado de su orden de trabajo ha sido actualizado.</p>
        <p>El estado de su orden de trabajo ha sido actualizado a: ${nuevoEstado === 2 ? 'Aceptado' : 'Rechazado'}</p>`,
      };

      const clienteEmailResponse = await fetch(`http://localhost:1337/api/email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(clienteEmailData),
      });

      if (!clienteEmailResponse.ok) {
        throw new Error(`Error al enviar el email al cliente: ${clienteEmailResponse.statusText}`);
      }

      const mecanicoEmailData = {
        to: mecanicoEmail,
        subject: "Notificación de Actualización de Orden de Trabajo",
        html: `
        <p>El estado de la orden de trabajo que estás gestionando ha sido actualizado.</p>
        <p>El estado de la orden de trabajo ha sido actualizado a: ${nuevoEstado === 2 ? 'Aceptado' : 'Rechazado'}</p>`,
      };

      const mecanicoEmailResponse = await fetch(`http://localhost:1337/api/email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(mecanicoEmailData),
      });

      if (!mecanicoEmailResponse.ok) {
        throw new Error(`Error al enviar el email al mecánico: ${mecanicoEmailResponse.statusText}`);
      }

      setOrden((prevOrden) => ({
        ...prevOrden,
        estado_ot_id: { nom_estado: nuevoEstado === 2 ? 'Aceptado' : 'Rechazado' },
      }));

      return data;
    } catch (error) {
      console.error('Error en la actualización de la orden o envío de email:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <div className="p-4 sm:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <Button onClick={handleBack} variant="outline" size="md" className="mb-2 sm:mb-0">Volver</Button>
            <h1 className={`text-2xl sm:text-4xl font-bold text-center sm:w-full ${darkMode ? 'text-white' : 'text-black'}`}>Detalle de Orden de Trabajo</h1>
          </div>

          <Card className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Orden #{Orden.id}</h2>
              {Orden.descripcion &&
                userRole === 'Authenticated' &&
                Orden.estado_ot_id?.nom_estado !== 'Aceptado' &&
                Orden.estado_ot_id?.nom_estado !== 'Rechazado' && (
                  <div className="space-x-4">
                    <button className="px-4 py-2 bg-green-700 text-white rounded"
                      onClick={() => actualizarEstadoOrden(Orden.documentId, 2)} // 2 para "Aceptado"
                    >
                      Aceptar
                    </button>
                    <button className="px-4 py-2 bg-red-700 text-white rounded"
                      onClick={() => actualizarEstadoOrden(Orden.documentId, 4)} // 4 para "Rechazado"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-muted-foreground">Cliente</div>
                <div className="font-medium">{Orden.user?.nombre} {Orden.user?.apellido}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Vehículo</div>
                <div className="font-medium">
                  {vehiculo ? `${vehiculo.marca_id?.nombre_marca} ${vehiculo.modelo} (${formatPatente(vehiculo.patente)})` : 'Vehículo no disponible'}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Estado</div>
                <div className="font-medium text-yellow-600">{Orden.estado_ot_id?.nom_estado}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Fecha de Inicio</div>
                <div className="font-medium">
                  {Orden.fechainicio ? new Date(Orden.fechainicio).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Fecha no disponible'}
                </div>
              </div>
              {Orden.fechaentrega && (
                <div>
                  <div className="text-sm text-muted-foreground">Fecha de Entrega</div>
                  <div className="font-medium">
                    {Orden.fechaentrega ? new Date(Orden.fechaentrega).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Fecha no disponible'}
                  </div>
                </div>
              )}
              {Orden.fecharecepcion && (
                <div>
                  <div className="text-sm text-muted-foreground">Fecha de Recepción</div>
                  <div className="font-medium">
                    {new Date(Orden.fecharecepcion).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Valor</div>
                <div className="font-medium">
                  {Orden.costo !== undefined && Orden.costo !== null ? Orden.costo.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : 'No disponible'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detalles del Servicio</h3>
              <ul className="list-disc pl-5 space-y-2">
                {Orden.catalogo_servicios && Orden.catalogo_servicios.length > 0 ? (
                  Orden.catalogo_servicios.map((servicio, index) => (
                    <li key={index}>{servicio.tp_servicio}</li>
                  ))
                ) : (
                  <li>No hay servicios disponibles</li>
                )}
              </ul>
            </div>

            {['Admin', 'Mechanic'].includes(userRole) && (
              <div className="mt-6 flex justify-end">
                <button
                  className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-gray-700'} rounded`}
                  onClick={() => setshowAddEstado(true)}
                >
                  Actualizar Orden
                </button>
                <button
                  className={`ml-2 px-4 py-2 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-gray-700'} rounded`}
                >
                  Agregar Nota
                </button>
              </div>
            )}
          </Card>

          <Modal isOpen={showAddEstado} onClose={() => setshowAddEstado(false)}>
            <h4 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Actualizar Orden
            </h4>
            <form>
              <div className="grid gap-4">
                <label htmlFor="estado" className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="">Seleccione Tipo</option>
                  {newEstado
                    .filter(tipo => tipo.nom_estado !== Orden?.estado_ot_id?.nom_estado)
                    .map(tipo => (
                      <option key={tipo.id} value={tipo.nom_estado}>{tipo.nom_estado}</option>
                    ))}
                </select>

                {formData.estado === 'Nueva Cotización' && (
                  <>
                    <label htmlFor="descripcion" className="text-sm font-medium">Descripción</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Ingrese descripción"
                      value={formData.descripcion}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />

                    <label htmlFor="fecharecepcion" className="text-sm font-medium">Fecha de Recepción</label>
                    <input
                      type="date"
                      id="fecharecepcion"
                      name="fecharecepcion"
                      value={formData.fecharecepcion}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />

                    <label htmlFor="fechaentrega" className="text-sm font-medium">Fecha de Entrega</label>
                    <input
                      type="date"
                      id="fechaentrega"
                      name="fechaentrega"
                      value={formData.fechaentrega}
                      onChange={handleChange}
                      className="p-2 border rounded"
                    />
                  </>
                )}
              </div>
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                Actualizar
              </button>
            </form>
          </Modal>


        </div>
      </div>
    </div>
  );
}
