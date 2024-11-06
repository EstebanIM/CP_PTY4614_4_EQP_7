import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Tablas = ({
    servicio,
    handleViewTabla,
    columns
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Calcular el número total de páginas
    const totalPages = Math.ceil(servicio.length / itemsPerPage);

    // Calcular el rango de elementos a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = servicio.slice(startIndex, endIndex);

    // Función para cambiar de página
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.header} className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {column.header}
                                </th>
                            ))}
                            <th className="px-4 py-2 md:px-6 md:py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((servicio) => (
                            <tr
                                key={servicio.id}
                                onClick={() => handleViewTabla(servicio)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm">
                                        {column.render ? column.render(servicio) : (servicio[column.key] || 'N/A')}
                                    </td>
                                ))}
                                <td className="px-4 py-2 md:px-6 md:py-4 font-medium text-right pr-4">
                                    <ArrowRight className="inline-block" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="text-sm">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

Tablas.propTypes = {
    servicio: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleViewTabla: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            render: PropTypes.func
        })
    ).isRequired
};

export default Tablas;
