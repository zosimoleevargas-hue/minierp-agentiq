import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { GanttChart } from "@/modules/proyectos/components/gantt-chart";
import type { ProyectoRow } from "@/modules/proyectos/utils";

export const dynamic = "force-dynamic";

async function getProyectos(): Promise<ProyectoRow[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("proyectos")
    .select("id, nombre, fecha_inicio, fecha_entrega, estado")
    .order("fecha_inicio");

  if (error) throw new Error(`Error al cargar proyectos: ${error.message}`);

  return data as ProyectoRow[];
}

export default async function GanttPage() {
  const proyectos = await getProyectos();

  return (
    <div>
      <PageHeader
        title="Cronograma (Gantt)"
      />
      <GanttChart proyectos={proyectos} />
    </div>
  );
}
