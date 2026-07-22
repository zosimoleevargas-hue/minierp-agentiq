"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { TareaForm } from "./tarea-form";
import type { TareaConRelaciones, ProyectoRow, EmpleadoRow } from "../utils";

interface TareaSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proyectos: Pick<ProyectoRow, "id" | "nombre">[];
  empleados: Pick<EmpleadoRow, "id" | "nombre">[];
  asignaciones: { proyecto_id: string; empleado_id: string }[];
  tarea?: TareaConRelaciones;
  mode: "crear" | "editar";
  defaultProyectoId?: string;
}

export function TareaSheet({
  open,
  onOpenChange,
  proyectos,
  empleados,
  asignaciones,
  tarea,
  mode,
  defaultProyectoId,
}: TareaSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {mode === "crear" ? "Nueva tarea" : "Editar tarea"}
          </SheetTitle>
          <SheetDescription>
            {mode === "crear"
              ? "Registra una nueva tarea en un proyecto"
              : "Modifica los datos de la tarea"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <TareaForm
            proyectos={proyectos}
            empleadosDisponibles={empleados}
            asignaciones={asignaciones}
            tarea={tarea}
            mode={mode}
            defaultProyectoId={defaultProyectoId}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
