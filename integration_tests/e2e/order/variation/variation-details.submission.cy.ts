import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'

import VariationDetailsPage from '../../../pages/order/variation/variationDetails'

const mockOrderId = uuidv4()
const apiPath = '/variation'
const sampleFormData = {
  variationDate: new Date(2024, 0, 1),
  variationType: 'Change of curfew hours',
  variationDetails: 'Change to curfew hours',
}

context('Variation', () => {
  context('Variation Details', () => {
    context('Submitting valid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { dataDictionaryVersion: 'DDV4' },
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            variationType: 'CURFEW_HOURS',
            variationDate: '2024-01-01T00:00:00.000Z',
            variationDetails: 'Change to curfew hours',
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted variation details submission', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndReturnButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            variationType: 'CURFEW_HOURS',
            variationDate: '2024-01-01T00:00:00.000Z',
            variationDetails: 'Change to curfew hours',
          },
        }).should('be.true')
      })

      it('should continue to collect device wearer details', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
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
