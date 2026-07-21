import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/client";
import { ProyectoSchema } from "@/modules/proyectos/schemas/proyecto-schema";
import { apiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
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
      .insert(proyectoData)
      .select()
      .single();

    if (error) return apiError(error);

    if (empleado_ids && empleado_ids.length > 0) {
      const { error: syncError } = await supabase
        .from("proyecto_empleado")
        .insert(empleado_ids.map((eid) => ({ proyecto_id: data.id, empleado_id: eid })));

      if (syncError) return apiError(syncError);
    }

    revalidatePath("/proyectos");

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
