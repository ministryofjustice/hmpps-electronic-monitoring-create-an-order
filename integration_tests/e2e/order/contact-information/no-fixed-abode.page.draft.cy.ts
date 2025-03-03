import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'

const mockOrderId = uuidv4()

context('Contact information', () => {
  context('No fixed abode', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the no fixed abode details', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('exist')
      })

      // TODO: FAIL issue determining if autocomplete is valid
      it.skip('Should be accessible', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })
        page.checkIsAccessible()
      })
    })
  })
})
