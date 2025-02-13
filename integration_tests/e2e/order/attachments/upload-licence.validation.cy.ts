import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import UploadLicencePage from '../../../pages/order/attachments/uploadLicence'

const mockOrderId = uuidv4()
const fileContent = 'This is an image'

context('Attachments', () => {
  context('Upload licence', () => {
    context('Submitting an invalid file', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubUploadAttachment', { httpStatus: 400, id: mockOrderId, type: 'LICENCE' })
        cy.signIn()
      })

      it('Should show an error if the api rejects the licence', () => {
        const page = Page.visit(UploadLicencePage, { orderId: mockOrderId })

        page.form.fillInWith({
          file: {
            fileName: 'profile.jpeg',
            contents: fileContent,
          },
        })
        page.form.saveAndContinueButton.click()

        page.form.uploadField.shouldHaveValidationMessage('Mock Error')
      })
    })
  })
})
