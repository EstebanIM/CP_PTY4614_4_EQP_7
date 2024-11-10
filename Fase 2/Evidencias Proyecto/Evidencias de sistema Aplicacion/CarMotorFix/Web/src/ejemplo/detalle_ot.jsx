import { Button } from "../components/ui/button";
import { Card } from "../components/ui/tables/cards";
import { ChevronRight } from "lucide-react";

export default function WorkOrderDetails() {
  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" className="mb-6">
        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
        Volver
      </Button>

      <h1 className="text-3xl font-bold">Detalle de Orden de Trabajo</h1>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Orden #12345</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Cliente</div>
            <div className="font-medium">Juan Escobar</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Vehículo</div>
            <div className="font-medium">Honda Odyssey (XY-2789)</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Servicio</div>
            <div className="font-medium">Cambio de aceite</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Estado</div>
            <div className="font-medium text-yellow-600">En Progreso</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Fecha de Inicio</div>
            <div className="font-medium">15-05-2023</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Valor</div>
            <div className="font-medium">45,000</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Detalles del Servicio</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cambio de aceite de motor</li>
            <li>Reemplazo de filtro de aceite</li>
            <li>Revisión de niveles de fluidos</li>
            <li>Inspección visual de componentes</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="mr-2">Actualizar Estado</Button>
          <Button variant="outline">Agregar Nota</Button>
        </div>
      </Card>
    </div>
  );
}
