import { notFound } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { EmpleadoForm } from "@/modules/empleados/components/empleado-form";
import type { EmpleadoInput } from "@/modules/empleados/schemas/empleado-schema";

async function getEmpleado(id: string): Promise<EmpleadoInput | null> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("empleados")
    .select("nombre, email, rol, estado")
    .eq("id", id)
    .single();

  return data;
}

export default async function EditarEmpleadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empleado = await getEmpleado(id);

  if (!empleado) notFound();

  return (
    <div>
      <PageHeader
        title="Editar empleado"
      />
      <EmpleadoForm defaultValues={empleado} empleadoId={id} />
    </div>
  );
}
