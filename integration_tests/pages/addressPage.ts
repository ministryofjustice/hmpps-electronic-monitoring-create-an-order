import AppPage from './appPage'
import AddressFormComponent from './components/forms/addressForm'
import { PageElement } from './page'

export default class AddressPage extends AppPage {
  form = new AddressFormComponent()

  constructor(
    title: string,
    uri: string,
    private readonly subheading: string,
  ) {
    super(title, uri)
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()

    cy.get('.govuk-fieldset__legend--l', { log: false }).contains(this.subheading)
  }

  get backToSummaryButton(): PageElement {
    return cy.get('a#backToSummary')
  }
}