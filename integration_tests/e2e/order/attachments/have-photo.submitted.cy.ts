import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import HavePhotoPage from '../../../pages/order/attachments/havePhoto'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Have photo', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            orderParameters: { havePhoto: true },
          },
        })

        cy.signIn()
      })

      it('Show show the correct have photo page', () => {
        const page = Page.visit(HavePhotoPage, { orderId: mockOrderId })

        // Should show the header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Should indicate the page is submitted
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')

        // Should display the saved data
        page.form.havePhotoField.shouldHaveValue('Yes')

        // Should have the correct buttons
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAsDraftButton.should('not.exist')
        page.backButton.should('exist').should('have.attr', 'href', '#')

        // Should not be editable
        page.form.havePhotoField.shouldBeDisabled()

        // Should not have errors
        page.errorSummary.shouldNotExist()
      })
    })
  })
})
