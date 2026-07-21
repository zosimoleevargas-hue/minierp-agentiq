import { z } from "zod";

const TRANSICIONES_PERMITIDAS: Record<string, string[]> = {
  Pendiente: ["En progreso"],
  "En progreso": ["Completada"],
  Completada: ["En progreso"],
};

export function obtenerTransiciones(estadoActual: string): string[] {
  return TRANSICIONES_PERMITIDAS[estadoActual] ?? [estadoActual];
}

export function esTransicionValida(desde: string, hasta: string): boolean {
  return TRANSICIONES_PERMITIDAS[desde]?.includes(hasta) ?? false;
}

export const TareaSchema = z.object({
  titulo: z
    .string()
    .min(1, "El título es obligatorio")
    .max(200, "El título no puede exceder 200 caracteres"),
  descripcion: z.string().optional().or(z.literal("")),
  proyecto_id: z.string().uuid("Selecciona un proyecto"),
  empleado_id: z.string().uuid().nullable().optional(),
  prioridad: z.enum(["Baja", "Media", "Alta"]).optional(),
  fecha_limite: z.string().optional().or(z.literal("")),
  estado: z.enum(["Pendiente", "En progreso", "Completada"], {
    message: "Selecciona un estado válido",
  }),
});

export type TareaInput = z.infer<typeof TareaSchema>;
