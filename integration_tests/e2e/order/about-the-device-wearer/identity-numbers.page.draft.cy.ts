import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'

const mockOrderId = uuidv4()

context('About the device wearer', () => {
  context('Identity numbers', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the identity numbers', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.backToSummaryButton.should('exist')
        page.errorSummary.shouldNotExist()
      })

      it('Should be accessible', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })
        page.checkIsAccessible()
      })
    })
  })
})
