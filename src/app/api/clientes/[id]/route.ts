import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/client";
import { ClienteSchema } from "@/modules/clientes/schemas/cliente-schema";
import { apiError } from "@/lib/api-error";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = ClienteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("clientes")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single();

    if (error) return apiError(error);
    if (!data) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    revalidatePath("/clientes");
    revalidatePath(`/clientes/${id}`);

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

    const { count } = await supabase
      .from("proyectos")
      .select("id", { count: "exact", head: true })
      .eq("cliente_id", id);

    if (count && count > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar el cliente porque tiene ${count} proyecto${count === 1 ? "" : "s"} asociado${count === 1 ? "" : "s"}.`,
          proyectosCount: count,
        },
        { status: 409 },
      );
    }

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) return apiError(error);

    revalidatePath("/clientes");

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
