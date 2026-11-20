import { InstallationAppointment } from '../../../models/InstallationAppointment'
import { ValidationResult } from '../../../models/Validation'
import { InstallationAppointmentFormData } from './formModel'
import { DateTimeField, ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { Question } from '../../../types/i18n/pages/questionPage'
import { getError } from '../../../utils/validation/errorMessages'
import { deserialiseDateTime } from '../../../utils/dateTime'

type InstallationAppointmentViewModel = ViewModel<
  Pick<InstallationAppointment, 'placeName' | 'appointmentTimeDetails'>
> & {
  appointmentDate: DateTimeField
  appointmentTimeLabel: string
  appointmentTimeHint: string
  showAppointmentTimeDetails: boolean
  installationLocation?: string
  notifyingOrganisation?: string | null
}

const constructFromEntity = (
  appointment: InstallationAppointment | undefined | null,
  question: Question,
  showAppointmentTimeDetails: boolean,
  installationLocation?: string,
  notifyingOrganisation?: string | null,
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
    installationLocation,
    notifyingOrganisation,
  }
}

const constructFromFormData = (
  formData: InstallationAppointmentFormData,
  validationErrors: ValidationResult,
  question: Question,
  showAppointmentTimeDetails: boolean,
  installationLocation?: string,
  notifyingOrganisation?: string | null,
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
    installationLocation,
    notifyingOrganisation,
  }
}

const construct = (
  appointment: InstallationAppointment | undefined | null,
  formData: InstallationAppointmentFormData,
  question: Question,
  showAppointmentTimeDetails: boolean,
  validationErrors: ValidationResult,
  installationLocation?: string,
  notifyingOrganisation?: string | null,
): InstallationAppointmentViewModel => {
  if (validationErrors.length > 0 && formData) {
    return constructFromFormData(
      formData,
      validationErrors,
      question,
      showAppointmentTimeDetails,
      installationLocation,
      notifyingOrganisation,
    )
  }
  return constructFromEntity(
    appointment,
    question,
    showAppointmentTimeDetails,
    installationLocation,
    notifyingOrganisation,
  )
}

export default {
  construct,
}
