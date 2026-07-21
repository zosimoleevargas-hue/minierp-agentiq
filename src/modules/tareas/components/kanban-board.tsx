"use client";

import { useState } from "react";
import { KanbanColumn } from "./kanban-column";
import { TareaSheet } from "./tarea-sheet";
import { DeleteTareaDialog } from "./delete-tarea-dialog";
import type { TareaConRelaciones, ProyectoRow, EmpleadoRow } from "../utils";

const COLUMNAS = [
  { key: "Pendiente", label: "Pendiente" },
  { key: "En progreso", label: "En progreso" },
  { key: "Completada", label: "Completada" },
];

interface KanbanBoardProps {
  tareas: TareaConRelaciones[];
  proyectos: Pick<ProyectoRow, "id" | "nombre">[];
  empleados: Pick<EmpleadoRow, "id" | "nombre">[];
  asignaciones: { proyecto_id: string; empleado_id: string }[];
  creando?: boolean;
  onCrearClose?: () => void;
}

export function KanbanBoard({
  tareas,
  proyectos,
  empleados,
  asignaciones,
  creando: creandoExterno,
  onCrearClose,
}: KanbanBoardProps) {
  const [editando, setEditando] = useState<TareaConRelaciones | null>(null);
  const [creandoInterno, setCreandoInterno] = useState(false);
  const [eliminando, setEliminando] = useState<TareaConRelaciones | null>(null);

  const creando = creandoExterno ?? creandoInterno;
  const handleCrearClose = onCrearClose ?? (() => setCreandoInterno(false));

  const agrupadas: Record<string, TareaConRelaciones[]> = {};
  for (const t of tareas) {
    if (!agrupadas[t.estado]) agrupadas[t.estado] = [];
    agrupadas[t.estado].push(t);
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {COLUMNAS.map((col) => (
          <KanbanColumn
            key={col.key}
            titulo={col.label}
            estado={col.key}
            tareas={agrupadas[col.key] ?? []}
            onEdit={setEditando}
            onDelete={setEliminando}
          />
        ))}
      </div>

      <TareaSheet
        open={creando}
        onOpenChange={handleCrearClose}
        proyectos={proyectos}
        empleados={empleados}
        asignaciones={asignaciones}
        mode="crear"
      />

      <TareaSheet
        open={!!editando}
        onOpenChange={(open) => { if (!open) setEditando(null); }}
        proyectos={proyectos}
        empleados={empleados}
        asignaciones={asignaciones}
        tarea={editando ?? undefined}
        mode="editar"
      />

      <DeleteTareaDialog
        tarea={eliminando}
        onClose={() => setEliminando(null)}
      />
    </>
  );
}
