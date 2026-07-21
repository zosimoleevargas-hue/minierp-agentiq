import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { ProyectoRow, ClienteRow, EmpleadoRow, TareaRow } from "../utils";

interface ProyectoDetailProps {
  proyecto: ProyectoRow & { clientes: Pick<ClienteRow, "nombre"> | null };
  empleados: EmpleadoRow[];
  tareas: TareaRow[];
  avance: number;
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

export function ProyectoDetail({
  proyecto,
  empleados,
  tareas,
  avance,
}: ProyectoDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información general</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Nombre</p>
            <p className="text-sm">{proyecto.nombre}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Cliente</p>
            <p className="text-sm font-medium">
              {proyecto.clientes?.nombre ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Estado</p>
            <EstadoBadge estado={proyecto.estado} />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Prioridad</p>
            <PrioridadBadge prioridad={proyecto.prioridad} />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">
              Fecha de inicio
            </p>
            <p className="text-sm">{proyecto.fecha_inicio}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">
              Fecha de entrega
            </p>
            <p className="text-sm">{proyecto.fecha_entrega}</p>
          </div>
          {proyecto.descripcion && (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-xs font-medium">
                Descripción
              </p>
              <p className="text-sm whitespace-pre-wrap">
                {proyecto.descripcion}
              </p>
            </div>
          )}
          <div className="sm:col-span-2">
            <p className="text-muted-foreground text-xs font-medium mb-1">
              Avance
            </p>
            <div className="flex items-center gap-3">
              <Progress value={avance} className="flex-1" />
              <span className="text-sm font-medium tabular-nums">
                {avance}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipo asignado</CardTitle>
        </CardHeader>
        <CardContent>
          {empleados.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Este proyecto no tiene empleados asignados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empleados.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {emp.email}
                    </TableCell>
                    <TableCell>{emp.rol}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Tareas del proyecto</CardTitle>
          <Link
            href={`/tareas?proyecto=${proyecto.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ExternalLink className="size-3.5" />
            Ver Kanban
          </Link>
        </CardHeader>
        <CardContent>
          {tareas.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Este proyecto no tiene tareas aún.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead className="hidden sm:table-cell">Asignado</TableHead>
                    <TableHead className="hidden sm:table-cell">Prioridad</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Fecha límite
                    </TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tareas.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.titulo}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {t.empleado_id
                          ? empleados.find((e) => e.id === t.empleado_id)
                              ?.nombre ?? "—"
                          : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <PrioridadBadge prioridad={t.prioridad} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {t.fecha_limite ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            t.estado === "Completada"
                              ? "default"
                              : t.estado === "En progreso"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {t.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
