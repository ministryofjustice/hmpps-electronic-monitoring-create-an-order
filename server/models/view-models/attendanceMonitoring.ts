import { createGovukErrorSummary } from '../../utils/errors'
import { deserialiseTime, deserialiseDateTime, getError } from '../../utils/utils'
import { AttendanceMonitoring } from '../AttendanceMonitoring'
import { AttendanceMonitoringFormData } from '../form-data/attendanceMonitoring'
import { ValidationResult } from '../Validation'
import { DateTimeField, TextField, TimeField, ViewModel } from './utils'

type AttendanceMonitoringViewModel = ViewModel<Pick<AttendanceMonitoring, 'appointmentDay' | 'purpose'>> & {
  addressLine1: TextField
  addressLine2: TextField
  addressLine3: TextField
  addressLine4: TextField
  postcode: TextField
  endDate: DateTimeField
  endTime: TimeField
  startDate: DateTimeField
  startTime: TimeField
  addAnother?: TextField
}

const constructFromFormData = (
  formData: AttendanceMonitoringFormData,
  validationErrors: ValidationResult,
): AttendanceMonitoringViewModel => {
  return {
    addressLine1: {
      value: formData.addressLine1,
      error: getError(validationErrors, 'addressLine1'),
    },
    addressLine2: {
      value: formData.addressLine2,
    },
    addressLine3: {
      value: formData.addressLine3,
    },
    addressLine4: {
      value: formData.addressLine4,
    },
    postcode: {
      value: formData.postcode,
      error: getError(validationErrors, 'postcode'),
    },
    appointmentDay: {
      value: formData.appointmentDay,
      error: getError(validationErrors, 'appointmentDay'),
    },
    endDate: {
      value: {
        day: formData.endDate.day,
        month: formData.endDate.month,
        year: formData.endDate.year,
        hours: formData.endDate.hours,
        minutes: formData.endDate.minutes,
      },
      error: getError(validationErrors, 'endDate'),
    },
    endTime: {
      value: { hours: formData.endTimeHours, minutes: formData.endTimeMinutes },
      error: getError(validationErrors, 'endTime'),
    },
    purpose: { value: formData.purpose, error: getError(validationErrors, 'purpose') },
    startDate: {
      value: {
        day: formData.startDate.day,
        month: formData.startDate.month,
        year: formData.startDate.year,
        hours: formData.startDate.hours,
        minutes: formData.startDate.minutes,
      },
      error: getError(validationErrors, 'startDate'),
    },
    startTime: {
      value: { hours: formData.startTimeHours, minutes: formData.startTimeMinutes },
      error: getError(validationErrors, 'startTime'),
    },
    addAnother: {
      value: formData.addAnother,
      error: getError(validationErrors, 'addAnother'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createFromEntity = (attendanceMonitoring?: AttendanceMonitoring): AttendanceMonitoringViewModel => {
  const [startTimeHours, startTimeMinutes] = deserialiseTime(attendanceMonitoring?.startTime)
  const [endTimeHours, endTimeMinutes] = deserialiseTime(attendanceMonitoring?.endTime)

  return {
    addressLine1: {
      value: attendanceMonitoring?.addressLine1 || '',
    },
    addressLine2: {
      value: attendanceMonitoring?.addressLine2 || '',
    },
    addressLine3: {
      value: attendanceMonitoring?.addressLine3 || '',
    },
    addressLine4: {
      value: attendanceMonitoring?.addressLine4 || '',
    },
    postcode: {
      value: attendanceMonitoring?.postcode || '',
    },
    appointmentDay: {
      value: attendanceMonitoring?.appointmentDay || '',
    },
    endDate: {
      value: deserialiseDateTime(attendanceMonitoring?.endDate ?? null),
    },
    endTime: {
      value: { hours: endTimeHours, minutes: endTimeMinutes },
    },
    purpose: { value: attendanceMonitoring?.purpose || '' },
    startDate: {
      value: deserialiseDateTime(attendanceMonitoring?.startDate ?? null),
    },
    startTime: {
      value: { hours: startTimeHours, minutes: startTimeMinutes },
    },
    errorSummary: null,
  }
}

const construct = (
  attendanceMonitoring: AttendanceMonitoring | undefined,
  formData: AttendanceMonitoringFormData | undefined,
  errors: ValidationResult,
): AttendanceMonitoringViewModel => {
  if (errors.length > 0 && formData !== undefined) {
    return constructFromFormData(formData, errors)
  }

  return createFromEntity(attendanceMonitoring)
}

export default {
  construct,
}
