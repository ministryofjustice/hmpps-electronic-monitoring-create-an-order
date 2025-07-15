import { v4 as uuidv4 } from 'uuid'

import AppPage from './appPage'

import { PageElement } from './page'

export default class IndexPage extends AppPage {
  protected elementCacheId: string = uuidv4()

  constructor() {
    super('Electronic Monitoring Application forms', '/', 'Existing application forms')

    cy.get('#ordersList', { log: false }).as(`${this.elementCacheId}-orders`)
  }

  get newOrderFormButton(): PageElement {
    return cy.contains('Start new form')
  }

  get newVariationFormButton(): PageElement {
    return cy.contains('Change submitted form')
  }

  get searchFormButton(): PageElement {
    return cy.contains('Search submitted form')
  }

  get ordersList(): PageElement {
    return cy.get(`@${this.elementCacheId}-orders`)
  }

  get orders(): PageElement {
    return this.ordersList.get('.govuk-task-list__item')
  }

  SubmittedOrderFor(name: string): PageElement {
    return this.ordersList.contains('li', `${name} Submitted`)
  }

  SubmittedVariationFor(name: string): PageElement {
    return this.ordersList.contains('li', `${name} Variation Submitted`)
  }

  IncompleteOrderFor(name: string): PageElement {
    return this.ordersList.contains('li', `${name} Incomplete`)
  }

  DraftOrderFor(name: string): PageElement {
    return this.ordersList.contains('li', `${name} Draft`)
  }

  FailedOrderFor(name: string): PageElement {
    return this.ordersList.contains('li', `${name} Failed to submit`)
  }
}
