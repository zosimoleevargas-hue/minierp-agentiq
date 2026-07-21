import { createSupabaseClient } from "@/lib/supabase/client";

export type DashboardKPIs = {
  proyectosActivos: number;
  proyectosCompletados: number;
  tareasPendientes: number;
  tareasVencidas: number;
  totalClientes: number;
  empleadosActivos: number;
};

export type TareaConLimite = {
  id: string;
  titulo: string;
  fecha_limite: string | null;
  prioridad: string | null;
  estado: string;
  vencida: boolean;
  proyectos: { nombre: string } | null;
  empleados: { nombre: string } | null;
};

export type UltimoProyecto = {
  id: string;
  nombre: string;
  clientes: { nombre: string } | null;
  estado: string;
  fecha_entrega: string;
};

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const supabase = createSupabaseClient();
  const hoy = new Date().toISOString().split("T")[0];

  const [
    { count: activos },
    { count: completados },
    { count: pendientes },
    { data: vencidas },
    { count: totalClientes },
    { count: empleadosActivos },
  ] = await Promise.all([
    supabase.from("proyectos").select("*", { count: "exact", head: true }).eq("estado", "En progreso"),
    supabase.from("proyectos").select("*", { count: "exact", head: true }).eq("estado", "Completado"),
    supabase.from("tareas").select("*", { count: "exact", head: true }).in("estado", ["Pendiente", "En progreso"]),
    supabase.from("tareas").select("id").lt("fecha_limite", hoy).neq("estado", "Completada"),
    supabase.from("clientes").select("*", { count: "exact", head: true }),
    supabase.from("empleados").select("*", { count: "exact", head: true }).eq("estado", "Activo"),
  ]);

  return {
    proyectosActivos: activos ?? 0,
    proyectosCompletados: completados ?? 0,
    tareasPendientes: pendientes ?? 0,
    tareasVencidas: vencidas?.length ?? 0,
    totalClientes: totalClientes ?? 0,
    empleadosActivos: empleadosActivos ?? 0,
  };
}

export async function getTareasConLimites(limit = 5): Promise<TareaConLimite[]> {
  const supabase = createSupabaseClient();
  const hoy = new Date().toISOString().split("T")[0];

  const [vencidasResult, proximasResult] = await Promise.all([
    supabase
      .from("tareas")
      .select("*, proyectos(nombre), empleados(nombre)")
      .lt("fecha_limite", hoy)
      .neq("estado", "Completada")
      .not("fecha_limite", "is", null)
      .order("fecha_limite", { ascending: true })
      .limit(limit),
    supabase
      .from("tareas")
      .select("*, proyectos(nombre), empleados(nombre)")
      .gte("fecha_limite", hoy)
      .neq("estado", "Completada")
      .not("fecha_limite", "is", null)
      .order("fecha_limite", { ascending: true })
      .limit(limit),
  ]);

  const vencidas = ((vencidasResult.data ?? []) as unknown as TareaConLimite[]).map(
    (t) => ({ ...t, vencida: true }),
  );
  const proximas = ((proximasResult.data ?? []) as unknown as TareaConLimite[]).map(
    (t) => ({ ...t, vencida: false }),
  );

  return [...vencidas, ...proximas].slice(0, limit);
}

export async function getUltimosProyectos(limit = 5): Promise<UltimoProyecto[]> {
  const supabase = createSupabaseClient();

  const { data } = await supabase
    .from("proyectos")
    .select("id, nombre, fecha_entrega, estado, clientes(nombre)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as unknown as UltimoProyecto[];
}
