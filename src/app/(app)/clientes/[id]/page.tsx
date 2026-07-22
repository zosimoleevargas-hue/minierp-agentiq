import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, ArrowLeft } from "lucide-react";
import { ClienteDetail } from "@/modules/clientes/components/cliente-detail";
import { DeleteClienteDialog } from "@/modules/clientes/components/delete-cliente-dialog";
import type { ClienteRow, ProyectoRow } from "@/modules/clientes/utils";

async function getCliente(
  id: string,
): Promise<{ cliente: ClienteRow; proyectos: ProyectoRow[] } | null> {
  const supabase = createSupabaseClient();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (!cliente) return null;

  const { data: proyectos } = await supabase
    .from("proyectos")
    .select("*")
    .eq("cliente_id", id)
    .order("fecha_entrega");

  return { cliente, proyectos: proyectos ?? [] };
}

export default async function ClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCliente(id);

  if (!result) notFound();

  return (
    <div>
      <PageHeader
        title={result.cliente.nombre}
        action={
          <div className="flex gap-2">
            <Link
              href="/clientes"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <ArrowLeft className="size-4" />
              Volver
            </Link>
            <Link
              href={`/clientes/${id}/editar`}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Pencil className="size-4" />
              Editar
            </Link>
            <DeleteClienteDialog
              clienteId={id}
              clienteNombre={result.cliente.nombre}
              tieneProyectos={result.proyectos.length > 0}
            />
          </div>
        }
      />
      <ClienteDetail
        cliente={result.cliente}
        proyectos={result.proyectos}
      />
    </div>
  );
}
