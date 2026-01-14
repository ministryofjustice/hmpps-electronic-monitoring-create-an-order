import { z } from 'zod'

export const DapoFormModel = z.object({
  action: z.string(),
  clause: z.string(),
  date: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
  }),
})

export type Dapo = z.infer<typeof DapoFormModel>
export default DapoFormModel
