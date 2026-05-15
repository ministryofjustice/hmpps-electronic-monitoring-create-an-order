import { z } from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'
import { NotifyingOrganisation } from '../NotifyingOrganisation'

const CurfewConditionsFormDataModel = z.object({
  action: z.string().default('continue'),
  startDate: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
    hours: z.string().default(''),
    minutes: z.string().default(''),
  }),
  endDate: z
    .object({
      day: z.string().default(''),
      month: z.string().default(''),
      year: z.string().default(''),
      hours: z.string().default(''),
      minutes: z.string().default(''),
    })
    .optional(),
})

export type CurfewConditionsFormData = z.infer<typeof CurfewConditionsFormDataModel>

const CurfewConditionsFormDataValidator = (notifyingOrganisation: NotifyingOrganisation | null) =>
  z.object({
    startDate: DateTimeInputModel(validationErrors.curfewConditions.startDateTime),
    endDate:
      notifyingOrganisation !== 'HOME_OFFICE'
        ? DateTimeInputModel(validationErrors.curfewConditions.endDateTime)
        : z.any().optional(),
  })

type CurfewConditionsApiRequestBody = z.infer<ReturnType<typeof CurfewConditionsFormDataValidator>>

export { CurfewConditionsFormDataModel, CurfewConditionsApiRequestBody, CurfewConditionsFormDataValidator }
