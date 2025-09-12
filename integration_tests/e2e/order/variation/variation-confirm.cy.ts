import Page from '../../../pages/page'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import OrderTasksPage from '../../../pages/order/summary'
import IsRejectionPage from '../edit-order/is-rejection/isRejectionPage'

const mockOriginalId = '00a00000-79cd-49f9-a498-b1f07c543b8a'
const mockVariationId = '11a11111-79cd-49f9-a498-b1f07c543b8a'

context('Variation', () => {
  context('Creating a variation from an existing order', () => {
    context('Confirm Variation page', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', {
          name: 'john smith',
          roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        })
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOriginalId,
          status: 'SUBMITTED',
        })
        cy.task('stubCemoCreateVariation', {
          httpStatus: 200,
          originalId: mockOriginalId,
          variationId: mockVariationId,
        })
        cy.signIn()
      })

      it('Should display the page', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)

        const page = Page.verifyOnPage(ConfirmVariationPage)
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('should have a button to cancel and return to the form task list', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)
        const page = Page.verifyOnPage(ConfirmVariationPage)

        page.cancelButton().should('exist')

        page.cancelButton().click()

        Page.verifyOnPage(OrderTasksPage)
      })

      it('should have a button to confirm and proceed to the new form task list', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)
        const page = Page.verifyOnPage(ConfirmVariationPage)
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockVariationId,
          status: 'IN_PROGRESS',
          type: 'VARIATION',
        })

        page.confirmButton().should('exist')

        page.confirmButton().click()

        Page.verifyOnPage(IsRejectionPage)
      })
    })
  })
})
