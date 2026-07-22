import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PROYECTO_ESTADO_COLORS } from "@/lib/design-tokens";
import type { ProyectoRow } from "../utils";

interface GanttChartProps {
  proyectos: ProyectoRow[];
}

function getColor(estado: string): string {
  return PROYECTO_ESTADO_COLORS[estado]?.bar ?? "bg-blue-500";
}

function parseUTCDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function utcDaysBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / 86_400_000;
}

function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
}

interface Tick {
  pos: number;
  isMonth: boolean;
  date: Date;
}

function generateTicks(padMin: Date, padMax: Date): Tick[] {
  const totalDays = utcDaysBetween(padMin, padMax);
  const rangeMs = padMax.getTime() - padMin.getTime();
  const seen = new Set<number>();

  const addTick = (d: Date): void => {
    const raw =
      ((d.getTime() - padMin.getTime()) / rangeMs) * 100;
    const pos = Math.max(0, Math.round(raw * 100) / 100);
    if (!seen.has(pos)) {
      seen.add(pos);
    }
  };

  const getTicks = (): Tick[] => {
    const result: Tick[] = [];
    seen.forEach((p) => {
      const ms = padMin.getTime() + (p / 100) * rangeMs;
      result.push({ pos: p, isMonth: false, date: new Date(ms) });
    });
    return result;
  };

  let m = new Date(
    Date.UTC(padMin.getUTCFullYear(), padMin.getUTCMonth(), 1),
  );
  while (m <= padMax) {
    addTick(m);
    m = new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth() + 1, 1));
  }

  if (totalDays <= 31) {
    const step = totalDays <= 12 ? 1 : 2;
    for (let d = step; d < totalDays; d += step) {
      const date = new Date(padMin.getTime() + d * 86_400_000);
      addTick(date);
    }
  } else if (totalDays <= 90) {
    for (let w = 7; w < totalDays; w += 7) {
      const date = new Date(padMin.getTime() + w * 86_400_000);
      addTick(date);
    }
  }

  const ticks = getTicks();

  const monthPositions = new Set<number>();
  let cursor = new Date(
    Date.UTC(padMin.getUTCFullYear(), padMin.getUTCMonth(), 1),
  );
  while (cursor <= padMax) {
    const raw =
      ((cursor.getTime() - padMin.getTime()) / rangeMs) * 100;
    const pos = Math.max(0, Math.round(raw * 100) / 100);
    monthPositions.add(pos);
    cursor = new Date(
      Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1),
    );
  }

  for (const t of ticks) {
    if (monthPositions.has(t.pos)) {
      t.isMonth = true;
    }
  }

  ticks.sort((a, b) => a.pos - b.pos);
  return ticks;
}

export function GanttChart({ proyectos }: GanttChartProps) {
  if (proyectos.length === 0) {
    return (
      <p className="text-muted-foreground py-16 text-center text-sm">
        No hay proyectos para mostrar en el cronograma.
      </p>
    );
  }

  const hoy = new Date();
  const hoyUTC = new Date(
    Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()),
  );

  const fechas = proyectos.flatMap((p) => [
    parseUTCDate(p.fecha_inicio),
    parseUTCDate(p.fecha_entrega),
  ]);

  const rawMin = new Date(
    Math.min(...fechas.map((d) => d.getTime()), hoyUTC.getTime()),
  );
  const rawMax = new Date(
    Math.max(...fechas.map((d) => d.getTime()), hoyUTC.getTime()),
  );

  const padMin = new Date(rawMin.getTime() - 7 * 86_400_000);
  const padMax = new Date(rawMax.getTime() + 7 * 86_400_000);

  const rangeMs = padMax.getTime() - padMin.getTime();
  const totalDays = utcDaysBetween(padMin, padMax);

  const ticks = generateTicks(padMin, padMax);

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

  function monthLabelStyle(pos: number): React.CSSProperties {
    if (pos < 6) return { left: "0", transform: "none" };
    if (pos > 94) return { left: "100%", transform: "translateX(-100%)" };
    return { left: `${pos}%`, transform: "translateX(-50%)" };
  }

  return (
    <div className="space-y-6">
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
                      variant="outline"
                      className={PROYECTO_ESTADO_COLORS[p.estado]?.badge}
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

      {/* Render estimate */}
      {totalDays > 365 && (
        <p className="text-muted-foreground text-xs">
          Rango de {Math.round(totalDays)} d&iacute;as. La escala mensual
          puede verse comprimida.
        </p>
      )}

      <div className="overflow-x-auto">
        <div className="relative">
          {/* Grid lines layer */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ zIndex: 0 }}
          >
            {ticks.map((tick, i) => (
              <div
                key={i}
                className={`absolute top-0 h-full ${tick.isMonth ? "w-px bg-border" : "w-px bg-border/30"}`}
                style={{ left: `${tick.pos}%` }}
              />
            ))}
          </div>

          {/* Month header layer */}
          <div
            className="relative h-6"
            style={{ zIndex: 1 }}
          >
            {ticks
              .filter((t) => t.isMonth)
              .map((tick, i) => (
                <span
                  key={i}
                  className="absolute whitespace-nowrap text-xs text-muted-foreground"
                  style={monthLabelStyle(tick.pos)}
                >
                  {formatMonthLabel(tick.date)}
                </span>
              ))}
          </div>

          {/* Bars layer */}
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
                    const startMs = parseUTCDate(p.fecha_inicio).getTime();
                    const endMs = parseUTCDate(p.fecha_entrega).getTime();
                    const left =
                      ((startMs - padMin.getTime()) / rangeMs) * 100;
                    const width =
                      ((endMs - startMs) / rangeMs) * 100;

                    return (
                      <Link
                        key={p.id}
                        href={`/proyectos/${p.id}`}
                        className="group relative block h-8"
                        aria-label={`${p.nombre}: ${p.fecha_inicio} → ${p.fecha_entrega}`}
                      >
                        <div
                          className={`absolute top-1 h-6 rounded-sm ${getColor(p.estado)} opacity-80 transition-opacity hover:opacity-100`}
                          style={{
                            left: `${Math.max(0, left)}%`,
                            width: `${Math.max(2, width)}%`,
                          }}
                        />
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

          {/* Spacer to ensure grid lines reach the bottom */}
          <div className="h-0" />
        </div>
      </div>
    </div>
  );
}
