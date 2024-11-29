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
import html2pdf from "html2pdf.js";

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
  const [showNota, setshowNota] = useState(false);
  const [newEstado, setNewEstado] = useState([]);
  const [notas, setNotas] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showAddValorizar, setshowAddValorizar] = useState(false);
  const [showupdateValorizar, setshowupdateValorizar] = useState(false);
  const [showAddServicio, setshowAddServicio] = useState(false);
  const [catalogoServicios, setCatalogoServicios] = useState([]);

  const [formData, setFormData] = useState({
    descripcion: '',
    fecharecepcion: '',
    fechaentrega: '',
    fecha_fin: '',
    costo_variable: '',
    catalogo_servicios: []
  });

  const [formNota, setFormNota] = useState({
    descripcion: ''
  });

  const [formValorizar, setFormValorizar] = useState({
    descripcion: '',
    puntuacion: ''
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
        // console.log(response.data);

        const ViewNotas = response.data.notas?.map((nota) => {
          return {
            id: nota.id,
            descripcion: nota.descripcion,
            mecanico: nota.mecanico.prim_nom + ' ' + nota.mecanico.prim_apell,
            fecha: new Date(nota.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          };
        });

        setNotas(ViewNotas);

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

  const fetchCatalogoServicios = async () => {
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        const response = await fetcher(`${STRAPI_URL}/api/catalogo-servicios`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });

        setCatalogoServicios(response.data || []);
        // console.log('Catalogo Servicios:', response.data);


      } catch (error) {
        console.error('Error fetching catalogo servicios:', error);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrden();
    fetchUserRole();
    fetchEstados();
    fetchCatalogoServicios();
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
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      if (userRole === 'Authenticated') {
        navigate('/mis-vehiculos');
      } else {
        navigate('/dashboard');
      }
    }
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

        setLoading(true);
        const EstadoData = {
          data: Object.fromEntries(
            Object.entries({
              estado_ot_id: formData.estado,
              descripcion: formData.descripcion,
              fecharecepcion: formData.fecharecepcion,
              fechaentrega: formData.fechaentrega
            }).filter(
              ([, value]) => value !== "" && value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)
            )
          )
        };

        const response = await fetch(`${STRAPI_URL}/api/orden-trabajos/${Orden.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(EstadoData),
        });

        if (!response.ok) {
          throw new Error(`Error al actualizar el Estado: ${response.statusText}`);
        }

        setFormData({
          descripcion: '',
          fecharecepcion: '',
          fechaentrega: '',
          catalogo_servicios: []
        });

        setshowAddEstado(false);
      } catch (error) {
        console.error('Error adding Estado:', error);
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
      // console.log('Orden actualizada exitosamente:', data);

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

  const handleChange = (e, formType = 'formData') => {
    const { name, value } = e.target;
    if (formType === 'formData') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'formNota') {
      setFormNota(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'formValorizar') {
      setFormValorizar(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitNota = async (e) => {
    e.preventDefault();

    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {

        setLoading(true);
        const updateNota = {
          data: {
            descripcion: formNota.descripcion,
            mecanico: Orden.mecanico_id.id,
            ot: Orden.id
          },
        };

        const response = await fetch(`${STRAPI_URL}/api/notas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(updateNota),
        });

        if (!response.ok) {
          throw new Error(`Error al agregar nota: ${response.statusText}`);
        }

        setFormNota({
          descripcion: ''
        });

        setshowNota(false);
      } catch (error) {
        console.error('Error al agregar nota:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleValorizar = async (e) => {
    e.preventDefault();

    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {

        setLoading(true);
        const updateValorizar = {
          data: {
            descripcion: formValorizar.descripcion,
            puntuacion: formValorizar.puntuacion,
            ot: Orden.id
          },
        };

        const response = await fetch(`${STRAPI_URL}/api/clasificacion-ots`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(updateValorizar),
        });

        if (!response.ok) {
          throw new Error(`Error al agregar Valorizacion: ${response.statusText}`);
        }

        setFormValorizar({
          descripcion: '',
          puntuacion: ''
        });

        setshowAddValorizar(false);
      } catch (error) {
        console.error('Error al agregar Valorizacion:', error);
      } finally {
        setLoading(false);
      }
    }

  };

  const handleModificarValorizar = async (e) => {
    e.preventDefault();
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {

        setLoading(true);
        const updateValorizar = {
          data: {
            descripcion: formValorizar.descripcion,
            puntuacion: formValorizar.puntuacion
          },
        };

        const response = await fetch(`${STRAPI_URL}/api/clasificacion-ots/${Orden.clasificacion_ot.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(updateValorizar),
        });

        if (!response.ok) {
          throw new Error(`Error al Actualizar Valorizacion: ${response.statusText}`);
        }

        setFormValorizar({
          descripcion: '',
          puntuacion: ''
        });

        setshowupdateValorizar(false);
      } catch (error) {
        console.error('Error al Actualizar Valorizacion:', error);
      } finally {
        setLoading(false);
      }
    }

  };

  const handleSubmitServicio = async (e) => {
    e.preventDefault();
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {

        setLoading(true);
        const EstadoData = {
          data: Object.fromEntries(
            Object.entries({
              estado_ot_id: formData.estado,
              descripcion: formData.descripcion,
              fecharecepcion: formData.fecharecepcion,
              fechaentrega: formData.fechaentrega,
              catalogo_servicios_id: formData.catalogo_servicios,
              costo_variable: formData.costo_variable,
              fecha_fin: formData.fecha_fin,
              orden_trabajos_id: Orden.id,
              fecha_inicio: new Date().toISOString()
            }).filter(
              ([, value]) => value !== "" && value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)
            )
          )
        };

        const NuevoTotal = Number(Orden.costo) + Number(formData.costo_variable);

        const TotalData = {
          data: {
            costo: NuevoTotal
          }
        };

        const response = await fetch(`${STRAPI_URL}/api/orden-trabajos/${Orden.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(TotalData),
        });

        const response2 = await fetch(`${STRAPI_URL}/api/ordentrabajo-catalogoservicios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(EstadoData),
        });

        if (!response.ok) {
          throw new Error(`Error al actualizar el costo: ${response.statusText}`);
        }

        if (!response2.ok) {
          throw new Error(`Error al agregar servicio: ${response2.statusText}`);

        }

        setFormData({
          descripcion: '',
          fecharecepcion: '',
          fechaentrega: '',
          costo_variable: '',
          fecha_fin: '',
          catalogo_servicios: []
        });

        setshowAddServicio(false);
      } catch (error) {
        console.error('Error adding Estado:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBoleta = () => {
    const element = document.getElementById("order-and-notes");
    const body = document.body;

    body.classList.add("pdf-hide-buttons", "pdf-light-mode");

    const options = {
      margin: 1,
      filename: "orden_de_trabajo.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .save()
      .finally(() => {
        body.classList.remove("pdf-hide-buttons", "pdf-light-mode");
      });
  };



  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="print:hidden">
        <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="print:hidden">
          <DashboardHeader toggleSidebar={toggleSidebar} />
        </div>
        <div id="order-and-notes" className="p-4 sm:p-6 flex flex-col">
          <div className="print:hidden flex flex-col sm:flex-row justify-between items-center mb-4">
            <Button onClick={handleBack} variant="outline" size="md" className="mb-2 sm:mb-0">Volver</Button>
            <h1 className={`text-2xl sm:text-4xl font-bold text-center sm:w-full ${darkMode ? 'text-white' : 'text-black'}`}>Detalle de Orden de Trabajo</h1>
          </div>

          <Card className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Orden #{Orden.id}</h2>
              <div className="print:hidden">
                {Orden.descripcion &&
                  ['Authenticated'].includes(userRole) &&
                  (Orden.estado_ot_id?.nom_estado === 'Cotizando' || Orden.estado_ot_id?.nom_estado === 'Nueva Cotización') &&
                  Orden.fechaentrega && (
                    <div className="space-x-4">
                      <button
                        className="px-4 py-2 bg-green-700 text-white rounded"
                        onClick={() => actualizarEstadoOrden(Orden.documentId, 2)} // 2 para "Aceptado"
                      >
                        Aceptar
                      </button>
                      <button
                        className="px-4 py-2 bg-red-700 text-white rounded"
                        onClick={() => actualizarEstadoOrden(Orden.documentId, 4)} // 4 para "Rechazado"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}

              </div>
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
              <div>
                <div className="text-sm text-muted-foreground">Valor</div>
                <div className="font-medium">
                  {Orden.costo !== undefined && Orden.costo !== null ? Orden.costo.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : 'No disponible'}
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
              {Orden.descripcion && (
                <div>
                  <div>
                    <div className="text-sm text-muted-foreground">Descripción</div>
                    <div className="font-medium">{Orden.descripcion}</div>
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
              {Orden.clasificacion_ot !== null && (
                <div>
                  <div className="text-sm text-muted-foreground">Valorización</div>
                  <div className="font-medium">
                    {Orden.clasificacion_ot?.puntuacion} - {Orden.clasificacion_ot?.descripcion}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detalles del Servicio</h3>
              <ul className="list-disc pl-5 space-y-2">
                {Orden.catalogo_servicios && Orden.catalogo_servicios.length > 0 ? (
                  Orden.catalogo_servicios.map((servicio, index) => (
                    <li key={index}>
                      {servicio.tp_servicio} - {servicio.costserv ? servicio.costserv.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : 'No disponible'}
                    </li>
                  ))
                ) : (
                  <li>No hay servicios disponibles</li>
                )}
              </ul>
            </div>

            {Orden.estado_ot_id?.nom_estado !== 'Finalizado' &&
              ['Admin', 'Mechanic'].includes(userRole) && (
                <div className="print:hidden mt-6 flex justify-end">
                  <button
                    className={`px-4 py-2 ${darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-black text-white hover:bg-gray-700'
                      } rounded`}
                    onClick={() => setshowAddServicio(true)}
                  >
                    Agregar Servicios
                  </button>
                  <button
                    className={`ml-2 px-4 py-2 ${darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-black text-white hover:bg-gray-700'
                      } rounded`}
                    onClick={() => setshowAddEstado(true)}
                  >
                    Actualizar Orden
                  </button>
                  <button
                    className={`ml-2 px-4 py-2 ${darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-black text-white hover:bg-gray-700'
                      } rounded`}
                    onClick={() => setshowNota(true)}
                  >
                    Agregar Nota
                  </button>
                </div>
              )}

            {Orden.estado_ot_id?.nom_estado === 'Finalizado' && (
              <div className="print:hidden mt-6 flex justify-end">
                {['Authenticated'].includes(userRole) && (
                  <>
                    {Orden.clasificacion_ot === null ? (
                      <button
                        className={`px-4 py-2 ${darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-black text-white hover:bg-gray-700'
                          } rounded`}
                        onClick={() => setshowAddValorizar(true)}
                      >
                        Valorizar
                      </button>
                    ) : (
                      <button
                        className={`px-4 py-2 ${darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-black text-white hover:bg-gray-700'
                          } rounded`}
                        onClick={() => setshowupdateValorizar(true)}
                      >
                        Modificar Valoriación
                      </button>
                    )}
                  </>
                )}

                <button
                  className={`print:hidden ml-2 px-4 py-2 ${darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-black text-white hover:bg-gray-700'
                    } rounded`}
                  onClick={handleBoleta}
                >
                  Generar detalle
                </button>
              </div>
            )}


          </Card>

          <div className={`rounded-lg shadow-md p-4 mt-6 sm:p-6 overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Notas de Mantenimiento</h3>
            <div className="min-w-full">
              {notas?.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                  <h4 className="text-xl">No hay Notas sobre esta Orden de trabajo.</h4>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Descripción
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mecánico
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notas?.map((nota) => (
                      <tr key={nota.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.descripcion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.mecanico}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.fecha}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <Modal isOpen={showAddServicio} onClose={() => setshowAddServicio(false)}>
            <h4 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Actualizar Orden
            </h4>
            <form onSubmit={handleSubmitServicio}>
              <div className="grid gap-4">
                <label htmlFor="catalogo_servicios" className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Catalogo Servicios
                </label>
                <select
                  id="catalogo_servicios"
                  name="catalogo_servicios"
                  value={formData.catalogo_servicios}
                  onChange={(e) => handleChange(e, 'formData')}
                  required
                  className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="">Seleccione Servicio</option>
                  {catalogoServicios.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>{tipo.tp_servicio}</option>
                  ))}
                </select>

                <label htmlFor="fecha_fin" className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Fecha fin
                </label>
                <input
                  id="fecha_fin"
                  name="fecha_fin"
                  type="date"
                  value={formData.fecha_fin || ""}
                  onChange={(e) => handleChange(e, 'formData')}
                  required
                  className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />

                <label htmlFor="costo_variable" className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Costo variable
                </label>
                <input
                  id="costo_variable"
                  name="costo_variable"
                  type="number"
                  value={formData.costo_variable || ""}
                  onChange={(e) => handleChange(e, 'formData')}
                  required
                  className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                Actualizar
              </button>
            </form>
          </Modal>

          <Modal isOpen={showAddEstado} onClose={() => setshowAddEstado(false)}>
            <h4 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Actualizar Orden
            </h4>
            <form onSubmit={handleSubmitEstado}>
              <div className="grid gap-4">
                <label htmlFor="estado" className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={(e) => handleChange(e, 'formData')}
                  required
                  className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="">Seleccione Tipo</option>
                  {newEstado
                    .filter(
                      tipo => tipo.nom_estado !== 'Aceptado' && tipo.nom_estado !== 'Rechazado' && tipo.nom_estado !== Orden?.estado_ot_id?.nom_estado
                    )
                    .map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nom_estado}</option>
                    ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowAdditionalFields(!showAdditionalFields)}
                  className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  {showAdditionalFields ? 'Ocultar Información Adicional' : 'Agregar Información Adicional'}
                </button>

                {showAdditionalFields && (
                  <>
                    <label htmlFor="descripcion" className="text-sm font-medium">Descripción</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Ingrese descripción"
                      value={formData.descripcion}
                      onChange={(e) => handleChange(e, 'formData')}
                      className="p-2 border rounded"
                    />

                    <label htmlFor="fecharecepcion" className="text-sm font-medium">Fecha de Recepción</label>
                    <input
                      type="date"
                      id="fecharecepcion"
                      name="fecharecepcion"
                      value={formData.fecharecepcion}
                      onChange={(e) => handleChange(e, 'formData')}
                      className="p-2 border rounded"
                    />

                    <label htmlFor="fechaentrega" className="text-sm font-medium">Fecha de Entrega</label>
                    <input
                      type="date"
                      id="fechaentrega"
                      name="fechaentrega"
                      value={formData.fechaentrega}
                      onChange={(e) => handleChange(e, 'formData')}
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

          <Modal isOpen={showNota} onClose={() => setshowNota(false)}>
            <h4 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Agregar Nota
            </h4>
            <form onSubmit={handleSubmitNota}>
              <div className="grid gap-4">
                <label htmlFor="descripcion" className="text-sm font-medium">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Ingrese descripción"
                  value={formNota.descripcion}
                  onChange={(e) => handleChange(e, 'formNota')}
                  className="p-2 border rounded"
                />
              </div>
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                Agregar
              </button>
            </form>
          </Modal>

          <Modal isOpen={showAddValorizar} onClose={() => setshowAddValorizar(false)}>
            <h4 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Agregar Valorizador
            </h4>
            <form onSubmit={handleValorizar}>
              <div className="grid gap-4">
                <label htmlFor="puntuacion" className="text-sm font-medium">Puntuación</label>
                <input
                  id="puntuacion"
                  name="puntuacion"
                  type="number"
                  placeholder="Ingrese puntuación"
                  value={formValorizar.puntuacion}
                  onChange={(e) => handleChange(e, 'formValorizar')}
                  className="p-2 border rounded"
                />
                <label htmlFor="descripcion" className="text-sm font-medium">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Ingrese descripción"
                  value={formValorizar.descripcion}
                  onChange={(e) => handleChange(e, 'formValorizar')}
                  className="p-2 border rounded"
                />
              </div>
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                Agregar
              </button>
            </form>
          </Modal>

          <Modal isOpen={showupdateValorizar} onClose={() => setshowupdateValorizar(false)}>
            <h4 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Agregar Valorizador
            </h4>
            <form onSubmit={handleModificarValorizar}>
              <div className="grid gap-4">
                <label htmlFor="puntuacion" className="text-sm font-medium">Puntuación</label>
                <input
                  id="puntuacion"
                  name="puntuacion"
                  type="number"
                  placeholder={Orden.clasificacion_ot?.puntuacion || 'Ingrese puntuación'}
                  value={formValorizar.puntuacion}
                  onChange={(e) => handleChange(e, 'formValorizar')}
                  className="p-2 border rounded"
                />
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder={Orden.clasificacion_ot?.descripcion || 'Ingrese descripción'}
                  value={formValorizar.descripcion}
                  onChange={(e) => handleChange(e, 'formValorizar')}
                  className="p-2 border rounded"
                />
              </div>
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                Modificar
              </button>
            </form>
          </Modal>

        </div>
      </div >
    </div >
  );
}
