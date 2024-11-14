import { useState, useEffect } from 'react';
import consejosDeAuto from '../../lib/consejos.json';
import { getDarkModeFromLocalCookie } from '../../lib/cookies';

const ConsejoAutoDelDia = () => {
    const [consejo, setConsejo] = useState("");
    const [darkMode, setDarkMode] = useState(getDarkModeFromLocalCookie());

    useEffect(() => {
        const indice = new Date().getDate() % consejosDeAuto.length;
        setConsejo(consejosDeAuto[indice]);

        setDarkMode(getDarkModeFromLocalCookie());
    }, []);

    return (
        <div className="flex justify-center">
            <div className={`max-w-sm p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border border-gray-200 rounded-lg shadow-lg`}>
                <h2 className="text-2xl font-bold mb-4">Consejo del Día para el Cuidado del Auto</h2>
                <p className="text-lg">{consejo}</p>
            </div>
        </div>
    );
};

export default ConsejoAutoDelDia;
