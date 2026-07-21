"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error;
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
      <AlertTriangle className="size-10 text-destructive" />
      <h2 className="text-lg font-semibold">Error al cargar el dashboard</h2>
      <p className="text-muted-foreground text-sm">
        No se pudieron cargar los datos. Verifica la conexión e intenta de nuevo.
      </p>
      <Button variant="default" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
