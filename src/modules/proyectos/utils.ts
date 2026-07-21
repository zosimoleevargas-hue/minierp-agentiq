import type { Database } from "@/lib/supabase/types";

export type ProyectoRow = Database["public"]["Tables"]["proyectos"]["Row"];
export type ClienteRow = Database["public"]["Tables"]["clientes"]["Row"];
export type EmpleadoRow = Database["public"]["Tables"]["empleados"]["Row"];
export type TareaRow = Database["public"]["Tables"]["tareas"]["Row"];

export type ProyectoConCliente = ProyectoRow & {
  clientes: Pick<ClienteRow, "nombre"> | null;
};
