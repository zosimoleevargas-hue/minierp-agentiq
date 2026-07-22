"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface DeleteClienteDialogProps {
  clienteId: string;
  clienteNombre: string;
  tieneProyectos: boolean;
}

export function DeleteClienteDialog({
  clienteId,
  clienteNombre,
  tieneProyectos,
}: DeleteClienteDialogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/clientes/${clienteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Error al eliminar el cliente");
        return;
      }

      toast.success("Cliente eliminado correctamente");
      router.refresh();
    } catch {
      toast.error("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    }
  };

  const description = tieneProyectos
    ? `Este cliente tiene proyectos asociados. No se puede eliminar hasta que los proyectos sean reasignados o eliminados.`
    : `¿Estás seguro de eliminar a ${clienteNombre}? Esta acción no se puede deshacer.`;

  const msgBloqueado = "No se puede eliminar este cliente porque tiene proyectos asociados.";

  return (
    <ConfirmDialog
      title="Eliminar cliente"
      description={description}
      confirmLabel="Eliminar"
      variant="destructive"
      onConfirm={handleDelete}
      trigger={
        tieneProyectos ? (
          <span title={msgBloqueado}>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label={msgBloqueado}
            >
              <Trash2 className="size-4" />
            </Button>
          </span>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Eliminar ${clienteNombre}`}
          >
            <Trash2 className="size-4" />
          </Button>
        )
      }
    />
  );
}
