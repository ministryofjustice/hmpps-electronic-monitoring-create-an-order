import { v4 as uuidv4 } from 'uuid'

import Page from '../../../../pages/page'
import UploadCourtOrderPage from './uploadCourtOrderPage'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Upload court order document', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should render the upload photo id page', () => {
        const page = Page.visit(UploadCourtOrderPage, { orderId: mockOrderId })

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Form
        page.form.shouldHaveEncType('multipart/form-data')
        page.form.shouldNotBeDisabled()
        page.form.uploadField.shouldHaveLabel('Upload a copy of the licence or court order document')
        page.form.uploadField.shouldHaveHint(
          'Upload a scanned copy or photo of the original licence or court order document. If the licence is draft upload a copy of that. You will be able to change the order once you have the final version of the licence. The file must be a PDF or Word document and under 25MB in size.',
        )

        // Buttons
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
        page.backButton.should('exist')
        // Accessible
        page.checkIsAccessible()
      })
    })
  })
})
