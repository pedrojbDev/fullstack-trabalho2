import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const spaceSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  description: z.string().optional(),
  capacity: z.coerce.number().min(1).optional(),
  location: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const appointmentSchema = z
  .object({
    client_id: z.string().uuid("Cliente inválido"),
    space_id: z.string().uuid("Espaço inválido"),
    title: z.string().min(2, "Título é obrigatório"),
    description: z.string().optional(),
    date: z.string().min(1, "Data é obrigatória"),
    start_time: z.string().regex(/^\d{2}:\d{2}$/),
    end_time: z.string().regex(/^\d{2}:\d{2}$/),
    status: z.enum(["scheduled", "confirmed", "pending", "cancelled", "completed", "blocked"]).default("scheduled"),
    category_color: z.string().optional(),
  })
  .refine((v) => v.start_time < v.end_time, {
    message: "Hora inicial deve ser menor que a final",
    path: ["end_time"],
  });

export const blockedTimeSchema = z
  .object({
    space_id: z.string().uuid().nullable().optional(),
    title: z.string().min(2),
    reason: z.string().optional(),
    date: z.string().min(1),
    start_time: z.string().regex(/^\d{2}:\d{2}$/),
    end_time: z.string().regex(/^\d{2}:\d{2}$/),
  })
  .refine((v) => v.start_time < v.end_time, {
    message: "Hora inicial deve ser menor que a final",
    path: ["end_time"],
  });

export const agendaSettingsSchema = z.object({
  opening_time: z.string().regex(/^\d{2}:\d{2}$/),
  closing_time: z.string().regex(/^\d{2}:\d{2}$/),
  appointment_duration_minutes: z.coerce.number().min(5).max(240),
  interval_minutes: z.coerce.number().min(0).max(120),
  default_view: z.enum(["day", "week", "month"]),
});

export const reminderSchema = z.object({
  appointment_id: z.string().uuid(),
  type: z.literal("email"),
  scheduled_for: z.string().datetime(),
});

