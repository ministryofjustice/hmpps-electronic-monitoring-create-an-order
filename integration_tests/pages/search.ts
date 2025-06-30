import { v4 as uuidv4 } from 'uuid'

import AppPage from './appPage'

import { PageElement } from './page'

export default class IndexPage extends AppPage {
  protected elementCacheId: string = uuidv4()

  constructor() {
    super('Search for a submitted form', '/search')
  }

  get searchButton(): PageElement {
    return cy.get('.govuk-button').contains('Search')
  }

  get searchBox(): PageElement {
    return cy.get('#search')
  }

  get ordersList(): PageElement {
    return cy.get('#ordersList')
  }
}
