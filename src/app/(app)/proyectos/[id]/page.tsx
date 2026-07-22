import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, ArrowLeft } from "lucide-react";
import { ProyectoDetail } from "@/modules/proyectos/components/proyecto-detail";
import type { ProyectoRow, ClienteRow, EmpleadoRow, TareaRow } from "@/modules/proyectos/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProyecto(id: string) {
  const supabase = createSupabaseClient();

  const { data: proyecto } = await supabase
    .from("proyectos")
    .select("*, clientes(nombre)")
    .eq("id", id)
    .single();

  if (!proyecto) return null;

  const { data: asignaciones } = await supabase
    .from("proyecto_empleado")
    .select("empleado_id")
    .eq("proyecto_id", id);

  const empleadoIds = (asignaciones ?? []).map((a) => a.empleado_id);

  let empleados: EmpleadoRow[] = [];
  if (empleadoIds.length > 0) {
    const { data } = await supabase
      .from("empleados")
      .select("*")
      .in("id", empleadoIds);
    empleados = (data ?? []) as EmpleadoRow[];
  }

  const { data: tareas } = await supabase
    .from("tareas")
    .select("*")
    .eq("proyecto_id", id);

  const tareasList = (tareas ?? []) as TareaRow[];

  const total = tareasList.length;
  const completadas = tareasList.filter((t) => t.estado === "Completada").length;
  const avance = total > 0 ? Math.round((completadas / total) * 100) : 0;

  return {
    proyecto: proyecto as ProyectoRow & { clientes: Pick<ClienteRow, "nombre"> | null },
    empleados,
    tareas: tareasList,
    avance,
  };
}

export default async function ProyectoPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getProyecto(id);

  if (!result) notFound();

  return (
    <div>
      <PageHeader
        title={result.proyecto.nombre}
        action={
          <div className="flex gap-2">
            <Link
              href="/proyectos"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <ArrowLeft className="size-4" /> Volver
            </Link>
            <Link
              href={`/proyectos/${id}/editar`}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Pencil className="size-4" /> Editar
            </Link>
          </div>
        }
      />
      <ProyectoDetail
        proyecto={result.proyecto}
        empleados={result.empleados}
        tareas={result.tareas}
        avance={result.avance}
      />
    </div>
  );
}
