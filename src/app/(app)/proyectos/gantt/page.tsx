import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { GanttChart } from "@/modules/proyectos/components/gantt-chart";
import type { ProyectoRow } from "@/modules/proyectos/utils";

async function getProyectos() {
  const supabase = createSupabaseClient();

  const { data } = await supabase
    .from("proyectos")
    .select("id, nombre, fecha_inicio, fecha_entrega, estado")
    .order("fecha_inicio");

  return (data ?? []) as ProyectoRow[];
}

export default async function GanttPage() {
  const proyectos = await getProyectos();

  return (
    <div>
      <PageHeader
        title="Cronograma (Gantt)"
        description="Línea de tiempo de proyectos"
      />
      <GanttChart proyectos={proyectos} />
    </div>
  );
}
