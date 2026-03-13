import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import NoChangeResponsibleOfficerPage from './noChangeResponsibleOfficerPage'
import IndexPage from '../../../../../pages'

const mockOrderId = uuidv4()

context('No change in responsible officer', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

    cy.signIn()
  })

  it('Should go back to order summary page', () => {
    const page = Page.visit(NoChangeResponsibleOfficerPage, { orderId: mockOrderId })
    page.returnToStartButton().click()
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    Page.verifyOnPage(IndexPage)
  })
})
