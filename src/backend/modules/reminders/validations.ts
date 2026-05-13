import { z } from "zod";

export const reminderSchema = z.object({
  appointment_id: z.string().uuid(),
  type: z.literal("email"),
  scheduled_for: z.string().datetime(),
});

export type ReminderInput = z.infer<typeof reminderSchema>;
