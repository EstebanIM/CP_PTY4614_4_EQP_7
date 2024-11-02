import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import DashboardHeader from "../../components/menu/DashboardHeader";
import { Button } from '../../components/ui/button';
import LoadingComponent from '../../components/animation/loading';

function DetalleServicio() {
    const { id } = useParams();
    const [servicio, setServicio] = useState(null);
    const navigate = useNavigate();
    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

    useEffect(() => {
        const fetchServicio = async () => {
            if (id) {
                const jwt = getTokenFromLocalCookie();
                if (jwt) {
                    try {
                        const response = await fetcher(`${STRAPI_URL}/api/catalogo-servicios/${id}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${jwt}`,
                            },
                        });
                        setServicio(response.data);
                    } catch (error) {
                        console.error('Error fetching service details:', error);
                    }
                }
            }
        };

        fetchServicio();
    }, [id, STRAPI_URL]);

    if (!servicio) return <LoadingComponent />;

    return (
        <div className="flex h-screen">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">{servicio.tp_servicio}</h1>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p><strong>Descripción:</strong> {servicio.descripcion}</p>
                        <p><strong>Costo:</strong> ${servicio.costserv}</p>
                        <Button onClick={() => navigate(-1)} className="mt-4">
                            Volver
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleServicio;