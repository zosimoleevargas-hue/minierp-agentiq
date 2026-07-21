import { z } from "zod";

export const ROLES_SUGERIDOS = [
  "Desarrollador",
  "Diseñador",
  "Project Manager",
  "QA",
] as const;

const emailSchema = z
  .string()
  .min(1, "El correo es obligatorio")
  .email("El correo no tiene un formato válido")
  .transform((v) => v.trim().toLowerCase());

export const EmpleadoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  email: emailSchema,
  rol: z
    .string()
    .min(1, "El rol es obligatorio"),
  estado: z.enum(["Activo", "Inactivo"], {
    message: "Selecciona un estado válido",
  }),
});

export type EmpleadoInput = z.infer<typeof EmpleadoSchema>;
