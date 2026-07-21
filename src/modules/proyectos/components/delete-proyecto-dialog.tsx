"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface DeleteProyectoDialogProps {
  proyectoId: string;
  proyectoNombre: string;
}

export function DeleteProyectoDialog({
  proyectoId,
  proyectoNombre,
}: DeleteProyectoDialogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/proyectos/${proyectoId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Error al eliminar el proyecto");
      return;
    }

    toast.success("Proyecto eliminado correctamente");
    router.refresh();
  };

  return (
    <ConfirmDialog
      title="Eliminar proyecto"
      description={`¿Estás seguro de eliminar "${proyectoNombre}"? También se eliminarán todas sus tareas y asignaciones de empleados. Esta acción no se puede deshacer.`}
      confirmLabel="Eliminar"
      variant="destructive"
      onConfirm={handleDelete}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Eliminar ${proyectoNombre}`}
        >
          <Trash2 className="size-4" />
        </Button>
      }
    />
  );
}
