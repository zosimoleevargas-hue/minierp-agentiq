"use client";

import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./task-card";
import type { TareaConRelaciones } from "../utils";

interface KanbanColumnProps {
  titulo: string;
  estado: string;
  tareas: TareaConRelaciones[];
  onEdit: (tarea: TareaConRelaciones) => void;
  onDelete: (tarea: TareaConRelaciones) => void;
}

const COLOR_MAP: Record<string, string> = {
  Pendiente: "bg-amber-50 border-amber-200",
  "En progreso": "bg-teal-50 border-teal-200",
  Completada: "bg-green-50 border-green-200",
};

const BADGE_VARIANT_MAP: Record<string, "default" | "secondary" | "outline"> = {
  Pendiente: "secondary",
  "En progreso": "outline",
  Completada: "default",
};

export function KanbanColumn({
  titulo,
  estado,
  tareas,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  return (
    <div
      className={`flex min-h-[300px] flex-1 flex-col gap-3 rounded-lg border p-3 ${COLOR_MAP[estado] ?? "bg-muted"}`}
    >
      <div className="flex items-center gap-2">
        <Badge variant={BADGE_VARIANT_MAP[estado] ?? "secondary"}>{titulo}</Badge>
        <span className="text-muted-foreground text-xs tabular-nums">
          {tareas.length}
        </span>
      </div>

      {tareas.length === 0 ? (
        <p className="py-8 text-center text-xs text-muted-foreground">
          No hay tareas
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {tareas.map((t) => (
            <TaskCard
              key={t.id}
              tarea={t}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
