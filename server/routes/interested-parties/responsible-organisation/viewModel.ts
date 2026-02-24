import { InterestedParties } from '../model'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { getError } from '../../../utils/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import isOrderDataDictionarySameOrAbove from '../../../utils/dataDictionaryVersionComparer'
import { Order } from '../../../models/Order'
import { ResponsibleOrganisationInput } from './formModel'
import { getResponsibleOrganisationRegion } from './utils'

type responsibleOrganisationViewModel = ViewModel<
  Pick<InterestedParties, 'responsibleOrganisation' | 'responsibleOrganisationRegion' | 'responsibleOrganisationEmail'>
> & { DDv5: boolean }

const construct = (
  data: InterestedParties,
  formData: ResponsibleOrganisationInput | undefined,
  errors: ValidationResult,
  order: Order,
): responsibleOrganisationViewModel => {
  if (formData) return constructFromFormData(formData, errors, order)

  return constructFromData(data, order)
}

const constructFromData = (data: InterestedParties, order: Order): responsibleOrganisationViewModel => {
  return {
    responsibleOrganisation: {
      value: data.responsibleOrganisation || '',
    },
    responsibleOrganisationRegion: {
      value: data.responsibleOrganisationRegion || '',
    },
    responsibleOrganisationEmail: {
      value: data.responsibleOrganisationEmail || '',
    },
    errorSummary: null,
    DDv5: isOrderDataDictionarySameOrAbove('DDV5', order),
  }
}

const constructFromFormData = (
  formData: ResponsibleOrganisationInput,
  errors: ValidationResult,
  order: Order,
): responsibleOrganisationViewModel => {
  return {
    responsibleOrganisation: {
      value: formData?.responsibleOrganisation || '',
      error: getError(errors, 'responsibleOrganisation'),
    },
    responsibleOrganisationRegion: {
      value: getResponsibleOrganisationRegion(formData) || '',
      error: getError(errors, 'responsibleOrganisationRegion'),
    },
    responsibleOrganisationEmail: {
      value: formData?.responsibleOrganisationEmail || '',
      error: getError(errors, 'responsibleOrganisationEmail'),
    },
    errorSummary: createGovukErrorSummary(errors),
    DDv5: isOrderDataDictionarySameOrAbove('DDV5', order),
  }
}

export default { construct }
