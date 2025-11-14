import { PageElement } from '../page'

export default class SummaryListComponentWithoutHeading {
  constructor() {}

  get element(): PageElement {
    return cy.get('.govuk-summary-list')
  }

  shouldExist() {
    this.element.should('exist')
  }

  shouldNotExist() {
    this.element.should('not.exist')
  }

  shouldHaveItems(items: Array<{ key: string; value: string }>) {
    return items.map(({ key, value }) => this.shouldHaveItem(key, value))
  }

  shouldHaveItem(key: string, value: string) {
    return this.element
      .find('.govuk-summary-list__value')
      .contains(value)
      .siblings('.govuk-summary-list__key')
      .should('contain.text', key)
  }

  shouldNotHaveItem(key: string) {
    return this.element.contains('.govuk-summary-list__key', key).should('not.exist')
  }
}
