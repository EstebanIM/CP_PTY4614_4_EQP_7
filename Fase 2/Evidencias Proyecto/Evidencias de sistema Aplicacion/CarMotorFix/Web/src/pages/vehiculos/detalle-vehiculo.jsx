import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams y useNavigate
import { fetcher } from '../../lib/strApi'; // Ajusta la ruta según tu estructura
import { getTokenFromLocalCookie } from '../../lib/cookies';

function DetalleVehiculo() {
    const { id } = useParams(); // useParams para obtener el ID desde la URL
    const navigate = useNavigate(); // useNavigate para redirigir
    const [vehiculo, setVehiculo] = useState(null);
    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

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
                    } catch (error) {
                        console.error('Error fetching vehicle details:', error);
                    }
                }
            }
        };

        fetchVehiculo();
    }, [id, STRAPI_URL]);

    const handleEditVehiculo = () => {
        // Lógica para editar vehículo
    };

    const handleDeleteVehiculo = async () => {
        const jwt = getTokenFromLocalCookie();
        if (jwt && vehiculo) {
            try {
                await fetcher(`${STRAPI_URL}/api/vehiculos/${vehiculo.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                navigate('/vehiculos'); // Redirige después de eliminar
            } catch (error) {
                console.error('Error deleting vehicle:', error);
            }
        }
    };

    if (!vehiculo) return <p>Cargando...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{vehiculo.modelo}</h1>
            <p>Patente: {vehiculo.patente}</p>
            <p>Año: {vehiculo.anio}</p> 
            <p>Kilometraje: {vehiculo.kilometraje}</p>
            <p>Motor: {vehiculo.motor}</p>
            <p>Color: {vehiculo.color}</p>

            <button onClick={handleEditVehiculo} className="px-4 py-2 bg-blue-600 text-white rounded mr-2">
                Editar
            </button>
            <button onClick={handleDeleteVehiculo} className="px-4 py-2 bg-red-600 text-white rounded">
                Eliminar
            </button>
        </div>
    );
}

export default DetalleVehiculo;
