import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, ArrowLeft } from "lucide-react";
import { EmpleadoDetail } from "@/modules/empleados/components/empleado-detail";
import type { EmpleadoRow, ProyectoRow, TareaRow } from "@/modules/empleados/utils";

async function getEmpleado(
  id: string,
): Promise<{ empleado: EmpleadoRow; proyectos: ProyectoRow[]; tareas: TareaRow[] } | null> {
  const supabase = createSupabaseClient();

  const { data: empleado } = await supabase
    .from("empleados")
    .select("*")
    .eq("id", id)
    .single();

  if (!empleado) return null;

  const { data: asignaciones } = await supabase
    .from("proyecto_empleado")
    .select("proyecto_id")
    .eq("empleado_id", id);

  const proyectoIds = (asignaciones ?? []).map((a: { proyecto_id: string }) => a.proyecto_id);

  let proyectos: ProyectoRow[] = [];
  if (proyectoIds.length > 0) {
    const { data } = await supabase
      .from("proyectos")
      .select("id, nombre, estado")
      .in("id", proyectoIds);
    proyectos = (data ?? []) as ProyectoRow[];
  }

  const { data: tareas } = await supabase
    .from("tareas")
    .select("*")
    .eq("empleado_id", id)
    .in("estado", ["Pendiente", "En progreso"]);

  return {
    empleado,
    proyectos,
    tareas: (tareas ?? []) as TareaRow[],
  };
}

export default async function EmpleadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getEmpleado(id);

  if (!result) notFound();

  return (
    <div>
      <PageHeader
        title={result.empleado.nombre}
        description={result.empleado.rol}
        action={
          <div className="flex gap-2">
            <Link
              href="/empleados"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <ArrowLeft className="size-4" />
              Volver
            </Link>
            <Link
              href={`/empleados/${id}/editar`}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Pencil className="size-4" />
              Editar
            </Link>
          </div>
        }
      />
      <EmpleadoDetail
        empleado={result.empleado}
        proyectos={result.proyectos}
        tareas={result.tareas}
      />
    </div>
  );
}
