import { createGovukErrorSummary } from '../../../utils/errors'
import { getError, deserialiseDateTime } from '../../../utils/utils'
import { EnforcementZone } from '../../../models/EnforcementZone'
import { ValidationResult } from '../../../models/Validation'
import { DateTimeField, TextField, ViewModel } from '../../../models/view-models/utils'
import { EnforcementZoneAddToListFormData } from './formModel'

type EnforcementZoneAddToListViewModel = ViewModel<Pick<EnforcementZone, 'description' | 'duration'>> & {
  endDate: DateTimeField
  startDate: DateTimeField
  file: TextField
  name?: TextField
}

const constructFromFormData = (
  formData: EnforcementZoneAddToListFormData,
  validationErrors: ValidationResult,
): EnforcementZoneAddToListViewModel => {
  return {
    description: {
      value: formData.description,
      error: getError(validationErrors, 'description'),
    },
    duration: {
      value: formData.duration,
      error: getError(validationErrors, 'duration'),
    },
    name: {
      value: formData.name || '',
      error: getError(validationErrors, 'name'),
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

const createFromEntity = (
  zoneId: number,
  enforcementZones: Array<EnforcementZone>,
): EnforcementZoneAddToListViewModel => {
  const currentZone = enforcementZones.find(zone => zone.zoneId === zoneId)

  return {
    description: {
      value: currentZone?.description || '',
    },
    duration: {
      value: currentZone?.duration || '',
    },
    // name: {
    //   value: currentZone?.name || '',
    // },
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
  formData: EnforcementZoneAddToListFormData,
  errors: ValidationResult,
): EnforcementZoneAddToListViewModel => {
  if (errors.length > 0) {
    return constructFromFormData(formData, errors)
  }

  return createFromEntity(zoneId, enforcementZones)
}

export default {
  construct,
}
