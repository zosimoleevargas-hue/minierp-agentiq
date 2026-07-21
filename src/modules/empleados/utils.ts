import type { Database } from "@/lib/supabase/types";

export type EmpleadoRow = Database["public"]["Tables"]["empleados"]["Row"];
export type ProyectoRow = Database["public"]["Tables"]["proyectos"]["Row"];
export type TareaRow = Database["public"]["Tables"]["tareas"]["Row"];
