"use client";

import { Button } from "@/components/ui/button";

export default function TareasError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error;
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-destructive text-sm font-medium">
        Error al cargar las tareas
      </p>
      <p className="text-muted-foreground text-xs">
        Ocurrió un error inesperado. Intenta de nuevo.
      </p>
      <Button variant="outline" size="sm" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
