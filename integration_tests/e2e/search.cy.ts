import { v4 as uuidv4 } from 'uuid'
import SearchPage from '../pages/search'
import Page from '../pages/page'
import { mockApiOrder } from '../mockApis/cemo'
import OrderTasksPage from '../pages/order/summary'
import IndexPage from '../pages'
import ServiceRequestTypePage from './order/variation/service-request-type/serviceRequestTypePage'

const mockOrderId = uuidv4()

const basicOrder = mockApiOrder()

context('Search', () => {
  context('Searching for submitted orders', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoSearchOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', type: 'VARIATION' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('Should render the correct elements ', () => {
      const page = Page.visit(SearchPage)

      // Header
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      // Create buttons
      page.newOrderFormButton.should('exist')

      page.searchHint.contains("Enter the device wearer's full name or personal identity number.")
      page.searchHint.contains('For example Bob Smith C4365JN.')

      page.subNav.should('exist')
      page.subNav.contains('Draft forms').should('have.attr', 'href', `/`)
      page.subNav.contains('Draft forms').should('not.have.attr', 'aria-current', 'page')
      page.subNav.contains('Submitted forms').should('have.attr', 'href', `/search`)
      page.subNav.contains('Submitted forms').should('have.attr', 'aria-current', `page`)

      // Search
      page.searchButton.should('exist')
      page.searchBox.should('exist')

      // Details
      page.detailsSummary.contains("What's a personal identity number?")
      page.detailsSummary.click()
      page.detailsList.contains('National Offender Management Information System (NOMIS)')
      page.detailsList.contains('Police National Computer (PNC)')
      page.detailsList.contains('NDelius ID')
      page.detailsList.contains('Prison Number')
      page.detailsList.contains('Compliance and Enforcement Person Reference (CEPR)')
      page.detailsList.contains('Court Case Reference Number (CCRN)')
    })

    it('should navigate to index when the draft forms nav link is clicked', () => {
      const page = Page.visit(SearchPage)

      page.subNav.contains('Draft forms').click()

      Page.verifyOnPage(IndexPage)
    })

    it('should navigate to search page when the submitted forms nav link is clicked', () => {
      const page = Page.visit(SearchPage)

      page.subNav.contains('Submitted forms').click()

      Page.verifyOnPage(SearchPage)
    })

    it('should show a message when the search button is clicked without input', () => {
      const page = Page.visit(SearchPage)

      page.searchButton.click()

      page.ordersList.contains('You have not entered any search terms')
      page.ordersList.contains("Try searching using the device wearer's:")
      page.ordersList.contains('first name and surname')
      page.ordersList.contains('personal ID number')
      page.ordersList.contains('full name and personal ID number')
      page.ordersList.contains('Check spelling is correct and numbers are in the right place.')

      // Details
      page.detailsSummary.contains("What's a personal identity number?")
      page.detailsSummary.click()
      page.detailsList.contains('National Offender Management Information System (NOMIS)')
      page.detailsList.contains('Police National Computer (PNC)')
      page.detailsList.contains('NDelius ID')
      page.detailsList.contains('Prison Number')
      page.detailsList.contains('Compliance and Enforcement Person Reference (CEPR)')
      page.detailsList.contains('Court Case Reference Number (CCRN)')
    })

    it('should show a message when there are no results', () => {
      cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })
      const page = Page.visit(SearchPage)

      page.searchBox.type('Unknown name')
      page.searchButton.click()

      page.ordersList.contains("No results found for 'Unknown name'")
      page.ordersList.contains('Check spelling is correct and numbers are in the right place.')
      page.ordersList.contains("Try searching using the device wearer's personal ID number, full name or both.")
      page.ordersList.contains("Can't find what you are looking for?")
      page.ordersList.contains(
        'If the form is not listed in the search results, it may be an emailed form so not available online.',
      )

      page.detailsSummary.should('not.exist')
    })

    it('should show "Tell us about a change.." button when there are no results', () => {
      cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })

      const page = Page.visit(SearchPage)

      page.searchBox.type('Unknown name')
      page.searchButton.click()

      page.variationFormButton.should('exist').should('contain.text', 'Tell us about a change to a form sent by email')
      page.variationFormButton.click()
      Page.verifyOnPage(OrderTasksPage)
    })

    context('Service Request Type Enabled', () => {
      const testFlags = { SERVICE_REQUEST_TYPE_ENABLED: true }
      beforeEach(() => {
        cy.task('setFeatureFlags', testFlags)
      })
      afterEach(() => {
        cy.task('resetFeatureFlags')
      })
      it('should show "Tell us about a change.." button when there are no results and go to service request type page', () => {
        cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })

        const page = Page.visit(SearchPage)

        page.searchBox.type('Unknown name')
        page.searchButton.click()

        page.variationFormButton
          .should('exist')
          .should('contain.text', 'Tell us about a change to a form sent by email')
        page.variationFormButton.click()
        Page.verifyOnPage(ServiceRequestTypePage)
      })
    })

    it('should create a new variation order when the "Tell us about.." button is clicked', () => {
      cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })
      const page = Page.visit(SearchPage)

      page.searchBox.type('Unknown name')
      page.searchButton.click()

      page.variationFormButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders`,
        method: 'POST',
        body: {
          type: 'VARIATION',
        },
      }).should('be.true')

      Page.verifyOnPage(OrderTasksPage)
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
          nomisId: 'some other id',
          complianceAndEnforcementPersonReference: 'cepr',
          courtCaseReferenceNumber: 'ccrn',
        },
        monitoringConditions: {
          ...basicOrder.monitoringConditions,
          startDate: mockDate,
          endDate: mockDate,
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
      })

      describe('when searching by name', () => {
        beforeEach(() => {
          page.searchBox.type('Bob Builder')
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

      describe('when searching by personal ID number', () => {
        beforeEach(() => {
          page.searchBox.type('cepr')
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
          page.ordersList.contains('cepr')
          page.ordersList.contains('ccrn')
          page.ordersList.contains('Glossop')
          page.ordersList.contains('20/11/2000')
        })
      })
    })

    context('Submitting a create order request', () => {
      it('should create a new order', () => {
        // Visit the search page
        const page = Page.visit(SearchPage)

        // Create a new order
        page.newOrderFormButton.click()

        // Verify the api was called correctly
        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders`,
          method: 'POST',
          body: {
            type: 'REQUEST',
          },
        }).should('be.true')

        // Verify the user was redirected to the task page
        Page.verifyOnPage(OrderTasksPage)
      })
    })

    context('Submitting a create variation request', () => {
      // I think this is empty but not sure why
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', type: 'VARIATION' })
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.signIn()
      })
    })
  })
})
