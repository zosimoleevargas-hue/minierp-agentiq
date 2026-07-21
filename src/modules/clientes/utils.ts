import type { Database } from "@/lib/supabase/types";

export type ClienteRow = Database["public"]["Tables"]["clientes"]["Row"];
export type ProyectoRow = Database["public"]["Tables"]["proyectos"]["Row"];

export type ClienteConProyectos = ClienteRow & {
  proyectosCount: number;
};
