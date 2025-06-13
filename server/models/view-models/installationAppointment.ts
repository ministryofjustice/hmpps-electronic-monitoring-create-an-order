import { deserialiseDateTime } from '../../utils/utils'
import { InstallationAppointment } from '../InstallationAppointment'
import { DateTimeField, ViewModel } from './utils'

type InstallationAppointmentViewModel = ViewModel<Pick<InstallationAppointment, 'placeName'>> & {
  appointmentDate: DateTimeField
}

const constructFromEntity = (
  appointment: InstallationAppointment | undefined | null,
): InstallationAppointmentViewModel => {
  return {
    placeName: {
      value: appointment?.placeName || '',
    },
    appointmentDate: {
      value: deserialiseDateTime(appointment?.appointmentDate),
    },
    errorSummary: null,
  }
}
const construct = (appointment: InstallationAppointment | undefined | null): InstallationAppointmentViewModel => {
  return constructFromEntity(appointment)
}

export default {
  construct,
}
