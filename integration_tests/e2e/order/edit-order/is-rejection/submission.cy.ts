import { v4 as uuidv4 } from 'uuid'
import IsRejectionPage from './isRejectionPage'
import Page from '../../../../pages/page'
import OrderTasksPage from '../../../../pages/order/summary'
import IsAddressChangePage from '../is-address-change/isAddressChangePage'

const mockOrderId = uuidv4()
const variationPath = '/copy-as-variation'
const amendPath = '/amend-rejected-order'

const stubVariationOrder = (fmsResultDate: Date, startDate: Date) => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    type: 'VARIATION',
    order: {
      monitoringConditions: {
        startDate,
        endDate: '2025-02-01T00:00:00Z',
        orderType: 'CIVIL',
        curfew: true,
        exclusionZone: true,
        trail: true,
        mandatoryAttendance: true,
        alcohol: true,
        conditionType: 'BAIL_ORDER',
        orderTypeDescription: '',
        sentenceType: 'IPP',
        issp: 'YES',
        hdc: 'NO',
        prarr: 'UNKNOWN',
        pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
        offenceType: '',
      },
      fmsResultDate,
    },
  })
}
context('Edit Order', () => {
  context('Is Rejection', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        method: 'POST',
        id: mockOrderId,
        subPath: variationPath,
        response: [{}],
      })

      cy.signIn()
    })

    it('Should return to order summary page when backButton is clicked', () => {
      const page = Page.visit(IsRejectionPage, { orderId: mockOrderId })

      page.form.backButton.click()

      Page.verifyOnPage(OrderTasksPage)
    })

    it('Should call copy-as-variation endpoint if no is selected and start date is in the past', () => {
      const fmsResultDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 32).setHours(0, 0, 0, 0)) // 32 days after today
      const startDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).setHours(0, 0, 0, 0)) // 45 days after today
      stubVariationOrder(fmsResultDate, startDate)
      const page = Page.visit(IsRejectionPage, { orderId: mockOrderId })
      page.form.fillInWith('No')
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/copy-as-variation`,
        body: {},
      }).should('be.true')

      Page.verifyOnPage(OrderTasksPage)
    })

    it('Should call amend-rejected-order endpoint if Yes is selected', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        method: 'POST',
        id: mockOrderId,
        subPath: amendPath,
        response: [{}],
      })
      const page = Page.visit(IsRejectionPage, { orderId: mockOrderId })
      page.form.fillInWith('Yes')
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/amend-rejected-order`,
        body: {},
      }).should('be.true')

      Page.verifyOnPage(OrderTasksPage)
    })

    context('SERVICE_REQUEST_TYPE_ENABLED enabled', () => {
      const testFlags = { SERVICE_REQUEST_TYPE_ENABLED: true }
      beforeEach(() => {
        cy.task('setFeatureFlags', testFlags)
      })
      afterEach(() => {
        cy.task('resetFeatureFlags')
      })
      it('Should call copy-as-variation endpoint if no is selected and start date is less than 30 days in the past', () => {
        const fmsResultDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)) // 15 days before today
        const startDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)) // 15 days before today
        stubVariationOrder(fmsResultDate, startDate)
        const page = Page.visit(IsRejectionPage, { orderId: mockOrderId })
        page.form.fillInWith('No')
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(IsAddressChangePage)
      })
    })
  })
})
