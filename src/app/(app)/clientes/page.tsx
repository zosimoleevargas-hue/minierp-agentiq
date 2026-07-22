import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { ClientesTable } from "@/modules/clientes/components/clientes-table";
import type { ClienteConProyectos } from "@/modules/clientes/utils";

async function getClientes(q?: string): Promise<ClienteConProyectos[]> {
  const supabase = createSupabaseClient();

  let query = supabase.from("clientes").select("*");
  if (q) {
    query = query.ilike("nombre", `%${q}%`);
  }
  const { data: clientes } = await query.order("nombre");

  if (!clientes || clientes.length === 0) return [];

  const { data: proyectos } = await supabase
    .from("proyectos")
    .select("cliente_id")
    .in("cliente_id", clientes.map((c) => c.id));

  const counts = new Map<string, number>();
  for (const p of proyectos ?? []) {
    counts.set(p.cliente_id, (counts.get(p.cliente_id) ?? 0) + 1);
  }

  return clientes.map((c) => ({
    ...c,
    proyectosCount: counts.get(c.id) ?? 0,
  }));
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const clientes = await getClientes(q);

  return (
    <div>
      <PageHeader
        title="Clientes"
        action={
          <Link
            href="/clientes/nuevo"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="size-4" />
            Nuevo cliente
          </Link>
        }
      />
      <ClientesTable clientes={clientes} searchQuery={q} />
    </div>
  );
}
