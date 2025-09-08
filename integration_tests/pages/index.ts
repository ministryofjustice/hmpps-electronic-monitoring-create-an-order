import AppPage from './appPage'

import { PageElement } from './page'

export default class IndexPage extends AppPage {
  constructor() {
    super('Electronic Monitoring Order (EMO) forms', '/', 'Existing application forms')
  }

  get newOrderFormButton(): PageElement {
    return cy.contains('Start new form')
  }

  get newVariationFormButton(): PageElement {
    return cy.contains('Change submitted form')
  }

  get ordersList(): PageElement {
    return cy.get('#ordersList')
  }

  get orders(): PageElement {
    return this.ordersList.get('.govuk-table__body').find('.govuk-table__row')
  }

  get subNav(): PageElement {
    return cy.get('.moj-sub-navigation')
  }

  OrderFor(name: string): PageElement {
    return this.ordersList.contains('td', name)
  }

  TableContains(name: string, status: string): PageElement {
    return this.ordersList
      .contains('td', name)
      .parent()
      .within(() => {
        cy.get('.govuk-table__cell').contains(status).should('be.visible')
      })
  }

  IsAccesible(name: string, index: number) {
    const expectedId = `order-${index}-status`
    this.OrderFor(name).find('a').should('have.attr', 'aria-describedby', expectedId)
    this.OrderFor(name)
      .parent()
      .within(() => {
        cy.get(`#${expectedId}`).should('exist')
      })
  }
}
