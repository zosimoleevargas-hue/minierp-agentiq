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
import type { ClienteRow, ProyectoRow } from "../utils";

interface ClienteDetailProps {
  cliente: ClienteRow;
  proyectos: ProyectoRow[];
}

export function ClienteDetail({ cliente, proyectos }: ClienteDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos del cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Nombre</p>
            <p className="text-sm">{cliente.nombre}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Email</p>
            <p className="text-sm">{cliente.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">NIT</p>
            <p className="text-sm">{cliente.nit ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Teléfono</p>
            <p className="text-sm">{cliente.telefono ?? "—"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-muted-foreground text-xs font-medium">Dirección</p>
            <p className="text-sm">{cliente.direccion ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos asociados</CardTitle>
        </CardHeader>
        <CardContent>
          {proyectos.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Este cliente no tiene proyectos asociados aún.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden sm:table-cell">Entrega</TableHead>
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
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {p.fecha_entrega}
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
