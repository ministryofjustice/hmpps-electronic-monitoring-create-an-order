import { createGovukErrorSummary } from '../../utils/errors'
import { deserialiseTime, getError } from '../../utils/utils'
import { AttendanceMonitoring } from '../AttendanceMonitoring'
import { AttendanceMonitoringFormData } from '../form-data/attendanceMonitoring'
import { ValidationResult } from '../Validation'
import { AddressField, DateField, TimeField, ViewModel } from './utils'

type AttendanceMonitoringViewModel = ViewModel<Pick<AttendanceMonitoring, 'appointmentDay' | 'purpose'>> & {
  address: AddressField
  endDate: DateField
  endTime: TimeField
  startDate: DateField
  startTime: TimeField
}

const deserialiseDate = (dateString: string | null) => {
  if (dateString === null || dateString === '') {
    return {
      day: '',
      month: '',
      year: '',
    }
  }

  const date = new Date(dateString)

  return {
    day: date.getDate().toString().padStart(2, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    year: date.getFullYear().toString(),
  }
}

const constructFromFormData = (
  formData: AttendanceMonitoringFormData,
  validationErrors: ValidationResult,
): AttendanceMonitoringViewModel => {
  return {
    address: {
      value: {
        line1: formData.addressLine1,
        line2: formData.addressLine2,
        line3: formData.addressLine3,
        line4: formData.addressLine4,
        postcode: formData.addressPostcode,
      },
      error: getError(validationErrors, 'address'),
    },
    appointmentDay: {
      value: formData.appointmentDay,
      error: getError(validationErrors, 'appointmentDay'),
    },
    endDate: {
      value: {
        day: formData['endDate-day'],
        month: formData['endDate-month'],
        year: formData['endDate-year'],
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
        day: formData['startDate-day'],
        month: formData['startDate-month'],
        year: formData['startDate-year'],
      },
      error: getError(validationErrors, 'startDate'),
    },
    startTime: {
      value: { hours: formData.startTimeHours, minutes: formData.startTimeMinutes },
      error: getError(validationErrors, 'startTime'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createFromEntity = (attendanceMonitoring?: AttendanceMonitoring): AttendanceMonitoringViewModel => {
  const [startTimeHours, startTimeMinutes] = deserialiseTime(attendanceMonitoring?.startTime)
  const [endTimeHours, endTimeMinutes] = deserialiseTime(attendanceMonitoring?.endTime)

  return {
    address: {
      value: {
        line1: attendanceMonitoring?.addressLine1 || '',
        line2: attendanceMonitoring?.addressLine2 || '',
        line3: attendanceMonitoring?.addressLine3 || '',
        line4: attendanceMonitoring?.addressLine4 || '',
        postcode: attendanceMonitoring?.postcode || '',
      },
    },
    appointmentDay: {
      value: attendanceMonitoring?.appointmentDay || '',
    },
    endDate: {
      value: deserialiseDate(attendanceMonitoring?.endDate ?? null),
    },
    endTime: {
      value: { hours: endTimeHours, minutes: endTimeMinutes },
    },
    purpose: { value: attendanceMonitoring?.purpose || '' },
    startDate: {
      value: deserialiseDate(attendanceMonitoring?.startDate ?? null),
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
