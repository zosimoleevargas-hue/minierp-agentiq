"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Search } from "lucide-react";
import { DeleteClienteDialog } from "./delete-cliente-dialog";
import type { ClienteConProyectos } from "../utils";

interface ClientesTableProps {
  clientes: ClienteConProyectos[];
  searchQuery?: string;
}

export function ClientesTable({ clientes, searchQuery = "" }: ClientesTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      router.replace(`/clientes?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, router]);

  if (clientes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-muted-foreground text-sm">
            {search
              ? "No se encontraron clientes con ese nombre."
              : "No hay clientes registrados."}
          </p>
          <Link
            href="/clientes/nuevo"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Crear cliente
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden sm:table-cell">NIT</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Teléfono</TableHead>
              <TableHead className="hidden md:table-cell">Proyectos</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Link
                    href={`/clientes/${c.id}`}
                    className="font-medium hover:underline"
                  >
                    {c.nombre}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {c.nit || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {c.email}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {c.telefono || "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {c.proyectosCount}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/clientes/${c.id}/editar`}
                      className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                      aria-label={`Editar ${c.nombre}`}
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteClienteDialog
                      clienteId={c.id}
                      clienteNombre={c.nombre}
                      tieneProyectos={c.proyectosCount > 0}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
