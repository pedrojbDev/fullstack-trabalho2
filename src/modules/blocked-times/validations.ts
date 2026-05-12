import { z } from "zod";

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

export type BlockedTimeInput = z.infer<typeof blockedTimeSchema>;
