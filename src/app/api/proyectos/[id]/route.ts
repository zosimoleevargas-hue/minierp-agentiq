import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/client";
import { ProyectoSchema } from "@/modules/proyectos/schemas/proyecto-schema";
import { apiError } from "@/lib/api-error";
import { syncProjectStatus } from "@/lib/sync-project-status";

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { empleado_ids, estado, ...proyectoData } = parsed.data;

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

    // Block removal of employees with assigned tasks
    if (removidos.length > 0) {
      const { data: tareasActivas } = await supabase
        .from("tareas")
        .select("empleado_id")
        .eq("proyecto_id", id)
        .in("empleado_id", removidos);

      if (tareasActivas && tareasActivas.length > 0) {
        const empleadosConTareas = [...new Set(
          tareasActivas.map((t) => t.empleado_id).filter((id): id is string => id !== null),
        )];

        const { data: empleados } = await supabase
          .from("empleados")
          .select("nombre")
          .in("id", empleadosConTareas);

        const nombres = (empleados ?? []).map((e) => e.nombre).filter(Boolean);

        const mensaje =
          nombres.length > 1
            ? "No puedes retirar empleados que todavía tienen tareas asignadas en este proyecto. Reasigna sus tareas primero."
            : `No puedes retirar a ${nombres[0]} del proyecto porque todavía tiene tareas asignadas. Reasigna sus tareas primero.`;

        return NextResponse.json({ error: mensaje }, { status: 409 });
      }
    }

    // Sync N:M — delete all then re-insert (acceptable for a tech demo)
    await supabase.from("proyecto_empleado").delete().eq("proyecto_id", id);

    if (empleado_ids && empleado_ids.length > 0) {
      const { error: syncError } = await supabase
        .from("proyecto_empleado")
        .insert(empleado_ids.map((eid) => ({ proyecto_id: id, empleado_id: eid })));

      if (syncError) return apiError(syncError);
    }

    await syncProjectStatus(id, supabase);

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
