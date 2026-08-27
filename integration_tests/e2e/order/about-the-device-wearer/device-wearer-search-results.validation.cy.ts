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
    })

    it("should not show 'Use this device wearer' or 'Save as draft' when no match is found", () => {
      const page = Page.visit(DeviceWearerSearchResultsPage, {
        orderId: mockOrderId,
        identifyNumber: searchedIdentifier,
      })

      page.form.useThisDeviceWearerButton.should('not.exist')
      page.form.saveAsDraftButton.should('not.exist')
      page.errorSummary.shouldNotExist()
    })
  })
})
