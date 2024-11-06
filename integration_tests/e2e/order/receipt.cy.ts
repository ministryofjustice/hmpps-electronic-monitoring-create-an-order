import { v4 as uuidv4 } from 'uuid'
import Page from '../../pages/page'
import ReceiptPage from '../../pages/order/receipt'

const mockOrderId = uuidv4()

context('Receipt', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

    cy.signIn()
  })

  it('Should display the page', () => {
    cy.visit(`/order/${mockOrderId}/receipt`)
    const page = Page.verifyOnPage(ReceiptPage)
    page.header.userName().should('contain.text', 'J. Smith')
    page.pdfDownloadBanner().should('exist')
  })

  it('Should have a button that opens the print window to download page as PDF', () => {
    cy.visit(`/order/${mockOrderId}/receipt`)
    const page = Page.verifyOnPage(ReceiptPage)
    page.pdfDownloadButton().should('exist')
    cy.window().then(w => {
      cy.stub(w, 'print').as('print')
    })
    page.pdfDownloadButton().click()
    cy.get('@print').should('be.calledOnce')
  })
})
