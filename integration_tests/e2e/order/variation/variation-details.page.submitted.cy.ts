import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import VariationDetailsPage from '../../../pages/order/variation/variationDetails'

const mockOrderId = uuidv4()

context('Variation', () => {
  context('Variation Details', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

        cy.signIn()
      })

      it('Should not allow the user to update the variation details', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        // Verify page layout is present
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Verify warning message present
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')

        // Verify form elements not present and inputs disabled
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAndReturnButton.should('not.exist')
        page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
        page.form.shouldBeDisabled()
      })
    })
  })
})
