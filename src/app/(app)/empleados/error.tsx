"use client";

import { Button } from "@/components/ui/button";

export default function EmpleadosError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error;
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-destructive text-sm font-medium">
        Error al cargar empleados
      </p>
      <p className="text-muted-foreground text-sm max-w-md">
        Ocurrió un error inesperado. Intenta de nuevo.
      </p>
      <Button variant="outline" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
