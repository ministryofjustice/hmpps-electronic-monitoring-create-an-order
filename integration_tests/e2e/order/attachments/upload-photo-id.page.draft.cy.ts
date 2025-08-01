import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import UploadPhotoIdPage from '../../../pages/order/attachments/uploadPhotoId'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Upload photo id', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should render the upload photo id page', () => {
        const page = Page.visit(UploadPhotoIdPage, { orderId: mockOrderId })

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Form
        page.form.shouldHaveEncType('multipart/form-data')
        page.form.shouldNotBeDisabled()
        page.form.uploadField.shouldHaveLabel('Upload a photo of the device wearer (optional)')
        page.form.uploadField.shouldHaveHint(
          "If the licence or court order doesn't include a photo, upload one that clearly shows the device wearer. The file must be a PDF, PNG, JPEG, or JPG and under 10MB.",
        )

        // Buttons
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
        page.backButton.should('exist')
      })

      it('Should be accessible', () => {
        const page = Page.visit(UploadPhotoIdPage, { orderId: mockOrderId })
        page.checkIsAccessible()
      })
    })
  })
})
