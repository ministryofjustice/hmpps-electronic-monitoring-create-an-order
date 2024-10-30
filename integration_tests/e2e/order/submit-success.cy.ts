import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../mockApis/cemo'
import ErrorPage from '../../pages/error'
import SubmitSuccessPage from '../../pages/order/submit-success'
import Page from '../../pages/page'

const mockOrderId = uuidv4()

context('Summary success', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

    cy.signIn()
  })

  context('Draft order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should display the page', () => {
      cy.signIn().visit(`/order/${mockOrderId}/submit/success`)
      const page = Page.verifyOnPage(SubmitSuccessPage)
      page.header.userName().should('contain.text', 'J. Smith')
    })
  })

  it('Button link to request form summary page for download should exist', () => {
    cy.signIn().visit(`/order/${mockOrderId}/submit/success`)
    const page = Page.verifyOnPage(SubmitSuccessPage)
    page.formSummaryButton().should('exist').should('have.attr', 'action', `/order/${mockOrderId}/receipt`)
  })
})
