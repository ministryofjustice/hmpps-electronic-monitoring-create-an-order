import z from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'

const EnforcementZoneFormDataModel = z.object({
  action: z.string(),
  zoneId: z.number().nullable().default(null),
  description: z.string().default(''),
  duration: z.string().default(''),
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
  anotherZone: z.string().default(''),
})

type EnforcementZoneFormData = Omit<z.infer<typeof EnforcementZoneFormDataModel>, 'action'>

const EnforcementZoneFormDataValidator = z
  .object({
    zoneId: z.number().nullable(),
    description: z.string().min(1, validationErrors.enforcementZone.descriptionRequired),
    duration: z.string().min(1, validationErrors.enforcementZone.durationRequired),
    startDate: DateTimeInputModel(validationErrors.enforcementZone.startDateTime),
    endDate: DateTimeInputModel(validationErrors.enforcementZone.endDateTime),
  })
  .transform(({ ...formData }) => ({
    zoneType: 'EXCLUSION',
    ...formData,
  }))

type EnforcementZoneApiRequestBody = z.infer<typeof EnforcementZoneFormDataValidator>

export {
  EnforcementZoneFormDataModel,
  EnforcementZoneApiRequestBody,
  EnforcementZoneFormDataValidator,
  EnforcementZoneFormData,
}
