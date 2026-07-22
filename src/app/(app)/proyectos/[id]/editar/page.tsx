import { notFound } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { ProyectoForm } from "@/modules/proyectos/components/proyecto-form";
import type { ProyectoInput } from "@/modules/proyectos/schemas/proyecto-schema";
import type { ClienteRow, EmpleadoRow } from "@/modules/proyectos/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProyecto(id: string) {
  const supabase = createSupabaseClient();

  const { data: proyecto } = await supabase
    .from("proyectos")
    .select("*")
    .eq("id", id)
    .single();

  if (!proyecto) return null;

  const { data: asignaciones } = await supabase
    .from("proyecto_empleado")
    .select("empleado_id")
    .eq("proyecto_id", id);

  const empleadoIds = (asignaciones ?? []).map((a) => a.empleado_id);

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
    defaultValues: {
      nombre: proyecto.nombre,
      cliente_id: proyecto.cliente_id,
      descripcion: proyecto.descripcion ?? "",
      fecha_inicio: proyecto.fecha_inicio,
      fecha_entrega: proyecto.fecha_entrega,
      prioridad: proyecto.prioridad ?? undefined,
      estado: proyecto.estado,
      empleado_ids: empleadoIds,
    } as ProyectoInput,
    clientes: (clientes ?? []) as ClienteRow[],
    empleados: (empleados ?? []) as EmpleadoRow[],
  };
}

export default async function EditarProyectoPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getProyecto(id);

  if (!result) notFound();

  return (
    <div>
      <PageHeader
        title="Editar proyecto"
      />
      <ProyectoForm
        clientes={result.clientes}
        empleados={result.empleados}
        defaultValues={result.defaultValues}
        proyectoId={id}
      />
    </div>
  );
}
