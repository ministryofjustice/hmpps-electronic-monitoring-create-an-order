import AppPage from './appPage'
import { PageElement } from './page'

export default class CheckYourAnswersPage extends AppPage {
  continueButton = (): PageElement => cy.get('[value="continue"]')

  returnButton = (): PageElement => cy.get('.govuk-button--secondary')

  get changeLinks() {
    return cy.contains('.govuk-link', 'Change')
  }
}
