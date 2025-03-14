import { v4 as uuidv4 } from 'uuid'
import { NotFoundErrorPage } from '../../../pages/error'
import Page from '../../../pages/page'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'

const mockOrderId = uuidv4()
const pagePath = '/contact-information/contact-details'

context('Contact details - Contact information', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue/return buttons', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndReturnButton.should('exist')
      page.backToSummaryButton.should('exist')
      page.errorSummary.shouldNotExist()
    })

    // TODO: FAIL issue determining if autocomplete is valid
    it.skip('Should be accessible', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

      cy.signIn()
    })

    it('Should not allow the user to update the contact details', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      // Verify the correct buttons are displayed
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndReturnButton.should('not.exist')
      page.errorSummary.shouldNotExist()
      page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)

      // Verify all form elements are disabled
      page.form.shouldBeDisabled()
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}${pagePath}`, { failOnStatusCode: false })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
