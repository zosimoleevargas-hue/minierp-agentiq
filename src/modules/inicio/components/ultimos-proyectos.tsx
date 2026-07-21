import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { UltimoProyecto } from "../dashboard-data";

interface UltimosProyectosProps {
  proyectos: UltimoProyecto[];
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <Badge
      variant={
        estado === "Completado"
          ? "default"
          : estado === "En progreso"
            ? "outline"
            : "secondary"
      }
    >
      {estado}
    </Badge>
  );
}

export function UltimosProyectos({ proyectos }: UltimosProyectosProps) {
  if (proyectos.length === 0) {
    return (
      <div className="rounded-xl border p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <FolderKanban className="size-4 text-muted-foreground" />
          Últimos proyectos
        </h3>
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <FolderKanban className="size-8 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">
            No hay proyectos registrados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <FolderKanban className="size-4 text-muted-foreground" />
        Últimos proyectos
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden sm:table-cell">Cliente</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden md:table-cell">Entrega</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proyectos.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/proyectos/${p.id}`}
                  className="hover:underline"
                >
                  {p.nombre}
                </Link>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {p.clientes?.nombre ?? "—"}
              </TableCell>
              <TableCell>
                <EstadoBadge estado={p.estado} />
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {p.fecha_entrega}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
