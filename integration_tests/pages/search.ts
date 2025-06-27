import { v4 as uuidv4 } from 'uuid'

import AppPage from './appPage'

import { PageElement } from './page'

export default class IndexPage extends AppPage {
  protected elementCacheId: string = uuidv4()

  constructor() {
    super('Electronic Monitoring Application forms', '/search', 'Existing application forms')

    // cy.get('#ordersList', { log: false }).as(`${this.elementCacheId}-orders`)
  }

  get searchButton(): PageElement {
    return cy.contains('Search')
  }

  get searchBox(): PageElement {
    return cy.get('#search')
  }
}
