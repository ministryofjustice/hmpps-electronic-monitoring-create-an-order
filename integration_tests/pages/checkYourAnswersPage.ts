import AppPage from './appPage'
import { PageElement } from './page'

export default class CheckYourAnswersPage extends AppPage {
  continueButton = (): PageElement => cy.get('[value="continue"]')

  returnButton = (): PageElement => cy.get('.govuk-button--secondary')

  get changeLinks() {
    return cy.contains('.govuk-link', 'Change')
  }

  checkOnPage(): void {
    cy.get('h1', { log: false }).contains(this.title)

    if (this.subtitle) {
      cy.get('h1 span', { log: false }).contains(this.subtitle)
    }
  }
}
