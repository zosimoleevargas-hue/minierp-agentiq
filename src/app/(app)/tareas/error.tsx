"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TareasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-destructive text-sm font-medium">
        Error al cargar las tareas
      </p>
      <p className="text-muted-foreground text-xs">{error.message}</p>
      <Button variant="outline" size="sm" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
