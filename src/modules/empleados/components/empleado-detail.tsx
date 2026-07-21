import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { EmpleadoRow, ProyectoRow, TareaRow } from "../utils";

interface EmpleadoDetailProps {
  empleado: EmpleadoRow;
  proyectos: ProyectoRow[];
  tareas: TareaRow[];
}

export function EmpleadoDetail({
  empleado,
  proyectos,
  tareas,
}: EmpleadoDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos del empleado</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Nombre</p>
            <p className="text-sm">{empleado.nombre}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Email</p>
            <p className="text-sm">{empleado.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Rol</p>
            <p className="text-sm">{empleado.rol}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Estado</p>
            <Badge
              variant={empleado.estado === "Activo" ? "default" : "secondary"}
            >
              {empleado.estado}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos en los que participa</CardTitle>
        </CardHeader>
        <CardContent>
          {proyectos.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Este empleado no participa en ningún proyecto.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proyectos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.estado === "Completado"
                            ? "default"
                            : p.estado === "En progreso"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {p.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tareas activas</CardTitle>
        </CardHeader>
        <CardContent>
          {tareas.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No tiene tareas activas asignadas.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha límite</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tareas.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.titulo}</TableCell>
                    <TableCell>
                      {t.prioridad && (
                        <Badge
                          variant={
                            t.prioridad === "Alta"
                              ? "destructive"
                              : t.prioridad === "Media"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {t.prioridad}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
