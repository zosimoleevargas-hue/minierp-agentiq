"use client";

import { useState, Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KanbanFilters } from "./kanban-filters";
import { KanbanBoard } from "./kanban-board";
import type { TareaConRelaciones, ProyectoRow, EmpleadoRow } from "../utils";

interface KanbanPageClientProps {
  tareas: TareaConRelaciones[];
  proyectos: Pick<ProyectoRow, "id" | "nombre">[];
  empleados: Pick<EmpleadoRow, "id" | "nombre">[];
  asignaciones: { proyecto_id: string; empleado_id: string }[];
  proyectoId?: string;
}

export function KanbanPageClient({
  tareas,
  proyectos,
  empleados,
  asignaciones,
  proyectoId,
}: KanbanPageClientProps) {
  const [creando, setCreando] = useState(false);

  return (
    <div>
      <PageHeader
        title="Tareas"
        description="Track work using an intuitive Kanban workflow."
        action={
          <KanbanFilters
            proyectos={proyectos}
            empleados={empleados}
            asignaciones={asignaciones}
            proyectoId={proyectoId}
            onNuevaTarea={() => setCreando(true)}
          />
        }
      />

      <Suspense fallback={null}>
        <KanbanBoard
          tareas={tareas}
          proyectos={proyectos}
          empleados={empleados}
          asignaciones={asignaciones}
          creando={creando}
          onCrearClose={() => setCreando(false)}
        />
      </Suspense>
    </div>
  );
}
