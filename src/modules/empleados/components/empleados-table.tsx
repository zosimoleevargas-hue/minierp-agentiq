"use client";

import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { DeleteEmpleadoDialog } from "./delete-empleado-dialog";
import type { EmpleadoRow } from "../utils";

interface EmpleadosTableProps {
  empleados: EmpleadoRow[];
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <Badge variant={estado === "Activo" ? "default" : "secondary"}>
      {estado}
    </Badge>
  );
}

export function EmpleadosTable({ empleados }: EmpleadosTableProps) {
  if (empleados.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-muted-foreground text-sm">
          No hay empleados registrados.
        </p>
        <Link
          href="/empleados/nuevo"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Crear empleado
        </Link>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="w-24">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {empleados.map((emp) => (
          <TableRow key={emp.id}>
            <TableCell>
              <Link
                href={`/empleados/${emp.id}`}
                className="font-medium hover:underline"
              >
                {emp.nombre}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {emp.email}
            </TableCell>
            <TableCell>{emp.rol}</TableCell>
            <TableCell>
              <EstadoBadge estado={emp.estado} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Link
                  href={`/empleados/${emp.id}/editar`}
                  className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                  aria-label={`Editar ${emp.nombre}`}
                >
                  <Pencil className="size-4" />
                </Link>
                <DeleteEmpleadoDialog
                  empleadoId={emp.id}
                  empleadoNombre={emp.nombre}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
