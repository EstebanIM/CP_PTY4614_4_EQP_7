import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';

const Tablas = ({ servicio, handleViewTabla, columns }) => {
    const { darkMode } = useContext(DarkModeContext);

    if (!Array.isArray(servicio) || !Array.isArray(columns) || typeof handleViewTabla !== 'function') return null;

    return (
        <div className={`w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className="overflow-x-auto w-full">
                <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} hidden md:table`}>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.header}
                                    className={`px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}
                                >
                                    {column.header}
                                </th>
                            ))}
                            <th className="px-4 py-2 md:px-6 md:py-3"></th>
                        </tr>
                    </thead>
                    <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {servicio.map((item) => (
                            item ? (
                                <tr
                                    key={item.id}
                                    onClick={() => handleViewTabla(item)}
                                    className={`cursor-pointer hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={`px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-black'}`}
                                        >
                                            {column.render ? column.render(item) : (item[column.key] || 'N/A')}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 md:px-6 md:py-4 font-medium text-right pr-4">
                                        <ArrowRight className={`inline-block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                    </td>
                                </tr>
                            ) : null
                        ))}
                    </tbody>
                </table>

                {/* Vista móvil - Mostrar tarjetas */}
                <div className="md:hidden">
                    {servicio.map((item) => (
                        item ? (
                            <div
                                key={item.id}
                                onClick={() => handleViewTabla(item)}
                                className={`border rounded-lg p-4 mb-4 shadow-sm cursor-pointer hover:bg-gray-50 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                            >
                                {columns.map((column) => (
                                    <div key={column.key} className="mb-2">
                                        <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>{column.header}</p>
                                        <p className="text-sm">
                                            {column.render ? column.render(item) : (item[column.key] || 'N/A')}
                                        </p>
                                    </div>
                                ))}
                                <div className="text-right">
                                    <ArrowRight className={`inline-block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                </div>
                            </div>
                        ) : null
                    ))}
                </div>
            </div>
        </div>
    );
};

Tablas.propTypes = {
    servicio: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.oneOf([null])
    ]),
    handleViewTabla: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.oneOf([null])
    ]),
    columns: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                header: PropTypes.string.isRequired,
                key: PropTypes.string.isRequired,
                render: PropTypes.func
            })
        ),
        PropTypes.oneOf([null])
    ]),
};

export default Tablas;