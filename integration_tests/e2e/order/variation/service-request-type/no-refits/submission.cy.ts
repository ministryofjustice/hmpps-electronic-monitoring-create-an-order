import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OrderTasksPage from '../../../../../pages/order/summary'
import NoRefitsPage from './noRefitsPage'

const mockOrderId = uuidv4()

context('No refits', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

    cy.signIn()
  })

  it('Should go back to order summary page', () => {
    const page = Page.visit(NoRefitsPage, { orderId: mockOrderId })
    page.returnToStartButton().click()

    Page.verifyOnPage(OrderTasksPage)
  })
})
