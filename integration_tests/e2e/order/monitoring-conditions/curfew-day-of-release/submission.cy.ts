import { v4 as uuidv4 } from 'uuid'
import CurfewDayOfReleasePage from '../../../../pages/order/monitoring-conditions/curfew-day-of-release'
import CurfewReleaseDatePage from '../../../../pages/order/monitoring-conditions/curfew-release-date'
import CurfewAdditionalDetailsPage from '../../../../pages/order/monitoring-conditions/curfew-additional-details'
import OrderSummaryPage from '../../../../pages/order/summary'
import Page from '../../../../pages/page'
import mockApiOrder from '../../../../utils/data/ApiOrder'

const mockOrderId = uuidv4()

const mockOrderWithCurfewStartDate = {
  ...mockApiOrder('IN_PROGRESS'),
  curfewConditions: {
    startDate: '2025-03-27T00:00:00.000Z',
    orderId: mockOrderId,
    endDate: '2026-04-28T00:00:00.000Z',
    curfewAdditionalDetails: '',
  },
  status: 'IN_PROGRESS',
  id: mockOrderId,
}

context('Monitoring conditions - Curfew on day of release', () => {
  context('Submitting a valid response', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockOrderWithCurfewStartDate,
      })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-curfew-release-date',
        response: {},
      })

      cy.signIn()
    })

    it('should continue to the curfew on release day page when I check the no radio button', () => {
      const page = Page.visit(CurfewDayOfReleasePage, { orderId: mockOrderId })

      page.form.standardCurfewTimesField.set('No')
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(CurfewReleaseDatePage)
    })

    it('should save the standard curfew times and skip the release day page when I check the yes radio button', () => {
      const page = Page.visit(CurfewDayOfReleasePage, { orderId: mockOrderId })

      page.form.standardCurfewTimesField.set('Yes')
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/monitoring-conditions-curfew-release-date`,
        body: {
          startTime: '19:00:00',
          endTime: '07:00:00',
          curfewAddress: null,
          releaseDate: '2025-03-27T00:00:00.000Z',
        },
      }).should('be.true')

      Page.verifyOnPage(CurfewAdditionalDetailsPage)
    })

    it('should save the standard curfew times and return to the order summary when I save as draft', () => {
      const page = Page.visit(CurfewDayOfReleasePage, { orderId: mockOrderId })

      page.form.standardCurfewTimesField.set('Yes')
      page.form.saveAsDraftButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/monitoring-conditions-curfew-release-date`,
        body: {
          startTime: '19:00:00',
          endTime: '07:00:00',
          curfewAddress: null,
          releaseDate: '2025-03-27T00:00:00.000Z',
        },
      }).should('be.true')

      Page.verifyOnPage(OrderSummaryPage)
    })

    it('should return to the order summary when I select no and save as draft', () => {
      const page = Page.visit(CurfewDayOfReleasePage, { orderId: mockOrderId })

      page.form.standardCurfewTimesField.set('No')
      page.form.saveAsDraftButton.click()

      Page.verifyOnPage(OrderSummaryPage)
    })
  })
})
