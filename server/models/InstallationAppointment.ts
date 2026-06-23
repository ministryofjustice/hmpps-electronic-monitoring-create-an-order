import { z } from 'zod'

const InstallationAppointmentModel = z.object({
  placeName: z.string().nullable(),
  appointmentDate: z.string().datetime().nullable(),
  appointmentTimeDetails: z.string().nullable().optional(),
})

export type InstallationAppointment = z.infer<typeof InstallationAppointmentModel>

export default InstallationAppointmentModel
