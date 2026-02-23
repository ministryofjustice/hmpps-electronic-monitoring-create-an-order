import { InterestedParties } from '../model'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { getError } from '../../../utils/utils'
import { NotifyingOrganisationInput } from './formModel'
import { getNotifyingOrganisationName } from './utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import isOrderDataDictionarySameOrAbove from '../../../utils/dataDictionaryVersionComparer'
import { Order } from '../../../models/Order'

type NotifyingOrganisationViewModel = ViewModel<
  Pick<InterestedParties, 'notifyingOrganisation' | 'notifyingOrganisationName' | 'notifyingOrganisationEmail'>
> & { DDv5: boolean }

const construct = (
  data: InterestedParties,
  formData: NotifyingOrganisationInput | undefined,
  errors: ValidationResult,
  order: Order,
): NotifyingOrganisationViewModel => {
  if (formData) return constructFromFormData(formData, errors, order)

  return constructFromData(data, order)
}

const constructFromData = (data: InterestedParties, order: Order): NotifyingOrganisationViewModel => {
  return {
    notifyingOrganisation: {
      value: data.notifyingOrganisation || '',
    },
    notifyingOrganisationName: {
      value: data.notifyingOrganisationName || '',
    },
    notifyingOrganisationEmail: {
      value: data.notifyingOrganisationEmail || '',
    },
    errorSummary: null,
    DDv5: isOrderDataDictionarySameOrAbove('DDV5', order),
  }
}

const constructFromFormData = (
  formData: NotifyingOrganisationInput,
  errors: ValidationResult,
  order: Order,
): NotifyingOrganisationViewModel => {
  return {
    notifyingOrganisation: {
      value: formData?.notifyingOrganisation || '',
      error: getError(errors, 'notifyingOrganisation'),
    },
    notifyingOrganisationName: {
      value: getNotifyingOrganisationName(formData) || '',
      error: getError(errors, 'notifyingOrganisationName'),
    },
    notifyingOrganisationEmail: {
      value: formData?.notifyingOrganisationEmail || '',
      error: getError(errors, 'notifyingOrganisationEmail'),
    },
    errorSummary: createGovukErrorSummary(errors),
    DDv5: isOrderDataDictionarySameOrAbove('DDV5', order),
  }
}

export default { construct }
