import AppPage from '../../appPage'
import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'

import ContactDetailsFormComponent from '../../components/forms/contact-information/contactDetailsForm'

export default class ContactDetailsPage extends AppPage {
  public form = new ContactDetailsFormComponent()

  constructor() {
    super('Contact information', paths.CONTACT_INFORMATION.CONTACT_DETAILS)
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }

  get backToSummaryButton(): PageElement {
    return cy.get('a#backToSummary')
  }
}
