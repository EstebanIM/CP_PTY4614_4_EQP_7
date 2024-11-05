import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';

const Tablas = ({
    servicio,
    handleViewTabla,
    columns
}) => {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {column.header}
                        </th>
                    ))}
                    <th className="px-6 py-3"></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {servicio.map((servicio) => (
                    <tr
                        key={servicio.id}
                        onClick={() => handleViewTabla(servicio)}
                        className="cursor-pointer hover:bg-gray-100"
                    >
                        {columns.map((column) => (
                            <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                {column.render ? column.render(servicio) : servicio[column.key]}
                            </td>
                        ))}
                        <td className="px-6 py-4 font-medium text-right pr-4">
                            <ArrowRight className="inline-block" />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
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
