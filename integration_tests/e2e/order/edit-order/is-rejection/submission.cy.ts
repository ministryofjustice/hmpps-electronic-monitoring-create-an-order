import { v4 as uuidv4 } from 'uuid'
import IsRejectionPage from './isRejectionPage'
import Page from '../../../../pages/page'
import OrderTasksPage from '../../../../pages/order/summary'

const mockOrderId = uuidv4()
const variationPath = '/copy-as-variation'
const amendPath = '/amend-rejected-order'
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

      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        method: 'POST',
        id: mockOrderId,
        subPath: amendPath,
        response: [{}],
      })
      cy.signIn()
    })

    it('Should return to order summary page when backButton is clicked', () => {
      const page = Page.visit(IsRejectionPage, { orderId: mockOrderId })

      page.form.backButton.click()

      Page.verifyOnPage(OrderTasksPage)
    })

    it('Should call copy-as-variation endpoint if no is selected', () => {
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
      const page = Page.visit(IsRejectionPage, { orderId: mockOrderId })
      page.form.fillInWith('Yes')
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/amend-rejected-order`,
        body: {},
      }).should('be.true')

      Page.verifyOnPage(OrderTasksPage)
    })
  })
})
