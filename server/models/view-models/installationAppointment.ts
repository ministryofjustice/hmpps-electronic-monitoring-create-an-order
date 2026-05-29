import { deserialiseDateTime, getError } from '../../utils/utils'
import { InstallationAppointment } from '../InstallationAppointment'
import { ValidationResult } from '../Validation'
import { InstallationAppointmentFormData } from '../form-data/installationAppointment'
import { DateTimeField, ViewModel } from './utils'
import { createGovukErrorSummary } from '../../utils/errors'

type InstallationAppointmentViewModel = ViewModel<Pick<InstallationAppointment, 'placeName'>> & {
  appointmentDate: DateTimeField
  isHomeOffice: boolean
}

const constructFromEntity = (
  appointment: InstallationAppointment | undefined | null,
  isHomeOffice: boolean,
): InstallationAppointmentViewModel => {
  return {
    placeName: {
      value: appointment?.placeName || '',
    },
    appointmentDate: {
      value: deserialiseDateTime(appointment?.appointmentDate),
    },
    isHomeOffice,
    errorSummary: null,
  }
}

const constructFromFormData = (
  formData: InstallationAppointmentFormData,
  isHomeOffice: boolean,
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
    isHomeOffice,
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const construct = (
  appointment: InstallationAppointment | undefined | null,
  formData: InstallationAppointmentFormData,
  isHomeOffice: boolean,
  validationErrors: ValidationResult,
): InstallationAppointmentViewModel => {
  if (validationErrors.length > 0 && formData) {
    return constructFromFormData(formData, isHomeOffice, validationErrors)
  }
  return constructFromEntity(appointment, isHomeOffice)
}

export default {
  construct,
}
