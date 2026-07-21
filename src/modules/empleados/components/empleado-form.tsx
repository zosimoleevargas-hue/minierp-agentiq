"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmpleadoSchema,
  ROLES_SUGERIDOS,
  type EmpleadoInput,
} from "@/modules/empleados/schemas/empleado-schema";

interface EmpleadoFormProps {
  defaultValues?: EmpleadoInput;
  empleadoId?: string;
}

export function EmpleadoForm({ defaultValues, empleadoId }: EmpleadoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rolPersonalizado, setRolPersonalizado] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<EmpleadoInput>({
    resolver: zodResolver(EmpleadoSchema),
    defaultValues: defaultValues ?? {
      nombre: "",
      email: "",
      rol: "",
      estado: "Activo",
    },
  });

  const rolActual = useWatch({ name: "rol", control });
  const estadoActual = useWatch({ name: "estado", control });
  const esRolSugerido = ROLES_SUGERIDOS.includes(rolActual as typeof ROLES_SUGERIDOS[number]);

  const onSubmit = async (data: EmpleadoInput) => {
    setIsSubmitting(true);
    try {
      const url = empleadoId
        ? `/api/empleados/${empleadoId}`
        : "/api/empleados";
      const method = empleadoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Error al guardar el empleado");
        return;
      }

      toast.success(
        empleadoId
          ? "Empleado actualizado correctamente"
          : "Empleado creado correctamente",
      );
      router.push("/empleados");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="Nombre completo"
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
            <Label htmlFor="email">
              Correo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
            />
            {errors.email && (
              <p id="error-email" className="text-destructive text-xs" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol">
              Rol <span className="text-destructive">*</span>
            </Label>
            {rolPersonalizado ? (
              <div className="flex gap-2">
                <Input
                  id="rol"
                  placeholder="Escribe el rol"
                  {...register("rol")}
                  aria-invalid={!!errors.rol}
                  aria-describedby={errors.rol ? "error-rol" : undefined}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRolPersonalizado(false);
                    setValue("rol", ROLES_SUGERIDOS[0]);
                  }}
                >
                  Volver
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select
                  value={esRolSugerido ? rolActual : ""}
                  onValueChange={(v) => {
                    if (v === "__otro__") {
                      setRolPersonalizado(true);
                      setValue("rol", "");
                    } else if (v) {
                      setValue("rol", v);
                    }
                  }}
                >
                  <SelectTrigger
                    className="flex-1"
                    aria-invalid={!!errors.rol}
                  >
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES_SUGERIDOS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                    <SelectItem value="__otro__">Otro…</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {errors.rol && (
              <p id="error-rol" className="text-destructive text-xs" role="alert">
                {errors.rol.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">
              Estado <span className="text-destructive">*</span>
            </Label>
            <Select
              value={estadoActual}
              onValueChange={(v) => { if (v) setValue("estado", v as "Activo" | "Inactivo"); }}
            >
              <SelectTrigger className="w-full" aria-invalid={!!errors.estado}>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            {errors.estado && (
              <p id="error-estado" className="text-destructive text-xs" role="alert">
                {errors.estado.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando…"
                : empleadoId
                  ? "Guardar cambios"
                  : "Guardar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/empleados")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
