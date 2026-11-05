import { z } from 'zod'

export const createBillSchema = z.object({
  title: z.string().trim().min(1),
  totalCents: z.number().int().positive().safe(),
})
