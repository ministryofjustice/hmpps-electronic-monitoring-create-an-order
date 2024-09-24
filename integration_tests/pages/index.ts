import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Electronic Monitoring Application Forms')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  newOrderForm = (): PageElement => cy.get('form[action="/order/create"]')

  newOrderFormButton = (): PageElement => cy.get('form[action="/order/create"] button[type=submit]')

  searchInput = (): PageElement => cy.get('#keyword')

  searchButton = (): PageElement => cy.get('button:contains("Search")')

  ordersList = (): PageElement => cy.get('#ordersList')

  ordersListItems = (): PageElement => cy.get('#ordersList ul li')
}
