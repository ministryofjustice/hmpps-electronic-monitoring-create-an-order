import z from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'

const EnforcementZoneFormDataModel = z.object({
  action: z.string(),
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
  zoneId: z.number().nullable().default(null),
  description: z.string().default(''),
  duration: z.string().default(''),
  anotherZone: z.string().default(''),
})

type EnforcementZoneFormData = Omit<z.infer<typeof EnforcementZoneFormDataModel>, 'action'>

const EnforcementZoneFormDataValidator = z
  .object({
    zoneId: z.number().nullable().default(0),
    startDate: DateTimeInputModel(validationErrors.enforcementZone.startDateTime),
    endDate: DateTimeInputModel(validationErrors.enforcementZone.endDateTime),
    description: z
      .string()
      .min(1, validationErrors.enforcementZone.descriptionRequired)
      .max(200, validationErrors.enforcementZone.descriptionTooLong),
    duration: z
      .string()
      .min(1, validationErrors.enforcementZone.durationRequired)
      .max(200, validationErrors.enforcementZone.durationTooLong),
    anotherZone: z.string().min(1, { message: validationErrors.enforcementZone.anotherZoneRequired }),
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
