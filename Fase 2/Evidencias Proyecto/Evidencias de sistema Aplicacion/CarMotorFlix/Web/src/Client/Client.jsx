function Client() {

  return (
    <>
      <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Mantenimiento de Autos</h1>

        <div className='grid gap-4 md:grid-cols-2'>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Mis Autos</h3>
              <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700">
                Agregar
              </button>
            </div>

            <div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca - Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patente - Año
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="cursor-pointer hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">Hyundai Accent</td>
                    <td className="px-6 py-4 whitespace-nowrap">ABCD23 - 2011</td>
                    <td className="px-6 py-4 font-medium">
                      Ver
                    </td>
                  </tr>
                  <tr className="cursor-pointer hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">Honda Odyssey</td>
                    <td className="px-6 py-4 whitespace-nowrap">XY2789 - 2010</td>
                    <td className="px-6 py-4 font-medium">
                      Ver
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Mis Cotizaciones</h3>
              <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700">
                Solicitar
              </button>
            </div>

            <div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="cursor-pointer hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">Mantenimiento General</td>
                    <td className="px-6 py-4 whitespace-nowrap">99.990</td>
                    <td className="px-6 py-4 font-medium">
                      Ver
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Client

