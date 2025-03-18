import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import UploadPhotoIdPage from '../../../pages/order/attachments/uploadPhotoId'

const mockOrderId = uuidv4()
const fileContent = 'This is an image'

context('Attachments', () => {
  context('Upload photo id', () => {
    context('Submitting an invalid file', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubUploadAttachment', { httpStatus: 400, id: mockOrderId, type: 'PHOTO_ID' })
        cy.signIn()
      })

      it('Should show an error if the api rejects the photo id', () => {
        const page = Page.visit(UploadPhotoIdPage, { orderId: mockOrderId })

        page.form.fillInWith({
          file: {
            fileName: 'profile.jpeg',
            contents: fileContent,
          },
        })
        page.form.saveAndContinueButton.click()
        page.form.uploadField.shouldHaveLabel('Upload a copy of photo identification')
        page.form.uploadField.shouldHaveHint('Upload a scanned copy or photo of the original photo identification.')
        page.form.uploadField.shouldHaveValidationMessage('Mock Error')
      })
    })
  })
})
