import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import ContactDetailsFormComponent from '../../components/forms/contact-information/contactDetailsForm'

export default class ContactDetailsPage extends AppFormPage {
  public form = new ContactDetailsFormComponent()

  constructor() {
    super('Telephone number', paths.CONTACT_INFORMATION.CONTACT_DETAILS, 'Contact information')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
