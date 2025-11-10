import { z } from 'zod'
import { DateTimeInputModel } from '../../../models/form-data/formData'
import { validationErrors } from '../../../constants/validationErrors'

export const MonitoringDatesFormDataModel = z
  .object({
    action: z.string(),
    startDate: DateTimeInputModel(validationErrors.monitoringConditions.startDateTime),
    endDate: DateTimeInputModel(validationErrors.monitoringConditions.endDateTime),
  })
  .superRefine((val, ctx) => {
    if (new Date(val.endDate!) <= new Date(Date.now())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationErrors.monitoringConditions.endDateTime.date.mustNoInPast,
        fatal: true,
        params: {
          focusPath: 'day',
        },
        path: ['endDate'],
      })
      return z.NEVER
    }

    if (new Date(val.endDate!) <= new Date(val.startDate!)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationErrors.monitoringConditions.endDateTime.date.mustAfterStartDate,
        fatal: true,
        params: {
          focusPath: 'day',
        },
        path: ['endDate'],
      })
      return z.NEVER
    }
    return false
  })

export default MonitoringDatesFormDataModel
