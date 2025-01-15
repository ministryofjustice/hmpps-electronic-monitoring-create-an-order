import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'
import DeletePhotoIdPage from '../../../pages/order/attachments/deletePhotoId'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Delete photo id', () => {
    context('Submitting a deletion request', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubDeleteAttachment', { httpStatus: 200, id: mockOrderId, type: 'PHOTO_ID' })
        cy.signIn()
      })

      it('Should allow the user to delete an uploaded photo id', () => {
        const page = Page.visit(DeletePhotoIdPage, { orderId: mockOrderId })

        page.form.deleteButton.click()

        Page.verifyOnPage(AttachmentSummaryPage)

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/document-type/PHOTO_ID`,
          method: 'DELETE',
          body: '',
        }).should('be.true')
      })

      it('Should allow the user to cancel the deletion request', () => {
        const page = Page.visit(DeletePhotoIdPage, { orderId: mockOrderId })

        page.form.backButton.click()

        Page.verifyOnPage(AttachmentSummaryPage)

        cy.task('getStubbedRequest', [`/orders/${mockOrderId}/document-type/PHOTO_ID`, false, 'DELETE']).then(
          requests => {
            expect(requests).to.have.lengthOf(0)
          },
        )
      })
    })
  })
})
