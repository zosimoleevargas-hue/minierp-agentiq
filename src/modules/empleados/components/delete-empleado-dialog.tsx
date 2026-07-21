"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface DeleteEmpleadoDialogProps {
  empleadoId: string;
  empleadoNombre: string;
}

export function DeleteEmpleadoDialog({
  empleadoId,
  empleadoNombre,
}: DeleteEmpleadoDialogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/empleados/${empleadoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Error al eliminar el empleado");
        return;
      }

      toast.success("Empleado eliminado correctamente");
      router.refresh();
    } catch {
      toast.error("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    }
  };

  return (
    <ConfirmDialog
      title="Eliminar empleado"
      description={`Al eliminar a ${empleadoNombre}, sus tareas quedarán sin responsable asignado y se eliminarán sus asignaciones a proyectos. Esta acción no se puede deshacer.`}
      confirmLabel="Eliminar"
      variant="destructive"
      onConfirm={handleDelete}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Eliminar ${empleadoNombre}`}
        >
          <Trash2 className="size-4" />
        </Button>
      }
    />
  );
}
