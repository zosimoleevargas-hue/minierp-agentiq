"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { TareaConRelaciones } from "../utils";

interface DeleteTareaDialogProps {
  tarea: TareaConRelaciones | null;
  onClose: () => void;
}

export function DeleteTareaDialog({ tarea, onClose }: DeleteTareaDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!tarea) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tareas/${tarea.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Error al eliminar la tarea");
        return;
      }

      toast.success("Tarea eliminada correctamente");
      router.refresh();
      onClose();
    } catch {
      toast.error("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!tarea} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogTitle>Eliminar tarea</DialogTitle>
        <DialogDescription>
          {tarea
            ? `¿Eliminar la tarea "${tarea.titulo}"? Esta acción no se puede deshacer.`
            : ""}
        </DialogDescription>
        <div className="flex justify-end gap-3 pt-4">
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Eliminando…" : "Eliminar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
