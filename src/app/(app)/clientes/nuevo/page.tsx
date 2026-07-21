import { PageHeader } from "@/components/shared/page-header";
import { ClienteForm } from "@/modules/clientes/components/cliente-form";

export default function NuevoClientePage() {
  return (
    <div>
      <PageHeader
        title="Nuevo cliente"
        description="Registra un nuevo cliente"
      />
      <ClienteForm />
    </div>
  );
}
