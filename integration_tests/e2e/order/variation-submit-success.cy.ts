import { v4 as uuidv4 } from 'uuid'
import VariationSubmitSuccessPage from '../../pages/order/variation-submit-success'
import Page from '../../pages/page'
import ReceiptPage from '../../pages/order/receipt'

const mockOrderId = uuidv4()

context('Successful variation submission', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'SUBMITTED',
      order: {
        type: 'VARIATION',
        variationDetails: {
          variationType: 'CHANGE_TO_ADDRESS',
          variationDate: '2025-01-01T00:00:00Z',
          variationDetails: 'Change to address',
        },
      },
    })

    cy.signIn()
  })

  it('Should display the page', () => {
    cy.visit(`/order/${mockOrderId}/submit/success`)
    const page = Page.verifyOnPage(VariationSubmitSuccessPage)
    page.header.userName().should('contain.text', 'J. Smith')
  })

  it('should have a button that links to request form summary page for download', () => {
    cy.visit(`/order/${mockOrderId}/submit/success`)
    const page = Page.verifyOnPage(VariationSubmitSuccessPage)
    page.receiptButton().should('exist')
    page.receiptButton().click()
    Page.verifyOnPage(ReceiptPage)
  })
})
