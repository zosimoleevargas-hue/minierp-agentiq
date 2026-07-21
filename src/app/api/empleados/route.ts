import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/client";
import { EmpleadoSchema } from "@/modules/empleados/schemas/empleado-schema";
import { apiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
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
      .insert(parsed.data)
      .select()
      .single();

    if (error) return apiError(error);

    revalidatePath("/empleados");

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
