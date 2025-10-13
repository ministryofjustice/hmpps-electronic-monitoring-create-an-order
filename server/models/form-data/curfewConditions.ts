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
  addresses: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
})

export type CurfewConditionsFormData = z.infer<typeof CurfewConditionsFormDataModel>

const CurfewConditionsFormDataValidator = z
  .object({
    startDate: DateTimeInputModel(validationErrors.curfewConditions.startDateTime),
    endDate: DateTimeInputModel(validationErrors.curfewConditions.endDateTime),
    addresses: z.array(z.string()).min(1, validationErrors.curfewConditions.addressesRequired),
  })
  .transform(({ addresses, ...formData }) => ({
    curfewAddress: addresses.join(',') ?? '',
    ...formData,
  }))

type CurfewConditionsApiRequestBody = z.infer<typeof CurfewConditionsFormDataValidator>

export { CurfewConditionsFormDataModel, CurfewConditionsApiRequestBody, CurfewConditionsFormDataValidator }
