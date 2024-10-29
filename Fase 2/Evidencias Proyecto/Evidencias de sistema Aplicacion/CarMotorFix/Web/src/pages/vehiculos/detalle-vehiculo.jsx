import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import DashboardSidebar from '../../components/menu/DashboardSidebar'; 
import DashboardHeader from '../../components/menu/DashboardHeader';  
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

function DetalleVehiculo() {
    const { id } = useParams();
    const [vehiculo, setVehiculo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehiculo = async () => {
            if (id) {
                const jwt = getTokenFromLocalCookie();
                if (jwt) {
                    try {
                        const response = await fetcher(`${STRAPI_URL}/api/vehiculos/${id}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${jwt}`,
                            },
                        });
                        setVehiculo(response.data);
                        setEditData(response.data);
                    } catch (error) {
                        console.error('Error fetching vehicle details:', error);
                    }
                }
            }
        };

        fetchVehiculo();
    }, [id, STRAPI_URL]);

    const handleBack = () => {
        navigate('/dashboard'); 
    };

    const handleEditClick = () => {
        setIsEditing(true); // Habilita el modo de edición
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const jwt = getTokenFromLocalCookie();
        try {
            const response = await fetcher(`${STRAPI_URL}/api/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ data: editData }),
            });
            setVehiculo(response.data); // Actualiza los datos del vehículo
            setIsEditing(false); // Sale del modo de edición
        } catch (error) {
            console.error('Error updating vehicle:', error);
        }
    };

    if (!vehiculo) return <p className="text-center text-lg text-gray-600">Cargando detalles del vehículo...</p>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <DashboardSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <DashboardHeader />

                {/* Contenido principal */}
                <div className="p-6 flex-col">
                    {/* Botón Volver y Nombre del Vehículo */}
                    <div className="flex justify-between items-center mb-4">
                        <Button
                            onClick={handleBack}
                            variant="outline" 
                            size="md"
                        >
                            Volver
                        </Button>
                        <h1 className="text-4xl font-bold text-black text-center w-full">{vehiculo.modelo}</h1>
                    </div>

                    {/* Cuadro de información del vehículo */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        {!isEditing ? (
                            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                <p><strong>Kilometraje:</strong> {vehiculo.kilometraje}</p>
                                <p><strong>Marca:</strong> {vehiculo.marca}</p>
                                <p><strong>Patente:</strong> {vehiculo.patente}</p>
                                <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                                <p><strong>Color:</strong> {vehiculo.color}</p>
                                <p><strong>Motor:</strong> {vehiculo.motor}</p>

                                {/* Botón Modificar */}
                                <div className="col-span-3 flex justify-start">
                                    <Button
                                        onClick={handleEditClick}
                                        variant="default"
                                        size="md"
                                    >
                                        Modificar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                <div>
                                    <label><strong>Kilometraje:</strong></label>
                                    <p className="w-full p-2 border rounded bg-gray-100">{editData.kilometraje}</p>
                                </div>
                                <div>
                                    <label><strong>Marca:</strong></label>
                                    <p className="w-full p-2 border rounded bg-gray-100">{editData.marca}</p>
                                </div>
                                <div>
                                    <label><strong>Patente:</strong></label>
                                    <p className="w-full p-2 border rounded bg-gray-100">{editData.patente}</p>
                                </div>
                                <div>
                                    <label><strong>Modelo:</strong></label>
                                    <p className="w-full p-2 border rounded bg-gray-100">{editData.modelo}</p>
                                </div>
                                <div>
                                    <label><strong>Color:</strong></label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={editData.color}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label><strong>Motor:</strong></label>
                                    <input
                                        type="text"
                                        name="motor"
                                        value={editData.motor}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                {/* Botón Guardar */}
                                <div className="col-span-3 flex justify-start">
                                    <Button
                                        onClick={handleSave}
                                        variant="default"
                                        size="md"
                                    >
                                        Guardar
                                    </Button>
                                </div>
                            </div>

                        )}
                    </div>

                    {/* Historial de Mantenimiento */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Historial de Mantenimiento</h3>
                        <table className="w-full text-left table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">#</th>
                                    <th className="border px-4 py-2">Fecha</th>
                                    <th className="border px-4 py-2">Tipo de mantención</th>
                                    <th className="border px-4 py-2">Detalle de la mantención</th>
                                    <th className="border px-4 py-2">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehiculo.historialMantenimiento && vehiculo.historialMantenimiento.map((mantenimiento, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{mantenimiento.fecha}</td>
                                        <td className="border px-4 py-2">{mantenimiento.tipo}</td>
                                        <td className="border px-4 py-2">{mantenimiento.detalle}</td>
                                        <td className="border px-4 py-2">{mantenimiento.valor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleVehiculo;
