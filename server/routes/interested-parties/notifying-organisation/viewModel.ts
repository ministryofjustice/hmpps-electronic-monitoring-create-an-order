import { InterestedParties } from '../model'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { getError } from '../../../utils/utils'

type NotifyingOrganisationViewModel = ViewModel<
  Pick<InterestedParties, 'notifyingOrganisation' | 'notifyingOrganisationName' | 'notifyingOrganisationEmail'>
>

const construct = (data: InterestedParties, errors: ValidationResult): NotifyingOrganisationViewModel => {
  return {
    notifyingOrganisation: {
      value: data.notifyingOrganisation || '',
      error: getError(errors, 'notifyingOrganisation'),
    },
    notifyingOrganisationName: {
      value: data.notifyingOrganisationName || '',
      error: getError(errors, 'notifyingOrganisationName'),
    },
    notifyingOrganisationEmail: {
      value: data.notifyingOrganisationEmail || '',
      error: getError(errors, 'notifyingOrganisationEmail'),
    },
    errorSummary: null,
  }
}

export default { construct }
