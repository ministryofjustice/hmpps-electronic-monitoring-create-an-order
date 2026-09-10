import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import content from '../../../../server/i18n/en/pages/identityNumbers'
import IdentityNumbersFormComponent, {
  IdentityNumberName,
} from '../../components/forms/about-the-device-wearer/identityNumbersForm'

export const identityNumberNamesForNotifyingOrganisation = (notifyingOrganisation?: string): IdentityNumberName[] => {
  if (notifyingOrganisation === 'Probation' || notifyingOrganisation === 'Probation service') {
    return ['nomisId', 'deliusId']
  }
  if (notifyingOrganisation === 'Prison' || notifyingOrganisation === 'Prison Service') {
    return ['nomisId']
  }
  if (notifyingOrganisation === 'Youth Custody Service') {
    return ['pncId', 'nomisId']
  }
  if (notifyingOrganisation === 'Home Office') {
    return ['complianceAndEnforcementPersonReference']
  }
  if (notifyingOrganisation?.includes('Court')) {
    return ['courtCaseReferenceNumber']
  }
  return ['nomisId', 'deliusId', 'pncId', 'complianceAndEnforcementPersonReference', 'courtCaseReferenceNumber']
}

export default class IdentityNumbersPage extends AppFormPage {
  form: IdentityNumbersFormComponent

  constructor(options: IdentityNumberName[] = ['pncId', 'nomisId']) {
    super(
      options.length === 1 ? content.singleQuestionTitles[options[0]] : content.legend,
      paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS,
      'About the device wearer',
    )
    this.form = new IdentityNumbersFormComponent(options)
  }
}
