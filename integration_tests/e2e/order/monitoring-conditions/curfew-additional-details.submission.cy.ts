import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import CurfewAdditionalDetailsPage from '../../../pages/order/monitoring-conditions/curfew-additional-details'

const mockOrderId = uuidv4()

context('Monitoring conditions', () => {
  context('Curfew additional details', () => {
    context('Submitting a valid response with additional curfew information', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {},
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: '/monitoring-conditions-curfew-additional-details',
          response: {
            curfewAddress: null,
            orderId: mockOrderId,
            startDate: null,
            endDate: null,
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted address submission', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
        })

        // fill in page

        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/monitoring-conditions-curfew-additional-details`,
          body: {},
        }).should('be.true')
      })

      it.only('test test', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: '/monitoring-conditions-curfew-additional-details',
          response: {},
        })
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/additional-details`)
        const page = Page.verifyOnPage(CurfewAdditionalDetailsPage)
        page.form.saveAndContinueButton.click()
        page.form.curfewRadios.element.getByLabel('Yes').check()
        cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-curfew-additional-details`).then(
          requests => {
            expect(requests).to.have.lengthOf(1)
            expect(requests[0]).to.deep.equal({
              curfewAddress: 'SECONDARY,TERTIARY',
              startDate: '2025-03-27T00:00:00.000Z',
              endDate: '2026-04-28T22:59:00.000Z',
            })
          },
        )
      })
    })
  })
})
