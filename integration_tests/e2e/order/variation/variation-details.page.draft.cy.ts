import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import VariationDetailsPage from '../../../pages/order/variation/variationDetails'

const mockOrderId = uuidv4()

context('Variation', () => {
  context('Variation Details', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should allow the user to update the variation details', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        // Verify page layout is present
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Verify form elements present and editable
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('exist')

        // A11y
        page.checkIsAccessible()
      })
    })
  })
})
