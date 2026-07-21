"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  ProyectoSchema,
  type ProyectoInput,
} from "@/modules/proyectos/schemas/proyecto-schema";
import type { ClienteRow, EmpleadoRow } from "@/modules/proyectos/utils";

interface ProyectoFormProps {
  clientes: ClienteRow[];
  empleados: EmpleadoRow[];
  defaultValues?: ProyectoInput;
  proyectoId?: string;
}

export function ProyectoForm({
  clientes,
  empleados,
  defaultValues,
  proyectoId,
}: ProyectoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProyectoInput>({
    resolver: zodResolver(ProyectoSchema),
    defaultValues: defaultValues ?? {
      nombre: "",
      cliente_id: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_entrega: "",
      prioridad: undefined,
      estado: "Planeado",
      empleado_ids: [],
    },
  });

  const clienteId = useWatch({ name: "cliente_id", control });
  const prioridad = useWatch({ name: "prioridad", control });
  const estado = useWatch({ name: "estado", control });
  const empleadosSeleccionados = useWatch({ name: "empleado_ids", control }) ?? [];

  const toggleEmpleado = (eid: string) => {
    const current = empleadosSeleccionados;
    if (current.includes(eid)) {
      setValue(
        "empleado_ids",
        current.filter((id) => id !== eid),
      );
    } else {
      setValue("empleado_ids", [...current, eid]);
    }
  };

  const onSubmit = async (data: ProyectoInput) => {
    setIsSubmitting(true);
    try {
      const url = proyectoId
        ? `/api/proyectos/${proyectoId}`
        : "/api/proyectos";
      const method = proyectoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Error al guardar el proyecto");
        return;
      }

      toast.success(
        proyectoId
          ? "Proyecto actualizado correctamente"
          : "Proyecto creado correctamente",
      );
      router.push("/proyectos");
      router.refresh();
    } catch {
      toast.error("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre del proyecto <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="Nombre del proyecto"
              {...register("nombre")}
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? "error-nombre" : undefined}
            />
            {errors.nombre && (
              <p id="error-nombre" className="text-destructive text-xs" role="alert">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente_id">
              Cliente <span className="text-destructive">*</span>
            </Label>
            {clientes.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay clientes registrados.{" "}
                <Link href="/clientes/nuevo" className="text-primary underline">
                  Crea un cliente primero.
                </Link>
              </p>
            ) : (
              <>
                <Select
                  value={clienteId}
                  onValueChange={(v) => {
                    if (v) setValue("cliente_id", v);
                  }}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.cliente_id}
                  >
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cliente_id && (
                  <p id="error-cliente_id" className="text-destructive text-xs" role="alert">
                    {errors.cliente_id.message}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Descripción del proyecto"
              rows={3}
              {...register("descripcion")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">
                Fecha de inicio <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fecha_inicio"
                type="date"
                {...register("fecha_inicio")}
                aria-invalid={!!errors.fecha_inicio}
                aria-describedby={errors.fecha_inicio ? "error-fecha_inicio" : undefined}
              />
              {errors.fecha_inicio && (
                <p id="error-fecha_inicio" className="text-destructive text-xs" role="alert">
                  {errors.fecha_inicio.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_entrega">
                Fecha de entrega <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fecha_entrega"
                type="date"
                {...register("fecha_entrega")}
                aria-invalid={!!errors.fecha_entrega}
                aria-describedby={errors.fecha_entrega ? "error-fecha_entrega" : undefined}
              />
              {errors.fecha_entrega && (
                <p id="error-fecha_entrega" className="text-destructive text-xs" role="alert">
                  {errors.fecha_entrega.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prioridad">Prioridad</Label>
              <Select
                value={prioridad ?? ""}
                onValueChange={(v) => {
                  if (v) setValue("prioridad", v as "Baja" | "Media" | "Alta");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baja">Baja</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">
                Estado <span className="text-destructive">*</span>
              </Label>
              <Select
                value={estado}
                onValueChange={(v) => {
                  if (v) setValue("estado", v as "Planeado" | "En progreso" | "Completado");
                }}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.estado}>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planeado">Planeado</SelectItem>
                  <SelectItem value="En progreso">En progreso</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && (
                <p id="error-estado" className="text-destructive text-xs" role="alert">
                  {errors.estado.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Empleados asignados</Label>
            {empleados.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay empleados activos disponibles.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {empleados.map((emp) => {
                  const checked = empleadosSeleccionados.includes(emp.id);
                  return (
                    <label
                      key={emp.id}
                      className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer hover:bg-muted/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
                    >
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={checked}
                        onChange={() => toggleEmpleado(emp.id)}
                      />
                      <span className="font-medium">{emp.nombre}</span>
                      <span className="text-muted-foreground ml-auto text-xs">
                        {emp.rol}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando…"
                : proyectoId
                  ? "Guardar cambios"
                  : "Guardar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/proyectos")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
