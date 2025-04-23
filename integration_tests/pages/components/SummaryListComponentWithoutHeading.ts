import { PageElement } from '../page'

export default class SummaryListComponentWithoutHeading {
  constructor() {}

  get element(): PageElement {
    return cy.get('.govuk-summary-list')
  }

  shouldExist() {
    this.element.should('exist')
  }

  shouldHaveItems(items: Array<{ key: string; value: string }>) {
    return items.map(({ key, value }) => this.shouldHaveItem(key, value))
  }

  shouldHaveItem(key: string, value: string) {
    return this.element
      .contains('.govuk-summary-list__key', key)
      .siblings('.govuk-summary-list__value')
      .should('contain.text', value)
  }
}
