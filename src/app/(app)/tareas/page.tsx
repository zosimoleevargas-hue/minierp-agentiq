import { createSupabaseClient } from "@/lib/supabase/client";
import { KanbanPageClient } from "@/modules/tareas/components/kanban-page-client";
import type { TareaConRelaciones } from "@/modules/tareas/utils";
import type { Database, Prioridad } from "@/lib/supabase/types";

type ProyectoRow = Database["public"]["Tables"]["proyectos"]["Row"];
type EmpleadoRow = Database["public"]["Tables"]["empleados"]["Row"];

interface PageProps {
  searchParams: Promise<{ proyecto?: string; empleado?: string; prioridad?: string }>;
}

export default async function TareasPage({ searchParams }: PageProps) {
  const { proyecto, empleado, prioridad } = await searchParams;
  const supabase = createSupabaseClient();

  const tareasQuery = supabase
    .from("tareas")
    .select("*, proyectos(nombre), empleados(nombre)")
    .order("created_at", { ascending: false });

  if (proyecto) {
    tareasQuery.eq("proyecto_id", proyecto);
  }
  if (empleado === "ninguno") {
    tareasQuery.is("empleado_id", null);
  } else if (empleado) {
    tareasQuery.eq("empleado_id", empleado);
  }
  if (prioridad) {
    tareasQuery.eq("prioridad", prioridad as Prioridad);
  }

  const [tareasResult, proyectosResult, empleadosResult, asignacionesResult] =
    await Promise.all([
      tareasQuery,
      supabase.from("proyectos").select("id, nombre").order("nombre"),
      supabase.from("empleados").select("id, nombre").order("nombre"),
      supabase.from("proyecto_empleado").select("proyecto_id, empleado_id"),
    ]);

  return (
    <KanbanPageClient
      tareas={(tareasResult.data ?? []) as unknown as TareaConRelaciones[]}
      proyectos={(proyectosResult.data ?? []) as Pick<ProyectoRow, "id" | "nombre">[]}
      empleados={(empleadosResult.data ?? []) as Pick<EmpleadoRow, "id" | "nombre">[]}
      asignaciones={(asignacionesResult.data ?? [])}
      proyectoId={proyecto}
    />
  );
}
