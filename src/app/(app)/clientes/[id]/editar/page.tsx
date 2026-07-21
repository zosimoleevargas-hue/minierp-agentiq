import { notFound } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { ClienteForm } from "@/modules/clientes/components/cliente-form";

async function getCliente(id: string): Promise<{
  nombre: string;
  email: string;
  nit: string;
  telefono: string;
  direccion: string;
} | null> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("clientes")
    .select("nombre, email, nit, telefono, direccion")
    .eq("id", id)
    .single();

  if (!data) return null;

  return {
    nombre: data.nombre,
    email: data.email ?? "",
    nit: data.nit ?? "",
    telefono: data.telefono ?? "",
    direccion: data.direccion ?? "",
  };
}

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await getCliente(id);

  if (!cliente) notFound();

  return (
    <div>
      <PageHeader
        title="Editar cliente"
        description="Modifica los datos del cliente"
      />
      <ClienteForm defaultValues={cliente} clienteId={id} />
    </div>
  );
}
