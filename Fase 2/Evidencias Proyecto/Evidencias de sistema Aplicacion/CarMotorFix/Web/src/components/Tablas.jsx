import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';

const Tablas = ({ servicio, handleViewTabla, columns }) => {
    if (!Array.isArray(servicio)) return null;
    if (!Array.isArray(columns)) return null;
    if (typeof handleViewTabla !== 'function') return null;

    return (
        <div className="w-full">
            <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.header}
                                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                            <th className="px-4 py-2 md:px-6 md:py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {servicio.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => handleViewTabla(item)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm"
                                    >
                                        {column.render ? column.render(item) : (item[column.key] || 'N/A')}
                                    </td>
                                ))}
                                <td className="px-4 py-2 md:px-6 md:py-4 font-medium text-right pr-4">
                                    <ArrowRight className="inline-block" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile view - Display cards */}
                <div className="md:hidden">
                    {servicio.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleViewTabla(item)}
                            className="border rounded-lg p-4 mb-4 shadow-sm cursor-pointer hover:bg-gray-50"
                        >
                            {columns.map((column) => (
                                <div key={column.key} className="mb-2">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">{column.header}</p>
                                    <p className="text-sm">
                                        {column.render ? column.render(item) : (item[column.key] || 'N/A')}
                                    </p>
                                </div>
                            ))}
                            <div className="text-right">
                                <ArrowRight className="inline-block text-gray-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

Tablas.propTypes = {
    servicio: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.null
    ]),
    handleViewTabla: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.null
    ]),
    columns: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                header: PropTypes.string.isRequired,
                key: PropTypes.string.isRequired,
                render: PropTypes.func
            })
        ),
        PropTypes.null
    ]),
};

export default Tablas;
