import { z } from "zod";

export const appointmentSchema = z
  .object({
    client_id: z.string().uuid("Cliente inválido"),
    space_id: z.string().uuid("Espaço inválido"),
    title: z.string().min(2, "Título é obrigatório"),
    description: z.string().optional(),
    date: z.string().min(1, "Data é obrigatória"),
    start_time: z.string().regex(/^\d{2}:\d{2}$/),
    end_time: z.string().regex(/^\d{2}:\d{2}$/),
    status: z
      .enum(["scheduled", "confirmed", "pending", "cancelled", "completed", "blocked"])
      .default("scheduled"),
    category_color: z.string().optional(),
  })
  .refine((v) => v.start_time < v.end_time, {
    message: "Hora inicial deve ser menor que a final",
    path: ["end_time"],
  });

export type AppointmentInput = z.infer<typeof appointmentSchema>;
