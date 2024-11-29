import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import IdentityNumbersFormComponent from '../../components/forms/about-the-device-wearer/identityNumbersForm'

export default class IdentityNumbersPage extends AppFormPage {
  form = new IdentityNumbersFormComponent()

  constructor() {
    super('Identity numbers', paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS, '')
  }
}
