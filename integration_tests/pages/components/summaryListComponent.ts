import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export default class SummaryListComponent {
  private elementCacheId: string = uuidv4()

  constructor(private readonly label: string) {}

  get element(): PageElement {
    return cy.contains('h2', this.label)
  }

  get list(): PageElement {
    return this.element.siblings('.govuk-summary-list')
  }

  // Helpers

  shouldExist() {
    this.element.should('exist')
  }

  shouldNotExist() {
    this.element.should('not.exist')
  }

  shouldHaveItem(key: string, value: string) {
    return this.list
      .contains('.govuk-summary-list__key', key)
      .siblings('.govuk-summary-list__value')
      .should('contain.text', value)
  }

  shouldHaveItems(items: Array<{ key: string; value: string }>) {
    return items.map(({ key, value }) => this.shouldHaveItem(key, value))
  }

  shouldNotHaveItem(key: string) {
    return this.list.should('not.contain.text', key)
  }

  shouldNotHaveItems(keys: Array<string>) {
    return keys.map(key => this.shouldNotHaveItem(key))
  }
}
