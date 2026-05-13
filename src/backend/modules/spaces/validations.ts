import { z } from "zod";

export const spaceSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  description: z.string().optional(),
  capacity: z.coerce.number().min(1).optional(),
  location: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type SpaceInput = z.infer<typeof spaceSchema>;
