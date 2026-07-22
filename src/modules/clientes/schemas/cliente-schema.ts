import { z } from "zod";

const emailSchema = z
  .union([
    z.literal(""),
    z.string().email("El correo no tiene un formato válido").transform((v) => v.trim().toLowerCase()),
  ])
  .optional();

export const ClienteSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  email: emailSchema,
  nit: z.string().optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
  direccion: z.string().optional().or(z.literal("")),
});

export type ClienteInput = z.infer<typeof ClienteSchema>;
