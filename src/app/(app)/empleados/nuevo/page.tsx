import { PageHeader } from "@/components/shared/page-header";
import { EmpleadoForm } from "@/modules/empleados/components/empleado-form";

export default function NuevoEmpleadoPage() {
  return (
    <div>
      <PageHeader
        title="Nuevo empleado"
      />
      <EmpleadoForm />
    </div>
  );
}
