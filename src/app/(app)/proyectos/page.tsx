import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, GalleryHorizontalEnd } from "lucide-react";
import { ProyectosTable } from "@/modules/proyectos/components/proyectos-table";
import type { ProyectoConCliente } from "@/modules/proyectos/utils";

interface PageProps {
  searchParams: Promise<{ q?: string; estado?: string }>;
}

async function getProyectos(q?: string, estado?: string) {
  const supabase = createSupabaseClient();

  let query = supabase
    .from("proyectos")
    .select("*, clientes(nombre)");

  if (q) query = query.ilike("nombre", `%${q}%`);
  if (estado) query = query.eq("estado", estado as "Planeado" | "En progreso" | "Completado");

  const { data: proyectos } = await query
    .order("nombre")
    .returns<ProyectoConCliente[]>();

  if (!proyectos || proyectos.length === 0) {
    return { proyectos: [] as ProyectoConCliente[], avances: {} as Record<string, number> };
  }

  // Single query for all tasks — no N+1
  const { data: tareas } = await supabase
    .from("tareas")
    .select("proyecto_id, estado");

  const taskCounts = new Map<string, { total: number; completadas: number }>();
  for (const t of tareas ?? []) {
    const entry = taskCounts.get(t.proyecto_id) ?? { total: 0, completadas: 0 };
    entry.total++;
    if (t.estado === "Completada") entry.completadas++;
    taskCounts.set(t.proyecto_id, entry);
  }

  const avances: Record<string, number> = {};
  for (const p of proyectos) {
    const counts = taskCounts.get(p.id);
    avances[p.id] = counts ? Math.round((counts.completadas / counts.total) * 100) : 0;
  }

  return { proyectos, avances };
}

export default async function ProyectosPage({ searchParams }: PageProps) {
  const { q, estado } = await searchParams;
  const { proyectos, avances } = await getProyectos(q, estado === " " ? undefined : estado);

  return (
    <div>
      <PageHeader
        title="Proyectos"
        description="Plan, organize and monitor project execution."
        action={
          <div className="flex gap-2">
            <Link
              href="/proyectos/gantt"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <GalleryHorizontalEnd className="size-4" />
              Cronograma
            </Link>
            <Link
              href="/proyectos/nuevo"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="size-4" />
              Nuevo proyecto
            </Link>
          </div>
        }
      />
      <ProyectosTable
        proyectos={proyectos}
        avances={avances}
        searchQuery={q}
        estadoFilter={estado}
      />
    </div>
  );
}
