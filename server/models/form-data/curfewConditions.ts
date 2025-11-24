import { z } from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'

const CurfewConditionsFormDataModel = z.object({
  action: z.string().default('continue'),
  startDate: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
    hours: z.string().default(''),
    minutes: z.string().default(''),
  }),
  endDate: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
    hours: z.string().default(''),
    minutes: z.string().default(''),
  }),
})

export type CurfewConditionsFormData = z.infer<typeof CurfewConditionsFormDataModel>

const CurfewConditionsFormDataValidator = z.object({
  startDate: DateTimeInputModel(validationErrors.curfewConditions.startDateTime),
  endDate: DateTimeInputModel(validationErrors.curfewConditions.endDateTime),
})

type CurfewConditionsApiRequestBody = z.infer<typeof CurfewConditionsFormDataValidator>

export { CurfewConditionsFormDataModel, CurfewConditionsApiRequestBody, CurfewConditionsFormDataValidator }
