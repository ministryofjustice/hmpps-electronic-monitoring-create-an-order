import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'

import VariationDetailsPage from '../../../pages/order/variation/variationDetails'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'

const mockOrderId = uuidv4()
const apiPath = '/variation'
const sampleFormData = {
  variationType: 'Change of curfew hours',
  variationDate: new Date(2024, 0, 1),
}

context('Variation', () => {
  context('Variation Details', () => {
    context('Submitting valid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            variationType: 'CURFEW_HOURS',
            variationDate: '2024-01-01T00:00:00.000Z',
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted variation details submission', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            variationType: 'CURFEW_HOURS',
            variationDate: '2024-01-01T00:00:00.000Z',
          },
        }).should('be.true')
      })

      it('should continue to collect device wearer details', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(AboutDeviceWearerPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
