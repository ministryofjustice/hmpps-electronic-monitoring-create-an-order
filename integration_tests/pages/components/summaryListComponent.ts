import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export default class SummaryListComponent {
  private elementCacheId: string = uuidv4()

  constructor(private readonly label: string) {}

  get element(): PageElement {
    return cy.contains('h2', this.label)
  }

  // Helpers

  shouldExist() {
    this.element.should('exist')
  }

  shouldNotExist() {
    this.element.should('not.exist')
  }
}
