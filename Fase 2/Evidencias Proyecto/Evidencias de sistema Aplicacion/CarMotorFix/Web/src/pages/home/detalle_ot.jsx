import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/tables/cards";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../lib/strApi";
import { useParams } from "react-router-dom";
import { getTokenFromLocalCookie } from "../../lib/cookies";
import DashboardHeader from "../../components/menu/DashboardHeader";
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import Loading from "../../components/animation/loading";

export default function WorkOrderDetails() {
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [Orden, setOrden] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);
  const [VehiculoID, setVehiculoID] = useState(null);
  const [loading, setLoading] = useState(true);

  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

  const fetchOrden = async () => {
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        const response = await fetcher(`${STRAPI_URL}/api/orden-trabajos/${id}?populate=*`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });

        setOrden(response.data);
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

        return response.data.role;
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

  useEffect(() => {
    setLoading(true);
    fetchOrden();
    fetchUserRole();
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

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <div className="p-4 sm:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <Button onClick={handleBack} variant="outline" size="md" className="mb-2 sm:mb-0">Volver</Button>
            <h1 className="text-2xl sm:text-4xl font-bold text-black text-center sm:w-full">Detalle de Orden de Trabajo</h1>
          </div>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Orden #{Orden.id}</h2>
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

            <div className="mt-6 flex justify-end">
              <Button className="mr-2">Actualizar Estado</Button>
              <Button variant="outline">Agregar Nota</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
