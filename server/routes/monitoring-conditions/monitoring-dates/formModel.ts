import { z } from 'zod'
import { DateTimeInputModel } from '../../../models/form-data/formData'
import { validationErrors } from '../../../constants/validationErrors'

export const MonitoringDatesFormDataModel = z.object({
  action: z.string(),
  startDate: DateTimeInputModel(validationErrors.monitoringConditions.startDateTime),
  endDate: DateTimeInputModel(validationErrors.monitoringConditions.endDateTime),
})

export default MonitoringDatesFormDataModel
