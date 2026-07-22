import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ProyectoRow } from "../utils";

interface GanttChartProps {
  proyectos: ProyectoRow[];
}

function getColor(estado: string): string {
  switch (estado) {
    case "En progreso":
      return "bg-teal-500";
    case "Completado":
      return "bg-green-500";
    default:
      return "bg-slate-400";
  }
}

export function GanttChart({ proyectos }: GanttChartProps) {
  if (proyectos.length === 0) {
    return (
      <p className="text-muted-foreground py-16 text-center text-sm">
        No hay proyectos para mostrar en el cronograma.
      </p>
    );
  }

  // Determine date range
  const hoy = new Date();
  const fechas = proyectos.flatMap((p) => [
    new Date(p.fecha_inicio),
    new Date(p.fecha_entrega),
  ]);
  const minDate = new Date(Math.min(...fechas.map((d) => d.getTime()), hoy.getTime()));
  const maxDate = new Date(Math.max(...fechas.map((d) => d.getTime()), hoy.getTime()));

  // Pad range by 7 days on each side
  minDate.setDate(minDate.getDate() - 7);
  maxDate.setDate(maxDate.getDate() + 7);

  // Group by estado
  const grupos: Record<string, ProyectoRow[]> = {
    Planeado: [],
    "En progreso": [],
    Completado: [],
  };
  for (const p of proyectos) {
    const g = grupos[p.estado];
    if (g) g.push(p);
  }

  const ordenEstados = ["En progreso", "Planeado", "Completado"];

  // Build month markers
  const monthMarkers: { label: string; left: string }[] = [];
  const cursor = new Date(minDate);
  cursor.setDate(1);
  while (cursor <= maxDate) {
    const left = ((cursor.getTime() - minDate.getTime()) / (maxDate.getTime() - minDate.getTime())) * 100;
    monthMarkers.push({
      label: cursor.toLocaleDateString("es-ES", { month: "short", year: "2-digit" }),
      left: `${left}%`,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return (
    <div className="space-y-6">
      {/* Accessible table fallback */}
      <details className="group">
        <summary className="text-muted-foreground cursor-pointer text-sm font-medium hover:text-foreground">
          Ver como tabla
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-medium">Proyecto</th>
                <th className="pb-2 pr-4 font-medium">Estado</th>
                <th className="pb-2 pr-4 font-medium">Inicio</th>
                <th className="pb-2 font-medium">Entrega</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/proyectos/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.nombre}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">
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
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {p.fecha_inicio}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {p.fecha_entrega}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Visual Gantt */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Month header */}
          <div className="relative mb-1 h-6">
            {monthMarkers.map((m, i) => (
              <span
                key={i}
                className="absolute -translate-x-1/2 text-xs text-muted-foreground"
                style={{ left: m.left }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid lines + bars per group */}
          {ordenEstados.map((estado) => {
            const items = grupos[estado];
            if (!items || items.length === 0) return null;

            return (
              <div key={estado} className="mb-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {estado === "En progreso" ? "En progreso" : estado}
                </h3>
                <div className="space-y-1">
                  {items.map((p) => {
                    const startMs = new Date(p.fecha_inicio).getTime();
                    const endMs = new Date(p.fecha_entrega).getTime();
                    const left =
                      ((startMs - minDate.getTime()) /
                        (maxDate.getTime() - minDate.getTime())) *
                      100;
                    const width =
                      ((endMs - startMs) /
                        (maxDate.getTime() - minDate.getTime())) *
                      100;

                    return (
                      <Link
                        key={p.id}
                        href={`/proyectos/${p.id}`}
                        className="group relative block h-8"
                        aria-label={`${p.nombre}: ${p.fecha_inicio} → ${p.fecha_entrega}`}
                      >
                        {/* Bar */}
                        <div
                          className={`absolute top-1 h-6 rounded-sm ${getColor(p.estado)} opacity-80 transition-opacity hover:opacity-100`}
                          style={{
                            left: `${Math.max(0, left)}%`,
                            width: `${Math.max(2, width)}%`,
                          }}
                        />
                        {/* Label */}
                        <span
                          className="absolute top-1 truncate px-1.5 text-xs leading-6 text-white"
                          style={{
                            left: `${Math.max(0, left)}%`,
                            maxWidth: `${Math.max(2, width)}%`,
                          }}
                        >
                          {p.nombre}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
