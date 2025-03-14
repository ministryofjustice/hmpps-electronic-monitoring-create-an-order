import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import InterestedPartiesFormComponent from '../../components/forms/contact-information/interestedPartiesForm'

export default class InterestedPartiesPage extends AppFormPage {
  public form = new InterestedPartiesFormComponent()

  constructor() {
    super('Organisation details', paths.CONTACT_INFORMATION.INTERESTED_PARTIES, 'Contact information')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
