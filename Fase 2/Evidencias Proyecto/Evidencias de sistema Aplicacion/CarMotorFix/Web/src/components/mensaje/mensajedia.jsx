import { useState, useEffect } from 'react';
import consejosDeAuto from '../../lib/consejos.json';

const ConsejoAutoDelDia = () => {
    const [consejo, setConsejo] = useState("");

    useEffect(() => {
        const indice = new Date().getDate() % consejosDeAuto.length;
        setConsejo(consejosDeAuto[indice]);
    }, []);

    return (
        <div className="flex justify-center">
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Consejo del Día para el Cuidado del Auto</h2>
                <p className="text-gray-600 text-lg">{consejo}</p>
            </div>
        </div>
    );
};

export default ConsejoAutoDelDia;
