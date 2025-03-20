import { createGovukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'
import { EnforcementZone } from '../EnforcementZone'
import { EnforcementZoneFormData } from '../form-data/enforcementZone'
import { ValidationResult } from '../Validation'
import { DateField, TextField, ViewModel } from './utils'

type EnforcementZoneViewModel = ViewModel<Pick<EnforcementZone, 'description' | 'duration'>> & {
  endDate: DateField
  startDate: DateField
  anotherZone: TextField
  file: TextField
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
    day: date.getDate().toString(),
    month: (date.getMonth() + 1).toString(),
    year: date.getFullYear().toString(),
  }
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
        day: formData.endDay,
        month: formData.endMonth,
        year: formData.endYear,
      },
      error: getError(validationErrors, 'endDate'),
    },
    file: {
      value: '',
      error: getError(validationErrors, 'file'),
    },
    startDate: {
      value: {
        day: formData.startDay,
        month: formData.startMonth,
        year: formData.startYear,
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
      value: deserialiseDate(currentZone?.endDate || ''),
    },
    file: {
      value: '',
    },
    startDate: {
      value: deserialiseDate(currentZone?.startDate || ''),
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
