import { v4 as uuidv4 } from 'uuid'
import SearchPage from '../pages/search'
import Page from '../pages/page'
import { mockApiOrder } from '../mockApis/cemo'

const mockOrderId = uuidv4()

const basicOrder = mockApiOrder()

context('Search', () => {
  context('Searching for sumitted orders', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoSearchOrders')
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
      cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })
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
    })

    describe('when rendering an order', () => {
      const mockDate = new Date(2000, 10, 20).toISOString()
      const mockOrder = {
        ...basicOrder,
        status: 'SUBMITTED',
        deviceWearer: {
          ...basicOrder.deviceWearer,
          firstName: 'Bob',
          lastName: 'Builder',
          dateOfBirth: mockDate,
          pncId: 'some id',
        },
        curfewConditions: {
          startDate: mockDate,
          endDate: mockDate,
          curfewAddress: null,
          curfewAdditionalDetails: null,
        },
        fmsResultDate: mockDate,
        addresses: [
          {
            addressType: 'PRIMARY',
            addressLine1: '',
            addressLine2: '',
            addressLine3: 'Glossop',
            addressLine4: '',
            postcode: '',
          },
        ],
      }

      let page: SearchPage

      beforeEach(() => {
        cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [mockOrder] })
        page = Page.visit(SearchPage)

        page.searchBox.type('Bob')
        page.searchButton.click()
      })

      it('should show correct headings', () => {
        page.ordersList.contains('Name')
        page.ordersList.contains('Date of birth')
        page.ordersList.contains('Personal ID number')
        page.ordersList.contains('Start date')
        page.ordersList.contains('End date')
        page.ordersList.contains('Last updated')
      })

      it('should show correct order details', () => {
        page.ordersList.contains('Bob Builder')
        page.ordersList.contains('some id')
        page.ordersList.contains('Glossop')
        page.ordersList.contains('20/11/2000')
      })
    })
  })
})
