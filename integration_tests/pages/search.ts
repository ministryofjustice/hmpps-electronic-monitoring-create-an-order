import { v4 as uuidv4 } from 'uuid'

import AppPage from './appPage'

import { PageElement } from './page'

export default class IndexPage extends AppPage {
  protected elementCacheId: string = uuidv4()

  constructor() {
    super('Search for a submitted form', '/search')

    // cy.get('#ordersList', { log: false }).as(`${this.elementCacheId}-orders`)
  }

  get searchButton(): PageElement {
    return cy.contains('Search')
  }

  get searchBox(): PageElement {
    return cy.get('#search')
  }
}
