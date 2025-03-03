import { PageElement } from '../page'

export default class ErrorSummaryComponent {
  protected get element(): PageElement {
    return cy.get('.govuk-error-summary', { log: false })
  }

  shouldExist() {
    return this.element.should('exist')
  }

  shouldNotExist() {
    return this.element.should('not.exist')
  }

  shouldHaveError(error: string) {
    return this.element.contains(error)
  }
}
