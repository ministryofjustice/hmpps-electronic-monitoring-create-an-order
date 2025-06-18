import { z } from 'zod'

const InstallationAppointmentModel = z.object({
  placeName: z.string().nullable(),
  appointmentDate: z.string().datetime().nullable(),
})

export type InstallationAppointment = z.infer<typeof InstallationAppointmentModel>

export default InstallationAppointmentModel
