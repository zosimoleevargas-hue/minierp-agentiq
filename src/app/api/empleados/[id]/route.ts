import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/client";
import { EmpleadoSchema } from "@/modules/empleados/schemas/empleado-schema";
import { apiError } from "@/lib/api-error";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = EmpleadoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("empleados")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single();

    if (error) return apiError(error);
    if (!data) {
      return NextResponse.json(
        { error: "Empleado no encontrado" },
        { status: 404 },
      );
    }

    revalidatePath("/empleados");

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
    const { error } = await supabase
      .from("empleados")
      .delete()
      .eq("id", id);

    if (error) return apiError(error);

    revalidatePath("/empleados");

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
