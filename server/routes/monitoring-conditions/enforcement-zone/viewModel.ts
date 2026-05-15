import { createGovukErrorSummary } from '../../../utils/errors'
import { getError, deserialiseDateTime } from '../../../utils/utils'
import { EnforcementZone } from '../../../models/EnforcementZone'
import { ValidationResult } from '../../../models/Validation'
import { DateTimeField, TextField, ViewModel } from '../../../models/view-models/utils'
import { EnforcementZoneAddToListFormData } from './formModel'
import { Order } from '../../../models/Order'

type EnforcementZoneAddToListViewModel = ViewModel<Pick<EnforcementZone, 'description' | 'duration'>> & {
  endDate?: DateTimeField
  startDate: DateTimeField
  file: TextField
  name?: TextField
  showEndate: boolean
}

const constructFromFormData = (
  formData: EnforcementZoneAddToListFormData,
  validationErrors: ValidationResult,
  order: Order,
): EnforcementZoneAddToListViewModel => {
  const viewModel: EnforcementZoneAddToListViewModel = {
    description: {
      value: formData.description,
      error: getError(validationErrors, 'description'),
    },
    duration: {
      value: formData.duration,
      error: getError(validationErrors, 'duration'),
    },
    name: {
      value: formData.name,
      error: getError(validationErrors, 'name'),
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
    showEndate: order.interestedParties?.notifyingOrganisation !== 'HOME_OFFICE',
    errorSummary: createGovukErrorSummary(validationErrors),
  }
  if (formData.endDate) {
    viewModel.endDate = {
      value: {
        day: formData.endDate.day,
        month: formData.endDate.month,
        year: formData.endDate.year,
        hours: formData.endDate.hours,
        minutes: formData.endDate.minutes,
      },
      error: getError(validationErrors, 'endDate'),
    }
  }
  return viewModel
}

const createFromEntity = (zoneId: number, order: Order): EnforcementZoneAddToListViewModel => {
  const enforcementZones = order!.enforcementZoneConditions
  const currentZone = enforcementZones.find(zone => zone.zoneId === zoneId)

  return {
    description: {
      value: currentZone?.description || '',
    },
    duration: {
      value: currentZone?.duration || '',
    },
    name: {
      value: currentZone?.name || '',
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
    showEndate: order.interestedParties?.notifyingOrganisation !== 'HOME_OFFICE',
    errorSummary: null,
  }
}

const construct = (
  zoneId: number,
  order: Order,
  formData: EnforcementZoneAddToListFormData,
  errors: ValidationResult,
): EnforcementZoneAddToListViewModel => {
  if (errors.length > 0) {
    return constructFromFormData(formData, errors, order)
  }

  return createFromEntity(zoneId, order)
}

export default {
  construct,
}
