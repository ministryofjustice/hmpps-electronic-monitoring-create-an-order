import { v4 as uuidv4 } from 'uuid'
import IsRejectionPage from './isRejectionPage'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()
context('Edit Order', () => {
  context('Is Rejection', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

      cy.signIn()
    })

    it('Page accessisble', () => {
      const page = Page.visit(IsRejectionPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })
})
