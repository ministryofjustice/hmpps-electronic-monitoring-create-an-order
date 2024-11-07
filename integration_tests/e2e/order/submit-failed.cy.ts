import { v4 as uuidv4 } from 'uuid'
import SubmitFailedPage from '../../pages/order/submit-failed'
import Page from '../../pages/page'
import ReceiptPage from '../../pages/order/receipt'

const mockOrderId = uuidv4()

context('Submit failed', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

    cy.signIn()
  })

  it('Should display the page', () => {
    cy.visit(`/order/${mockOrderId}/submit/failed`)
    const page = Page.verifyOnPage(SubmitFailedPage)
    page.warningText().should('exist')
    page.header.userName().should('contain.text', 'J. Smith')
  })

  it('should have a button that links to request form summary page for download', () => {
    cy.visit(`/order/${mockOrderId}/submit/failed`)
    const page = Page.verifyOnPage(SubmitFailedPage)
    page.receiptButton().should('exist')
    page.receiptButton().click()
    Page.verifyOnPage(ReceiptPage)
  })
})
