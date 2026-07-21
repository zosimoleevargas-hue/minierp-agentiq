import { AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TareaConLimite } from "../dashboard-data";

interface ProximosVencimientosProps {
  tareas: TareaConLimite[];
}

function FechaBadge({ vencida }: { vencida: boolean }) {
  if (vencida) {
    return <Badge variant="destructive">Vencida</Badge>;
  }
  return (
    <Badge variant="outline" className="border-blue-200 text-blue-700">
      Próxima
    </Badge>
  );
}

export function ProximosVencimientos({ tareas }: ProximosVencimientosProps) {
  if (tareas.length === 0) {
    return (
      <div className="rounded-xl border p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Calendar className="size-4 text-muted-foreground" />
          Próximos vencimientos
        </h3>
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Calendar className="size-8 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">
            No hay tareas con fecha límite registradas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <AlertCircle className="size-4 text-muted-foreground" />
        Próximos vencimientos
      </h3>
      <ul className="space-y-2">
        {tareas.map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate font-medium">{t.titulo}</span>
              <span className="hidden shrink-0 text-muted-foreground sm:inline">
                {t.proyectos?.nombre ?? "—"}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-muted-foreground tabular-nums text-xs">
                {t.fecha_limite}
              </span>
              <FechaBadge vencida={t.vencida} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
