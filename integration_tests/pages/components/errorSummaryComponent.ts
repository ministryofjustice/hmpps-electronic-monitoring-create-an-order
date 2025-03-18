import { PageElement } from '../page'

export default class ErrorSummaryComponent {
  protected get element(): PageElement {
    return cy.get('.govuk-error-summary', { log: false })
  }

  protected get title(): PageElement {
    return this.element.get('.govuk-error-summary__title')
  }

  protected get errorList(): PageElement {
    return this.element.get('.govuk-error-summary__list')
  }

  shouldExist() {
    return this.element.should('exist')
  }

  shouldNotExist() {
    return this.element.should('not.exist')
  }

  shouldHaveError(error: string) {
    return this.errorList.contains(error)
  }

  shouldHaveTitle(title: string) {
    return this.title.contains(title)
  }
}
