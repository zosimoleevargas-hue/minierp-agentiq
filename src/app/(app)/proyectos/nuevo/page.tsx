import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { ProyectoForm } from "@/modules/proyectos/components/proyecto-form";
import type { ClienteRow, EmpleadoRow } from "@/modules/proyectos/utils";

export const dynamic = "force-dynamic";

async function getFormData() {
  const supabase = createSupabaseClient();

  const { data: clientes } = await supabase
    .from("clientes")
    .select("id, nombre")
    .order("nombre")
    .returns<Pick<ClienteRow, "id" | "nombre">[]>();

  const { data: empleados } = await supabase
    .from("empleados")
    .select("id, nombre, email, rol")
    .eq("estado", "Activo")
    .order("nombre")
    .returns<Pick<EmpleadoRow, "id" | "nombre" | "email" | "rol">[]>();

  return {
    clientes: (clientes ?? []) as ClienteRow[],
    empleados: (empleados ?? []) as EmpleadoRow[],
  };
}

export default async function NuevoProyectoPage() {
  const { clientes, empleados } = await getFormData();

  return (
    <div>
      <PageHeader
        title="Nuevo proyecto"
        description="Registra un nuevo proyecto"
      />
      <ProyectoForm clientes={clientes} empleados={empleados} />
    </div>
  );
}
