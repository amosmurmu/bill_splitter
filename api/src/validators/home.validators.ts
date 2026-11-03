import { z } from 'zod'

export const createHomeSchema = z.object({
  name: z.string().trim().min(1),
})

export type CreateHomeInput = z.infer<typeof createHomeSchema>
