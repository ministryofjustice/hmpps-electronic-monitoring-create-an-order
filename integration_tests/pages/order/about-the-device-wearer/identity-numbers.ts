import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import content from '../../../../server/i18n/en/pages/identityNumbers'
import IdentityNumbersFormComponent, {
  IdentityNumberName,
} from '../../components/forms/about-the-device-wearer/identityNumbersForm'

export default class IdentityNumbersPage extends AppFormPage {
  form = new IdentityNumbersFormComponent()

  constructor(options: IdentityNumberName[] = ['pncId', 'nomisId']) {
    super(
      options.length === 1 ? content.singleQuestionTitles[options[0]] : content.legend,
      paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS,
      'About the device wearer',
    )
  }
}
