"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClienteSchema,
  type ClienteInput,
} from "@/modules/clientes/schemas/cliente-schema";

interface ClienteFormProps {
  defaultValues?: ClienteInput;
  clienteId?: string;
}

export function ClienteForm({ defaultValues, clienteId }: ClienteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteInput>({
    resolver: zodResolver(ClienteSchema),
    defaultValues: defaultValues ?? {
      nombre: "",
      email: "",
      nit: "",
      telefono: "",
      direccion: "",
    },
  });

  const onSubmit = async (data: ClienteInput) => {
    setIsSubmitting(true);
    try {
      const url = clienteId
        ? `/api/clientes/${clienteId}`
        : "/api/clientes";
      const method = clienteId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Error al guardar el cliente");
        return;
      }

      toast.success(
        clienteId
          ? "Cliente actualizado correctamente"
          : "Cliente creado correctamente",
      );
      router.push("/clientes");
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
              Nombre o razón social <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="Nombre completo o razón social"
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
              Correo de contacto <span className="text-destructive">*</span>
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
            <Label htmlFor="nit">Identificación/NIT</Label>
            <Input
              id="nit"
              placeholder="Ej: 123456789-0"
              {...register("nit")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="+57 300 000 0000"
              {...register("telefono")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              placeholder="Dirección completa"
              {...register("direccion")}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando…"
                : clienteId
                  ? "Guardar cambios"
                  : "Guardar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/clientes")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
