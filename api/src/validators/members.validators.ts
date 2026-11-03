import { z } from 'zod'

export const createMemberSchema = z.object({
  name: z.string().trim().min(1, 'Member name is required'),
})

export type CreateMemberInput = z.infer<typeof createMemberSchema>
