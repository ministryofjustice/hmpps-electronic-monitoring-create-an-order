import z from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'

const InstallationAppointmentFormDataModel = z.object({
  action: z.string().default('continue'),
  placeName: z.string().default(''),
  appointmentDate: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
    hours: z.string().default(''),
    minutes: z.string().default(''),
  }),
  appointmentTimeDetails: z.string().default(''),
})

type InstallationAppointmentFormData = z.infer<typeof InstallationAppointmentFormDataModel>

const InstallationAppointmentFormDataValidator = (appointmentTimeDetailsRequired: boolean) =>
  z.object({
    placeName: z.string().min(1, validationErrors.installationAppointment.placeNameRequired),
    appointmentDate: DateTimeInputModel(validationErrors.installationAppointment.appointmentDate),
    appointmentTimeDetails: appointmentTimeDetailsRequired
      ? z
          .string()
          .min(1, validationErrors.installationAppointment.appointmentTimeDetailsRequired)
          .max(500, validationErrors.installationAppointment.appointmentTimeDetailsTooLong)
      : z.string().optional(),
  })

export default InstallationAppointmentFormDataModel
export { InstallationAppointmentFormData, InstallationAppointmentFormDataValidator }
