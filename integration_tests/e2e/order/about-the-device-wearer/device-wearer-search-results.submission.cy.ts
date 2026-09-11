import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import DeviceWearerSearchResultsPage from '../../../pages/order/about-the-device-wearer/device-wearer-search-results'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'
import OrderSummaryPage from '../../../pages/order/summary'

const mockOrderId = uuidv4()
const searchedIdentifier = 'A1234BC'

context('About the device wearer', () => {
  context('Device wearer search results', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
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
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'PUT',
        subPath: `orders/${mockOrderId}/device-wearer-details`,
        response: {},
      })
      cy.signIn()
    })

    it('should continue to personal details when using matched device wearer', () => {
      const page = Page.visit(DeviceWearerSearchResultsPage, {
        orderId: mockOrderId,
        identifyNumber: searchedIdentifier,
      })
      page.form.useThisDeviceWearerButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/device-wearer-details`,
        method: 'PUT',
        body: {
          organisationSearchId: searchedIdentifier,
        },
      }).should('be.true')

      Page.verifyOnPage(AboutDeviceWearerPage, { orderId: mockOrderId })
    })

    it('should return to identity numbers when searching again', () => {
      const page = Page.visit(DeviceWearerSearchResultsPage, {
        orderId: mockOrderId,
        identifyNumber: searchedIdentifier,
      })
      page.form.searchAgainLink.click()

      Page.verifyOnPage(IdentityNumbersPage, { orderId: mockOrderId })
    })

    it('should continue to manual personal details when entering details manually', () => {
      const page = Page.visit(DeviceWearerSearchResultsPage, {
        orderId: mockOrderId,
        identifyNumber: searchedIdentifier,
      })
      page.form.enterDetailsManuallyLink.click()

      Page.verifyOnPage(AboutDeviceWearerPage, { orderId: mockOrderId })
    })

    it('should return to summary when saving as draft', () => {
      const page = Page.visit(DeviceWearerSearchResultsPage, {
        orderId: mockOrderId,
        identifyNumber: searchedIdentifier,
      })
      page.form.saveAsDraftButton.click()

      Page.verifyOnPage(OrderSummaryPage)
    })
  })
})
