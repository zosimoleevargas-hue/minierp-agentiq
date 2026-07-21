"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { ProyectoRow, EmpleadoRow } from "../utils";

interface KanbanFiltersProps {
  proyectos: Pick<ProyectoRow, "id" | "nombre">[];
  empleados: Pick<EmpleadoRow, "id" | "nombre">[];
  asignaciones: { proyecto_id: string; empleado_id: string }[];
  proyectoId?: string;
  onNuevaTarea: () => void;
}

export function KanbanFilters({
  proyectos,
  empleados,
  asignaciones,
  proyectoId,
  onNuevaTarea,
}: KanbanFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentProyecto = searchParams.get("proyecto") ?? proyectoId ?? "";
  const currentEmpleado = searchParams.get("empleado") ?? "";
  const currentPrioridad = searchParams.get("prioridad") ?? "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/tareas?${params.toString()}`);
    },
    [router, searchParams],
  );

  const empleadosFiltrados = currentProyecto
    ? empleados.filter((e) =>
        asignaciones.some(
          (a) => a.proyecto_id === currentProyecto && a.empleado_id === e.id,
        ),
      )
    : empleados;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={currentProyecto}
        onValueChange={(v) => { if (v !== null) updateFilter("proyecto", v === " " ? "" : v); }}
      >
        <SelectTrigger className="w-44" aria-label="Filtrar por proyecto">
          <SelectValue placeholder="Todos los proyectos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Todos los proyectos</SelectItem>
          {proyectos.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentEmpleado}
        onValueChange={(v) => { if (v !== null) updateFilter("empleado", v === " " ? "" : v); }}
      >
        <SelectTrigger className="w-44" aria-label="Filtrar por empleado">
          <SelectValue placeholder="Todos los empleados" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Todos los empleados</SelectItem>
          <SelectItem value="ninguno">Sin asignar</SelectItem>
          {empleadosFiltrados.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentPrioridad}
        onValueChange={(v) => { if (v !== null) updateFilter("prioridad", v === " " ? "" : v); }}
      >
        <SelectTrigger className="w-36" aria-label="Filtrar por prioridad">
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Todas las prioridades</SelectItem>
          <SelectItem value="Baja">Baja</SelectItem>
          <SelectItem value="Media">Media</SelectItem>
          <SelectItem value="Alta">Alta</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={onNuevaTarea} size="sm">
        <Plus className="size-4" />
        Nueva tarea
      </Button>
    </div>
  );
}
