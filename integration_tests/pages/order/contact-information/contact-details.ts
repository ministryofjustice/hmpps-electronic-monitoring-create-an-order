import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import ContactDetailsFormComponent from '../../components/forms/contact-information/contactDetailsForm'

export default class ContactDetailsPage extends AppFormPage {
  public form = new ContactDetailsFormComponent()

  constructor() {
    super('Contact information', paths.CONTACT_INFORMATION.CONTACT_DETAILS)
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
