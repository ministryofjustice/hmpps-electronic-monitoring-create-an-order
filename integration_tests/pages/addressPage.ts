import AppFormPage from './appFormPage'

import AddressFormComponent from './components/forms/addressForm'
import { PageElement } from './page'

export default class AddressPage extends AppFormPage {
  form = new AddressFormComponent(this.canCreateAnotherAddress)

  constructor(
    title: string,
    uri: string,
    private readonly subheading: string,
    private readonly canCreateAnotherAddress: boolean = true,
  ) {
    super(title, uri, subheading)
  }

  get backToSummaryButton(): PageElement {
    return cy.get('a#backToSummary')
  }

  checkOnPage(): void {
    super.checkOnPage()
    this.form.checkHasForm()
  }

  clearAndRepopulate(newAddress) {
    this.form.clearAndRepopulate(newAddress)
    this.form.saveAndContinueButton.click()
  }
}
