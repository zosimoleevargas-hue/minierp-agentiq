import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/client";
import { ClienteSchema } from "@/modules/clientes/schemas/cliente-schema";
import { apiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = ClienteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const insertData = { ...parsed.data, email: parsed.data.email || null };

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("clientes")
      .insert(insertData)
      .select()
      .single();

    if (error) return apiError(error);

    revalidatePath("/clientes");

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
