import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import DeleteLicencePage from '../../../pages/order/attachments/deleteLicence'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Delete licence', () => {
    context('Submitting a deletion request', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubDeleteAttachment', { httpStatus: 200, id: mockOrderId, type: 'LICENCE' })
        cy.signIn()
      })

      it('Should allow the user to delete an uploaded licence', () => {
        const page = Page.visit(DeleteLicencePage, { orderId: mockOrderId })

        page.form.deleteButton.click()

        Page.verifyOnPage(AttachmentSummaryPage)

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/document-type/LICENCE`,
          method: 'DELETE',
          body: '',
        }).should('be.true')
      })

      it('Should allow the user to cancel the deletion request', () => {
        const page = Page.visit(DeleteLicencePage, { orderId: mockOrderId })

        page.form.backButton.click()

        Page.verifyOnPage(AttachmentSummaryPage)

        cy.task('getStubbedRequest', [`/orders/${mockOrderId}/document-type/LICENCE`, false, 'DELETE']).then(
          requests => {
            expect(requests).to.have.lengthOf(0)
          },
        )
      })
    })
  })
})
