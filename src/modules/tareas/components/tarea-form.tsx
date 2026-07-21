"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  TareaSchema,
  type TareaInput,
} from "@/modules/tareas/schemas/tarea-schema";
import type { TareaConRelaciones, ProyectoRow, EmpleadoRow } from "@/modules/tareas/utils";

interface TareaFormProps {
  proyectos: Pick<ProyectoRow, "id" | "nombre">[];
  empleadosDisponibles: Pick<EmpleadoRow, "id" | "nombre">[];
  tarea?: TareaConRelaciones;
  asignaciones: { proyecto_id: string; empleado_id: string }[];
  mode: "crear" | "editar";
  onSuccess: () => void;
}

export function TareaForm({
  proyectos,
  empleadosDisponibles,
  tarea,
  asignaciones,
  mode,
  onSuccess,
}: TareaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TareaInput>({
    resolver: zodResolver(TareaSchema),
    defaultValues: tarea
      ? {
          titulo: tarea.titulo,
          descripcion: tarea.descripcion ?? "",
          proyecto_id: tarea.proyecto_id,
          empleado_id: tarea.empleado_id,
          prioridad: tarea.prioridad ?? undefined,
          fecha_limite: tarea.fecha_limite ?? "",
          estado: tarea.estado,
        }
      : {
          titulo: "",
          descripcion: "",
          proyecto_id: "",
          empleado_id: undefined,
          prioridad: undefined,
          fecha_limite: "",
          estado: "Pendiente",
        },
  });

  const proyectoId = useWatch({ control, name: "proyecto_id" });
  const empleadoId = useWatch({ control, name: "empleado_id" });
  const prioridad = useWatch({ control, name: "prioridad" });
  const estado = useWatch({ control, name: "estado" });

  const empleadosDelProyecto = proyectoId
    ? empleadosDisponibles.filter((e) =>
        asignaciones.some(
          (a) => a.proyecto_id === proyectoId && a.empleado_id === e.id,
        ),
      )
    : empleadosDisponibles;

  const onSubmit = async (data: TareaInput) => {
    setIsSubmitting(true);
    try {
      const url = mode === "editar" && tarea
        ? `/api/tareas/${tarea.id}`
        : "/api/tareas";
      const method = mode === "editar" ? "PUT" : "POST";

      const body = {
        ...data,
        empleado_id: data.empleado_id || null,
        fecha_limite: data.fecha_limite || null,
        prioridad: data.prioridad || null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Error al guardar la tarea");
        return;
      }

      toast.success(
        mode === "editar"
          ? "Tarea actualizada correctamente"
          : "Tarea creada correctamente",
      );
      router.refresh();
      onSuccess();
    } catch {
      toast.error("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">
          Título <span className="text-destructive">*</span>
        </Label>
        <Input
          id="titulo"
          placeholder="Título de la tarea"
          {...register("titulo")}
          aria-invalid={!!errors.titulo}
        />
        {errors.titulo && (
          <p className="text-destructive text-xs" role="alert">
            {errors.titulo.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          placeholder="Descripción de la tarea"
          rows={2}
          {...register("descripcion")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proyecto_id">
          Proyecto <span className="text-destructive">*</span>
        </Label>
        <Select
          value={proyectoId}
          onValueChange={(v) => {
            if (v) {
              setValue("proyecto_id", v);
              setValue("empleado_id", null);
            }
          }}
          disabled={mode === "editar"}
        >
          <SelectTrigger
            className="w-full"
            aria-invalid={!!errors.proyecto_id}
          >
            <SelectValue placeholder="Seleccionar proyecto" />
          </SelectTrigger>
          <SelectContent>
            {proyectos.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.proyecto_id && (
          <p className="text-destructive text-xs" role="alert">
            {errors.proyecto_id.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="empleado_id">Empleado asignado</Label>
        <Select
          value={empleadoId ?? "__none__"}
          onValueChange={(v) => {
            setValue("empleado_id", v === "__none__" ? null : v);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sin asignar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Sin asignar</SelectItem>
            {empleadosDelProyecto.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="prioridad">Prioridad</Label>
          <Select
            value={prioridad ?? ""}
            onValueChange={(v) => {
              setValue("prioridad", v as "Baja" | "Media" | "Alta" | undefined);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baja">Baja</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_limite">Fecha límite</Label>
          <Input
            id="fecha_limite"
            type="date"
            {...register("fecha_limite")}
          />
        </div>
      </div>

      {mode === "editar" && (
        <div className="space-y-2">
          <Label htmlFor="estado">
            Estado <span className="text-destructive">*</span>
          </Label>
          <Select
            value={estado}
            onValueChange={(v) => {
              if (v) setValue("estado", v as "Pendiente" | "En progreso" | "Completada");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
              <SelectItem value="Completada">Completada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando…"
            : mode === "editar"
              ? "Guardar cambios"
              : "Guardar"}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
