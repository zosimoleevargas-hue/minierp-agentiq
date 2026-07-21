import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { EmpleadosTable } from "@/modules/empleados/components/empleados-table";
import type { EmpleadoRow } from "@/modules/empleados/utils";

async function getEmpleados(): Promise<EmpleadoRow[]> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("empleados")
    .select("*")
    .order("nombre");

  return data ?? [];
}

export default async function EmpleadosPage() {
  const empleados = await getEmpleados();

  return (
    <div>
      <PageHeader
        title="Empleados"
        description="Gestión del equipo de trabajo"
        action={
          <Link
            href="/empleados/nuevo"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="size-4" />
            Nuevo empleado
          </Link>
        }
      />
      <EmpleadosTable empleados={empleados} />
    </div>
  );
}
