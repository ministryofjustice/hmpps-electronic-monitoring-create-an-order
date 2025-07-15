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

      it('Should display contents', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backButton.should('exist')
        page.form.shouldHaveAllOptions()
      })

      // TODO: FAIL issue determining if autocomplete is valid
      it.skip('Should be accessible', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })
        page.checkIsAccessible()
      })
    })
  })
})
