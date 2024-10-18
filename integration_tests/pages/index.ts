import AppPage from './appPage'
import { PageElement } from './page'

export default class IndexPage extends AppPage {
  constructor() {
    super('Electronic Monitoring Application Forms', '/')
  }

  newOrderForm = (): PageElement => cy.get('form[action="/order/create"]')

  newOrderFormButton = (): PageElement => this.newOrderForm().get('button[type=submit]')

  searchInput = (): PageElement => cy.get('#keyword')

  searchButton = (): PageElement => cy.get('button:contains("Search")')

  ordersList = (): PageElement => cy.get('#ordersList')

  ordersListItems = (): PageElement => cy.get('#ordersList ul li')
}
