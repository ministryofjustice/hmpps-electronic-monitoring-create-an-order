import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import InterestedPartiesFormComponent from '../../components/forms/contact-information/interestedPartiesForm'

export default class InterestedPartiesPage extends AppFormPage {
  public form = new InterestedPartiesFormComponent()

  constructor() {
    super('Contact information', paths.CONTACT_INFORMATION.INTERESTED_PARTIES, 'Team details')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
