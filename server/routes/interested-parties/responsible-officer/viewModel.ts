import { InterestedParties } from '../model'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { getError } from '../../../utils/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { ResponsibleOfficer } from './formModel'

type ResponsibleOfficerViewModel = ViewModel<
  Pick<InterestedParties, 'responsibleOfficerFirstName' | 'responsibleOfficerLastName' | 'responsibleOfficerEmail'>
> & {}

const construct = (
  data: InterestedParties,
  formData: ResponsibleOfficer | undefined,
  errors: ValidationResult,
): ResponsibleOfficerViewModel => {
  if (formData) return constructFromFormData(formData, errors)

  return constructFromData(data)
}

const constructFromData = (data: InterestedParties): ResponsibleOfficerViewModel => {
  return {
    responsibleOfficerFirstName: {
      value: data.responsibleOfficerFirstName || '',
    },
    responsibleOfficerLastName: {
      value: data.responsibleOfficerLastName || '',
    },
    responsibleOfficerEmail: {
      value: data.responsibleOfficerEmail || '',
    },
    errorSummary: null,
  }
}

const constructFromFormData = (formData: ResponsibleOfficer, errors: ValidationResult): ResponsibleOfficerViewModel => {
  return {
    responsibleOfficerFirstName: {
      value: formData?.responsibleOfficerFirstName || '',
      error: getError(errors, 'responsibleOfficerFirstName'),
    },
    responsibleOfficerLastName: {
      value: formData?.responsibleOfficerLastName || '',
      error: getError(errors, 'responsibleOfficerLastName'),
    },
    responsibleOfficerEmail: {
      value: formData?.responsibleOfficerEmail || '',
      error: getError(errors, 'responsibleOfficerEmail'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { construct }
