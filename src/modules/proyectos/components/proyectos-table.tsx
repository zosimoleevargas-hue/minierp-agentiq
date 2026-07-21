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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Search } from "lucide-react";
import { DeleteProyectoDialog } from "./delete-proyecto-dialog";
import type { ProyectoConCliente } from "../utils";

interface ProyectosTableProps {
  proyectos: ProyectoConCliente[];
  avances: Record<string, number>;
  searchQuery?: string;
  estadoFilter?: string;
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

function PrioridadBadge({ prioridad }: { prioridad: string | null }) {
  if (!prioridad) return null;
  return (
    <Badge
      variant={
        prioridad === "Alta"
          ? "destructive"
          : prioridad === "Media"
            ? "outline"
            : "secondary"
      }
    >
      {prioridad}
    </Badge>
  );
}

export function ProyectosTable({
  proyectos,
  avances,
  searchQuery = "",
  estadoFilter = "",
}: ProyectosTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery);
  const [estado, setEstado] = useState(estadoFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (estado) params.set("estado", estado);
      router.replace(`/proyectos?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, estado, router]);

  if (proyectos.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por nombre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={estado} onValueChange={(v) => setEstado(v ?? "")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todos</SelectItem>
              <SelectItem value="Planeado">Planeado</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-muted-foreground text-sm">
            {search || estado
              ? "No se encontraron proyectos con esos filtros."
              : "No hay proyectos registrados."}
          </p>
          <Link
            href="/proyectos/nuevo"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Crear proyecto
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={estado} onValueChange={(v) => setEstado(v ?? "")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Todos</SelectItem>
            <SelectItem value="Planeado">Planeado</SelectItem>
            <SelectItem value="En progreso">En progreso</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Estado</TableHead>
              <TableHead className="hidden md:table-cell">Avance</TableHead>
              <TableHead className="hidden md:table-cell">Entrega</TableHead>
              <TableHead className="hidden md:table-cell">Prioridad</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proyectos.map((p) => {
              const avance = avances[p.id] ?? 0;
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link
                      href={`/proyectos/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.nombre}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.clientes?.nombre ?? "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <EstadoBadge estado={p.estado} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={avance} className="w-16" />
                      <span className="text-xs tabular-nums">{avance}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {p.fecha_entrega}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <PrioridadBadge prioridad={p.prioridad} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/proyectos/${p.id}/editar`}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                        aria-label={`Editar ${p.nombre}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <DeleteProyectoDialog
                        proyectoId={p.id}
                        proyectoNombre={p.nombre}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
