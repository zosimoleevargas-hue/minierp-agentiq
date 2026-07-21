import { z } from "zod";

export const ProyectoSchema = z
  .object({
    nombre: z
      .string()
      .min(1, "El nombre es obligatorio")
      .max(200, "El nombre no puede exceder 200 caracteres"),
    cliente_id: z.string().uuid("Selecciona un cliente"),
    descripcion: z.string().optional().or(z.literal("")),
    fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fecha_entrega: z.string().min(1, "La fecha de entrega es obligatoria"),
    prioridad: z.enum(["Baja", "Media", "Alta"]).optional(),
    estado: z.enum(["Planeado", "En progreso", "Completado"], {
      message: "Selecciona un estado válido",
    }),
    empleado_ids: z.array(z.string().uuid()).optional(),
  })
  .refine(
    (d) => !d.fecha_entrega || !d.fecha_inicio || d.fecha_entrega > d.fecha_inicio,
    {
      message: "La fecha de entrega debe ser posterior a la fecha de inicio",
      path: ["fecha_entrega"],
    },
  );

export type ProyectoInput = z.infer<typeof ProyectoSchema>;
