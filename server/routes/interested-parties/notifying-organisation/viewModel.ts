import { InterestedParties } from '../model'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { getError } from '../../../utils/utils'
import { NotifyingOrganisationInput } from './formModel'
import { getNotifyingOrganisationName } from './utils'
import { createGovukErrorSummary } from '../../../utils/errors'

type NotifyingOrganisationViewModel = ViewModel<
  Pick<InterestedParties, 'notifyingOrganisation' | 'notifyingOrganisationName' | 'notifyingOrganisationEmail'>
> & {
  cohort?: string
}

const construct = (
  formData: NotifyingOrganisationInput | undefined,
  errors: ValidationResult,
  cohort?: string,
): NotifyingOrganisationViewModel => {
  if (formData) return constructFromFormData(formData, errors, cohort)

  return constructFromData(cohort)
}

const constructFromData = (cohort?: string): NotifyingOrganisationViewModel => {
  return {
    notifyingOrganisation: {
      value: '',
    },
    notifyingOrganisationName: {
      value: '',
    },
    notifyingOrganisationEmail: {
      value: '',
    },
    errorSummary: null,
    cohort,
  }
}

const constructFromFormData = (
  formData: NotifyingOrganisationInput,
  errors: ValidationResult,
  cohort?: string,
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
    cohort,
  }
}

export default { construct }
