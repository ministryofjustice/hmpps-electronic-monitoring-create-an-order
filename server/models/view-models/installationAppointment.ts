import { deserialiseDateTime, getError } from '../../utils/utils'
import { InstallationAppointment } from '../InstallationAppointment'
import { ValidationResult } from '../Validation'
import { InstallationAppointmentFormData } from '../form-data/installationAppointment'
import { DateTimeField, ViewModel } from './utils'
import { createGovukErrorSummary } from '../../utils/errors'

type InstallationAppointmentViewModel = ViewModel<Pick<InstallationAppointment, 'placeName'>> & {
  appointmentDate: DateTimeField
  appointmentTimeLabel: string
  appointmentTimeHint: string
}

const constructFromEntity = (
  appointment: InstallationAppointment | undefined | null,
  appointmentTimeLabel: string,
  appointmentTimeHint: string,
): InstallationAppointmentViewModel => {
  return {
    placeName: {
      value: appointment?.placeName || '',
    },
    appointmentDate: {
      value: deserialiseDateTime(appointment?.appointmentDate),
    },
    appointmentTimeLabel,
    appointmentTimeHint,
    errorSummary: null,
  }
}

const constructFromFormData = (
  formData: InstallationAppointmentFormData,
  appointmentTimeLabel: string,
  appointmentTimeHint: string,
  validationErrors: ValidationResult,
): InstallationAppointmentViewModel => {
  return {
    placeName: {
      value: formData?.placeName || '',
      error: getError(validationErrors, 'placeName'),
    },
    appointmentDate: {
      value: {
        day: formData.appointmentDate.day,
        month: formData.appointmentDate.month,
        year: formData.appointmentDate.year,
        hours: formData.appointmentDate.hours,
        minutes: formData.appointmentDate.minutes,
      },
      timeError: getError(validationErrors, 'appointmentDate-hours'),
      dateError: getError(validationErrors, 'appointmentDate'),
    },
    appointmentTimeLabel,
    appointmentTimeHint,
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const construct = (
  appointment: InstallationAppointment | undefined | null,
  formData: InstallationAppointmentFormData,
  appointmentTimeLabel: string,
  appointmentTimeHint: string,
  validationErrors: ValidationResult,
): InstallationAppointmentViewModel => {
  if (validationErrors.length > 0 && formData) {
    return constructFromFormData(formData, appointmentTimeLabel, appointmentTimeHint, validationErrors)
  }
  return constructFromEntity(appointment, appointmentTimeLabel, appointmentTimeHint)
}

export default {
  construct,
}
