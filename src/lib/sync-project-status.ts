import type { SupabaseClient } from "@supabase/supabase-js";

export async function syncProjectStatus(
  proyectoId: string,
  supabase: SupabaseClient,
) {
  const { data: tareas } = await supabase
    .from("tareas")
    .select("estado")
    .eq("proyecto_id", proyectoId);

  if (!tareas || tareas.length === 0) {
    await supabase
      .from("proyectos")
      .update({ estado: "Planeado" })
      .eq("id", proyectoId);
    return;
  }

  const allCompleted = tareas.every((t) => t.estado === "Completada");
  const hasInProgress = tareas.some((t) => t.estado === "En progreso");

  if (allCompleted) {
    await supabase
      .from("proyectos")
      .update({ estado: "Completado" })
      .eq("id", proyectoId);
  } else if (hasInProgress) {
    await supabase
      .from("proyectos")
      .update({ estado: "En progreso" })
      .eq("id", proyectoId);
  } else {
    // All tasks are Pendiente
    await supabase
      .from("proyectos")
      .update({ estado: "Planeado" })
      .eq("id", proyectoId);
  }
}
