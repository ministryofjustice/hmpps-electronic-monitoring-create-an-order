import { z } from 'zod'
import { DateInputModel } from '../../../models/form-data/formData'
import { validationErrors } from '../../../constants/validationErrors'

export const MonitoringDatesFormDataModel = z.object({
  action: z.string(),
  startDate: DateInputModel(validationErrors.monitoringConditions.startDateTime.date),
  endDate: DateInputModel(validationErrors.monitoringConditions.endDateTime.date),
})

export default MonitoringDatesFormDataModel
