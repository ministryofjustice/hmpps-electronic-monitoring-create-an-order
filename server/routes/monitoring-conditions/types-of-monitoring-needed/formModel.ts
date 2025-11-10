import { z } from 'zod'

export const TypesOfMonitoringNeededFormDataModel = z.object({
  action: z.string(),
  addAnother: z.string().nullable().optional(),
})

export default TypesOfMonitoringNeededFormDataModel
