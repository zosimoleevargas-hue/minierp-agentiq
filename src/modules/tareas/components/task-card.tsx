"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { obtenerTransiciones, esTransicionValida } from "../schemas/tarea-schema";
import type { TareaConRelaciones } from "../utils";

interface TaskCardProps {
  tarea: TareaConRelaciones;
  onEdit: (tarea: TareaConRelaciones) => void;
  onDelete: (tarea: TareaConRelaciones) => void;
}

function PrioridadBadge({ prioridad }: { prioridad: string | null }) {
  if (!prioridad) return null;
  return (
    <Badge
      variant={
        prioridad === "Alta"
          ? "destructive"
          : prioridad === "Media"
            ? "outline"
            : "secondary"
      }
    >
      {prioridad}
    </Badge>
  );
}

export function TaskCard({ tarea, onEdit, onDelete }: TaskCardProps) {
  const router = useRouter();
  const transiciones = obtenerTransiciones(tarea.estado);

  const handleStateChange = async (nuevoEstado: string) => {
    if (!esTransicionValida(tarea.estado, nuevoEstado)) {
      toast.error(`No se puede cambiar de "${tarea.estado}" a "${nuevoEstado}"`);
      return;
    }

    const res = await fetch(`/api/tareas/${tarea.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Error al cambiar el estado");
      return;
    }

    toast.success(`Estado actualizado a "${nuevoEstado}"`);
    router.refresh();
  };

  return (
    <div className="rounded-lg border bg-card p-3 shadow-xs space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{tarea.titulo}</p>
        <PrioridadBadge prioridad={tarea.prioridad} />
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p>
          <span className="font-medium">Proyecto:</span>{" "}
          {tarea.proyectos?.nombre ?? "—"}
        </p>
        <p>
          <span className="font-medium">Asignado:</span>{" "}
          {tarea.empleados?.nombre ?? "Sin asignar"}
        </p>
        {tarea.fecha_limite && (
          <p>
            <span className="font-medium">Límite:</span> {tarea.fecha_limite}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 pt-1">
        <Select
          value={tarea.estado}
          onValueChange={(v) => { if (v) handleStateChange(v); }}
        >
          <SelectTrigger className="h-7 text-xs" aria-label="Cambiar estado">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {transiciones.map((est) => (
              <SelectItem key={est} value={est}>
                {est}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(tarea)}
          aria-label={`Editar ${tarea.titulo}`}
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(tarea)}
          aria-label={`Eliminar ${tarea.titulo}`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
