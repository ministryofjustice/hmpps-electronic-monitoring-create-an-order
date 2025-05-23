import { createGovukErrorSummary } from '../../utils/errors'
import { getError, deserialiseDateTime } from '../../utils/utils'
import { EnforcementZone } from '../EnforcementZone'
import { EnforcementZoneFormData } from '../form-data/enforcementZone'
import { ValidationResult } from '../Validation'
import { DateTimeField, TextField, ViewModel } from './utils'

type EnforcementZoneViewModel = ViewModel<Pick<EnforcementZone, 'description' | 'duration'>> & {
  endDate: DateTimeField
  startDate: DateTimeField
  anotherZone: TextField
  file: TextField
}

const constructFromFormData = (
  formData: EnforcementZoneFormData,
  validationErrors: ValidationResult,
): EnforcementZoneViewModel => {
  return {
    anotherZone: {
      value: formData.anotherZone,
      error: getError(validationErrors, 'anotherZone'),
    },
    description: {
      value: formData.description,
      error: getError(validationErrors, 'description'),
    },
    duration: {
      value: formData.duration,
      error: getError(validationErrors, 'duration'),
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
    file: {
      value: '',
      error: getError(validationErrors, 'file'),
    },
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
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createFromEntity = (zoneId: number, enforcementZones: Array<EnforcementZone>): EnforcementZoneViewModel => {
  const currentZone = enforcementZones.find(zone => zone.zoneId === zoneId)
  const hasAnotherZone = enforcementZones.some(zone => zone.zoneId === zoneId + 1)

  return {
    anotherZone: {
      value: hasAnotherZone.toString(),
    },
    description: {
      value: currentZone?.description || '',
    },
    duration: {
      value: currentZone?.duration || '',
    },
    endDate: {
      value: deserialiseDateTime(currentZone?.endDate || ''),
    },
    file: {
      value: '',
    },
    startDate: {
      value: deserialiseDateTime(currentZone?.startDate || ''),
    },
    errorSummary: null,
  }
}

const construct = (
  zoneId: number,
  enforcementZones: Array<EnforcementZone>,
  formData: EnforcementZoneFormData,
  errors: ValidationResult,
): EnforcementZoneViewModel => {
  if (errors.length > 0) {
    return constructFromFormData(formData, errors)
  }

  return createFromEntity(zoneId, enforcementZones)
}

export default {
  construct,
}
