import { useState, useEffect, useContext } from 'react';
import consejosDeAuto from '../../lib/consejos.json';
import { DarkModeContext } from '../../context/DarkModeContext';

const ConsejoAutoDelDia = () => {
    const { darkMode } = useContext(DarkModeContext);
    const [consejo, setConsejo] = useState("");

    useEffect(() => {
        const indice = new Date().getDate() % consejosDeAuto.length;
        setConsejo(consejosDeAuto[indice]);
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