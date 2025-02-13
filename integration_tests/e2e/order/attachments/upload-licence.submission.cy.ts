import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import UploadLicencePage from '../../../pages/order/attachments/uploadLicence'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'

const mockOrderId = uuidv4()
const fileContent = 'This is an image'

context('Attachments', () => {
  context('Upload licence', () => {
    context('Submitting a valid file', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubUploadAttachment', { httpStatus: 200, id: mockOrderId, type: 'LICENCE' })
        cy.signIn()
      })

      it('Should allow the user to upload a licence', () => {
        const page = Page.visit(UploadLicencePage, { orderId: mockOrderId })

        page.form.fillInWith({
          file: {
            fileName: 'profile.jpeg',
            contents: fileContent,
          },
        })
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(AttachmentSummaryPage)

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/document-type/LICENCE`,
          fileContents: [
            {
              name: 'file',
              filename: 'profile.jpeg',
              contentType: 'image/jpeg',
              contents: fileContent,
            },
          ],
        }).should('be.true')
      })
    })
  })
})
