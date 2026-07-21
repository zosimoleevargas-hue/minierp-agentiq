import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/client";
import { ProyectoSchema } from "@/modules/proyectos/schemas/proyecto-schema";
import { apiError } from "@/lib/api-error";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = ProyectoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { empleado_ids, ...proyectoData } = parsed.data;

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("proyectos")
      .update(proyectoData)
      .eq("id", id)
      .select()
      .single();

    if (error) return apiError(error);
    if (!data) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    // RN-T08: Get old assignments before syncing
    const { data: viejasAsignaciones } = await supabase
      .from("proyecto_empleado")
      .select("empleado_id")
      .eq("proyecto_id", id);

    const viejosIds = (viejasAsignaciones ?? []).map((a) => a.empleado_id);
    const removidos = viejosIds.filter((eid) => !(empleado_ids ?? []).includes(eid));

    // Sync N:M — delete all then re-insert (acceptable for a tech demo)
    await supabase.from("proyecto_empleado").delete().eq("proyecto_id", id);

    if (empleado_ids && empleado_ids.length > 0) {
      const { error: syncError } = await supabase
        .from("proyecto_empleado")
        .insert(empleado_ids.map((eid) => ({ proyecto_id: id, empleado_id: eid })));

      if (syncError) return apiError(syncError);
    }

    // RN-T08: NULL tasks of removed employees
    if (removidos.length > 0) {
      await supabase
        .from("tareas")
        .update({ empleado_id: null })
        .eq("proyecto_id", id)
        .in("empleado_id", removidos);
    }

    revalidatePath("/tareas");
    revalidatePath("/proyectos");
    revalidatePath(`/proyectos/${id}`);

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

    const { error } = await supabase.from("proyectos").delete().eq("id", id);

    if (error) return apiError(error);

    revalidatePath("/proyectos");

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
