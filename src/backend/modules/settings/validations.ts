import { z } from "zod";

export const agendaSettingsSchema = z.object({
  opening_time: z.string().regex(/^\d{2}:\d{2}$/),
  closing_time: z.string().regex(/^\d{2}:\d{2}$/),
  appointment_duration_minutes: z.coerce.number().min(5).max(240),
  interval_minutes: z.coerce.number().min(0).max(120),
  default_view: z.enum(["day", "week", "month"]),
});

export type AgendaSettingsInput = z.infer<typeof agendaSettingsSchema>;
