import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/client";
import { TareaSchema } from "@/modules/tareas/schemas/tarea-schema";
import { apiError } from "@/lib/api-error";
import { syncProjectStatus } from "@/lib/sync-project-status";
import type { Database } from "@/lib/supabase/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = createSupabaseClient();

    // Always fetch existing tarea to get proyecto_id (never trust client)
    const { data: existing } = await supabase
      .from("tareas")
      .select("proyecto_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 },
      );
    }

    type TareaUpdate = Database["public"]["Tables"]["tareas"]["Update"];

    let updateData: TareaUpdate;

    // State-only change from TaskCard (single field)
    if (Object.keys(body).length === 1 && body.estado) {
      if (!["Pendiente", "En progreso", "Completada"].includes(body.estado)) {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      }
      updateData = { estado: body.estado };
    } else {
      // Full edit from TareaSheet
      const parsed = TareaSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
          { status: 400 },
        );
      }
      updateData = {
        titulo: parsed.data.titulo,
        descripcion: parsed.data.descripcion || null,
        proyecto_id: parsed.data.proyecto_id,
        empleado_id: parsed.data.empleado_id ?? null,
        prioridad: parsed.data.prioridad ?? null,
        fecha_limite: parsed.data.fecha_limite || null,
        estado: parsed.data.estado,
      };
    }

    const { data, error } = await supabase
      .from("tareas")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return apiError(error);

    const nuevoProyectoId = updateData.proyecto_id ?? existing.proyecto_id;

    await syncProjectStatus(existing.proyecto_id, supabase);
    if (nuevoProyectoId !== existing.proyecto_id) {
      await syncProjectStatus(nuevoProyectoId, supabase);
    }

    revalidatePath("/tareas");
    revalidatePath("/proyectos");
    revalidatePath(`/proyectos/${existing.proyecto_id}`);
    if (nuevoProyectoId !== existing.proyecto_id) {
      revalidatePath(`/proyectos/${nuevoProyectoId}`);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const supabase = createSupabaseClient();

    const { data: tarea } = await supabase
      .from("tareas")
      .select("proyecto_id")
      .eq("id", id)
      .single();

    if (!tarea) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 },
      );
    }

    const { error } = await supabase.from("tareas").delete().eq("id", id);
    if (error) return apiError(error);

    await syncProjectStatus(tarea.proyecto_id, supabase);

    revalidatePath("/tareas");
    revalidatePath("/proyectos");
    revalidatePath(`/proyectos/${tarea.proyecto_id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
