import z from 'zod'
import { DateTimeInputModel } from '../../../models/form-data/formData'
import { validationErrors } from '../../../constants/validationErrors'
import { NotifyingOrganisation } from '../../../models/NotifyingOrganisation'

const EnforcementZoneAddToListFormDataModel = z.object({
  action: z.string(),
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
  zoneId: z.number().nullable().default(null),
  description: z.string().default(''),
  duration: z.string().default(''),
  name: z.string().default(''),
})

type EnforcementZoneAddToListFormData = Omit<z.infer<typeof EnforcementZoneAddToListFormDataModel>, 'action'>

const EnforcementZoneAddToListFormDataValidator = (
  notifyingOrganisation: NotifyingOrganisation | null,
  zoneType: 'exclusion' | 'restriction',
) =>
  z
    .object({
      zoneId: z.number().nullable().default(0),
      startDate: DateTimeInputModel(validationErrors.enforcementZone.startDateTime(zoneType)),
      endDate:
        notifyingOrganisation !== 'HOME_OFFICE'
          ? DateTimeInputModel(validationErrors.enforcementZone.endDateTime(zoneType))
          : z.any().optional(),
      name: z.string().min(1, validationErrors.enforcementZone.nameRequired(zoneType)),
      description: z
        .string()
        .min(1, validationErrors.enforcementZone.descriptionRequired(zoneType))
        .max(500, validationErrors.enforcementZone.descriptionTooLong(zoneType)),
      duration: z
        .string()
        .min(1, validationErrors.enforcementZone.durationRequired(zoneType))
        .max(200, validationErrors.enforcementZone.durationTooLong(zoneType)),
    })
    .transform(({ ...formData }) => ({
      zoneType: zoneType.toUpperCase(),
      ...formData,
    }))

type EnforcementZoneAddToListApiRequestBody = z.infer<ReturnType<typeof EnforcementZoneAddToListFormDataValidator>>

export {
  EnforcementZoneAddToListFormDataModel,
  EnforcementZoneAddToListApiRequestBody,
  EnforcementZoneAddToListFormDataValidator,
  EnforcementZoneAddToListFormData,
}
