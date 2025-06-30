import { v4 as uuidv4 } from 'uuid'
import SearchPage from '../pages/search'
import Page from '../pages/page'
import { mockApiOrder } from '../mockApis/cemo'

const mockOrderId = uuidv4()

const basicOrder = mockApiOrder()

context('Index', () => {
  context('Viewing the order list', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('Should render the correct elements ', () => {
      const page = Page.visit(SearchPage)

      // Header
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      // Search
      page.searchButton.should('exist')
      page.searchBox.should('exist')
    })

    it('should show a message when the search button is clicked without input', () => {
      const page = Page.visit(SearchPage)

      page.searchButton.click()

      page.ordersList.contains('You have not entered any search terms')
      page.ordersList.contains("Try searching using the device wearer's")
      page.ordersList.contains('first name and surname')
    })

    it('should show a message when there are no results', () => {
      cy.task('stubCemoListOrders', { httpStatus: 200, orders: [] })
      const page = Page.visit(SearchPage)

      page.searchBox.type('Unknown name')
      page.searchButton.click()

      page.ordersList.contains("No results found for 'Unknown name'")
      page.ordersList.contains('Check spelling is correct.')
      page.ordersList.contains("Try searching using the device wearer's full name")
      page.ordersList.contains("Can't find what you are looking for?")
      page.ordersList.contains(
        'If the form is not listed in the search results, it may be an emailed form so not available online.',
      )
      page.ordersList.contains('Tell us about changes to a form sent by email')
    })

    it('should show a orders after search', () => {
      const mockOrder = {
        ...basicOrder,
        status: 'SUBMITTED',
        deviceWearer: { ...basicOrder.deviceWearer, firstName: 'Bob', lastName: 'Builder', dateOfBirth: null },
      }
      cy.task('stubCemoListOrders', { httpStatus: 200, orders: [mockOrder] })
      const page = Page.visit(SearchPage)

      page.searchBox.type('Bob')
      page.searchButton.click()

      page.ordersList.contains('Bob')
    })
  })
})
