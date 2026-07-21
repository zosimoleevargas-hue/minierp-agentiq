import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/client";
import { TareaSchema } from "@/modules/tareas/schemas/tarea-schema";
import { apiError } from "@/lib/api-error";
import { syncProjectStatus } from "@/lib/sync-project-status";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = TareaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("tareas")
      .insert({
        titulo: parsed.data.titulo,
        descripcion: parsed.data.descripcion || null,
        proyecto_id: parsed.data.proyecto_id,
        empleado_id: parsed.data.empleado_id ?? null,
        prioridad: parsed.data.prioridad ?? null,
        fecha_limite: parsed.data.fecha_limite || null,
        estado: parsed.data.estado,
      })
      .select()
      .single();

    if (error) return apiError(error);

    await syncProjectStatus(parsed.data.proyecto_id, supabase);

    revalidatePath("/tareas");
    revalidatePath("/proyectos");
    revalidatePath(`/proyectos/${parsed.data.proyecto_id}`);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return apiError(error);
  }
}
