import { z } from 'zod'

export const IsRejectionFromDataModel = z.object({
  action: z.string(),
  isRejection: z
    .enum(['yes', 'no'])
    .optional()
    .transform(val => {
      if (val === 'yes') {
        return true
      }
      if (val === 'no') {
        return false
      }
      return null
    }),
})

export type IsRejectionFromModel = Omit<z.infer<typeof IsRejectionFromDataModel>, 'action'>
