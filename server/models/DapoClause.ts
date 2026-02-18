import { z } from 'zod'

const DapoClauseModel = z.object({
  id: z.string().optional(),
  clause: z.string().nullable(),
  date: z.string().datetime().nullable(),
})

export type DapoClause = z.infer<typeof DapoClauseModel>

export default DapoClauseModel
