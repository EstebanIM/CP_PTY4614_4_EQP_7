import { ArrowDown, ArrowUp, FileText, Loader2, Clock } from 'lucide-react';
import PropTypes from 'prop-types';

function StatCard({ title, value, icon, trend }) {
    StatCard.propTypes = {
        title: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        icon: PropTypes.element.isRequired,
        trend: PropTypes.shape({
            value: PropTypes.number,
            isPositive: PropTypes.bool
        })
    };
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:bg-gray-900 dark:border-gray-800">
            <div className="p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {title}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        {icon}
                    </div>

                    <div className="flex items-center space-x-2">
                        <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {value !== undefined ? value.toLocaleString() : "N/A"}
                        </h3>
                        {trend && (
                            <span
                                className={`flex items-center space-x-1 text-sm font-medium ${trend.isPositive ? "text-green-500" : "text-red-500"
                                    }`}
                            >
                                {trend.isPositive ? (
                                    <ArrowUp className="h-4 w-4" />
                                ) : (
                                    <ArrowDown className="h-4 w-4" />
                                )}
                                <span>{Math.abs(trend.value)}%</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>


    );
}
DashboardStats.propTypes = {
    TotalCotizaciones: PropTypes.shape({
        actual: PropTypes.number,
        pasado: PropTypes.number
    }),
    TotalOrdenes: PropTypes.shape({
        actual: PropTypes.number,
        pasado: PropTypes.number
    }),
    TotalPendientes: PropTypes.shape({
        actual: PropTypes.number,
        pasado: PropTypes.number
    })
};

export default function DashboardStats({ TotalCotizaciones, TotalOrdenes, TotalPendientes }) {
    const actualQuotes = TotalCotizaciones?.actual;
    const pastQuotes = TotalCotizaciones?.pasado;

    const quotesTrend = (actualQuotes !== undefined && pastQuotes !== undefined && pastQuotes !== 0)
        ? ((actualQuotes - pastQuotes) / pastQuotes) * 100
        : undefined;

    const actualOrders = TotalOrdenes?.actual;
    const pastOrders = TotalOrdenes?.pasado;

    const ordersTrend = (actualOrders !== undefined && pastOrders !== undefined && pastOrders !== 0)
        ? ((actualOrders - pastOrders) / pastOrders) * 100
        : undefined;

    const actualPending = TotalPendientes?.actual;
    const pastPending = TotalPendientes?.pasado;

    const pendingTrend = (actualPending !== undefined && pastPending !== undefined && pastPending !== 0)
        ? ((actualPending - pastPending) / pastPending) * 100
        : undefined;
    console.log(quotesTrend, ordersTrend, pendingTrend);
    
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
                title="Cotizaciones"
                value={actualQuotes}
                icon={<FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
                trend={quotesTrend !== undefined ? {
                    value: Math.round(quotesTrend),
                    isPositive: quotesTrend > 0
                } : undefined}
            />
            <StatCard
                title="Órdenes Activas"
                value={actualOrders}
                icon={<Loader2 className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
                trend={ordersTrend !== undefined ? {
                    value: Math.round(ordersTrend),
                    isPositive: ordersTrend > 0
                } : undefined}
            />
            <StatCard
                title="Órdenes Pendientes"
                value={actualPending}
                icon={<Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
                trend={pendingTrend !== undefined ? {
                    value: Math.round(pendingTrend),
                    isPositive: pendingTrend > 0
                } : undefined}
            />
        </div>
    );
}
