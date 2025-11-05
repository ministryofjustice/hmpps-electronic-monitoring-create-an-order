import z from 'zod'
import { DateTimeInputModel } from '../../../models/form-data/formData'
import { validationErrors } from '../../../constants/validationErrors'

const EnforcementZoneAddToListFormDataModel = z.object({
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
  name: z.string().default('').optional(),
})

type EnforcementZoneAddToListFormData = Omit<z.infer<typeof EnforcementZoneAddToListFormDataModel>, 'action'>

const EnforcementZoneAddToListFormDataValidator = z
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
    name: z.string().min(1, validationErrors.enforcementZone.nameRequired),
  })
  .transform(({ ...formData }) => ({
    zoneType: 'EXCLUSION',
    ...formData,
  }))

type EnforcementZoneAddToListApiRequestBody = z.infer<typeof EnforcementZoneAddToListFormDataValidator>

export {
  EnforcementZoneAddToListFormDataModel,
  EnforcementZoneAddToListApiRequestBody,
  EnforcementZoneAddToListFormDataValidator,
  EnforcementZoneAddToListFormData,
}
