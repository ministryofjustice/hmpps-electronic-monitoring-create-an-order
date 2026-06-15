import { deserialiseDateTime, getError } from '../../utils/utils'
import { InstallationAppointment } from '../InstallationAppointment'
import { ValidationResult } from '../Validation'
import { InstallationAppointmentFormData } from '../form-data/installationAppointment'
import { DateTimeField, ViewModel } from './utils'
import { createGovukErrorSummary } from '../../utils/errors'
import { Question } from '../../types/i18n/pages/questionPage'

type InstallationAppointmentViewModel = ViewModel<
  Pick<InstallationAppointment, 'placeName' | 'appointmentTimeDetails'>
> & {
  appointmentDate: DateTimeField
  appointmentTimeLabel: string
  appointmentTimeHint: string
  showAppointmentTimeDetails: boolean
}

const constructFromEntity = (
  appointment: InstallationAppointment | undefined | null,
  question: Question,
  showAppointmentTimeDetails: boolean,
): InstallationAppointmentViewModel => {
  return {
    placeName: {
      value: appointment?.placeName || '',
    },
    appointmentDate: {
      value: deserialiseDateTime(appointment?.appointmentDate),
    },
    appointmentTimeDetails: {
      value: appointment?.appointmentTimeDetails || '',
    },
    showAppointmentTimeDetails,
    appointmentTimeHint: question.hint!,
    appointmentTimeLabel: question.text,
    errorSummary: null,
  }
}

const constructFromFormData = (
  formData: InstallationAppointmentFormData,
  validationErrors: ValidationResult,
  question: Question,
  showAppointmentTimeDetails: boolean,
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
    appointmentTimeDetails: {
      value: formData?.appointmentTimeDetails || '',
      error: getError(validationErrors, 'appointmentTimeDetails'),
    },
    showAppointmentTimeDetails,
    appointmentTimeHint: question.hint!,
    appointmentTimeLabel: question.text,
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const construct = (
  appointment: InstallationAppointment | undefined | null,
  formData: InstallationAppointmentFormData,
  question: Question,
  showAppointmentTimeDetails: boolean,
  validationErrors: ValidationResult,
): InstallationAppointmentViewModel => {
  if (validationErrors.length > 0 && formData) {
    return constructFromFormData(formData, validationErrors, question, showAppointmentTimeDetails)
  }
  return constructFromEntity(appointment, question, showAppointmentTimeDetails)
}

export default {
  construct,
}
