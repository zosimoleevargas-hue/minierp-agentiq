"use client";

import { Badge } from "@/components/ui/badge";
import { KANBAN_COLORS, TAREA_ESTADO_COLORS } from "@/lib/design-tokens";
import { TaskCard } from "./task-card";
import type { TareaConRelaciones } from "../utils";

interface KanbanColumnProps {
  titulo: string;
  estado: string;
  tareas: TareaConRelaciones[];
  onEdit: (tarea: TareaConRelaciones) => void;
  onDelete: (tarea: TareaConRelaciones) => void;
}

export function KanbanColumn({
  titulo,
  estado,
  tareas,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  return (
    <div
      className={`flex min-h-[300px] flex-1 flex-col gap-3 rounded-lg border p-3 ${KANBAN_COLORS[estado]?.bg ?? "bg-muted"}`}
    >
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={TAREA_ESTADO_COLORS[estado]?.badge}>{titulo}</Badge>
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
