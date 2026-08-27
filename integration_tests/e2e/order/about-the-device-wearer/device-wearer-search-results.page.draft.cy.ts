import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import DeviceWearerSearchResultsPage from '../../../pages/order/about-the-device-wearer/device-wearer-search-results'

const mockOrderId = uuidv4()

const searchedIdentifier = 'A1234BC'

context('About the device wearer', () => {
  context('Device wearer search results', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    })

    it('should display matched device wearer details', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: `orders/${mockOrderId}/device-wearer-details\\?organisationSearchId=${searchedIdentifier}`,
        response: {
          firstName: 'Ermintrude',
          lastName: 'Jones',
          dateOfBirth: '1974-01-19T00:00:00Z',
          organisationSearchId: searchedIdentifier,
        },
      })

      cy.signIn()

      const page = Page.visit(DeviceWearerSearchResultsPage, {
        orderId: mockOrderId,
        identifyNumber: searchedIdentifier,
      })

      page.form.useThisDeviceWearerButton.should('be.enabled')
      page.form.saveAsDraftButton.should('exist')
      page.form.searchAgainLink.should('exist')
      page.form.enterDetailsManuallyLink.should('exist')
      cy.contains('1 device wearer found for A1234BC.')
      cy.contains('Ermintrude Jones')
      cy.contains('Date of birth - 19 January 1974')
      page.checkIsAccessible()
    })

    it('should display no results content with disabled use button', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: `orders/${mockOrderId}/device-wearer-details\\?organisationSearchId=${searchedIdentifier}`,
        response: {
          firstName: null,
          lastName: null,
          dateOfBirth: null,
          organisationSearchId: searchedIdentifier,
        },
      })

      cy.signIn()

      const page = Page.visit(DeviceWearerSearchResultsPage, {
        orderId: mockOrderId,
        identifyNumber: searchedIdentifier,
      })

      page.form.useThisDeviceWearerButton.should('not.exist')
      page.form.saveAsDraftButton.should('not.exist')
      cy.contains('We could not find a device wearer that matches A1234BC.')
      page.checkIsAccessible()
    })
  })
})
