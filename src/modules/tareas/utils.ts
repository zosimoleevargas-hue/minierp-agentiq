import type { Database } from "@/lib/supabase/types";

export type TareaRow = Database["public"]["Tables"]["tareas"]["Row"];
export type ProyectoRow = Database["public"]["Tables"]["proyectos"]["Row"];
export type EmpleadoRow = Database["public"]["Tables"]["empleados"]["Row"];

export type TareaConRelaciones = TareaRow & {
  proyectos: Pick<ProyectoRow, "nombre"> | null;
  empleados: Pick<EmpleadoRow, "nombre"> | null;
};
