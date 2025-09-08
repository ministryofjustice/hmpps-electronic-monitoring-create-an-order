import { v4 as uuidv4 } from 'uuid'

import AppPage from './appPage'

import { PageElement } from './page'

export default class SearchPage extends AppPage {
  protected elementCacheId: string = uuidv4()

  constructor() {
    super('Electronic Monitoring Order (EMO) forms', '/search')
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

  get variationFormButton(): PageElement {
    return cy.contains('Tell us about a change to a form sent by email')
  }
}
