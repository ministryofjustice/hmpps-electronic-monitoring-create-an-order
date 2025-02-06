import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'

const mockOrderId = uuidv4()
const mockOrderIdWithAttachments = uuidv4()

context('Attachments', () => {
  context('Summary', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoGetOrderWithAttachments', {
          httpStatus: 200,
          id: mockOrderIdWithAttachments,
          status: 'IN_PROGRESS',
          attachments: [
            { id: uuidv4(), orderId: mockOrderIdWithAttachments, fileName: 'Licence.jpeg', fileType: 'LICENCE' },
            { id: uuidv4(), orderId: mockOrderIdWithAttachments, fileName: 'photo.jpeg', fileType: 'PHOTO_ID' },
          ],
        })
        cy.signIn()
      })

      it('Should render the attachment summary page for a new draft order', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId })

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Licence Task
        page.licenceTask.status.should('contain', 'No licence document uploaded')
        page.licenceTask.addAction.should('exist')
        page.licenceTask.changeAction.should('not.exist')
        page.licenceTask.deleteAction.should('not.exist')
        page.licenceTask.downloadAction.should('not.exist')

        // Photo ID Task
        page.photoIdTask.status.should('contain', 'No photo ID document uploaded')
        page.photoIdTask.addAction.should('exist')
        page.photoIdTask.changeAction.should('not.exist')
        page.photoIdTask.deleteAction.should('not.exist')
        page.photoIdTask.downloadAction.should('not.exist')

        // Buttons
        page.saveAndReturnButton.should('exist')
      })

      it('Should render the attachment summary page for a draft order with uploaded attachments', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderIdWithAttachments })

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Licence Task
        page.licenceTask.status.should('contain', 'Licence.jpeg')
        page.licenceTask.addAction.should('not.exist')
        page.licenceTask.changeAction
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/licence`)
        page.licenceTask.deleteAction
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/licence/delete`)
        page.licenceTask.downloadAction
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/licence/Licence.jpeg`)

        // Photo ID Task
        page.photoIdTask.status.should('contain', 'photo.jpeg')
        page.photoIdTask.addAction.should('not.exist')
        page.photoIdTask.changeAction
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/photo_Id`)
        page.photoIdTask.deleteAction
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/photo_Id/delete`)
        page.photoIdTask.downloadAction
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/photo_Id/photo.jpeg`)

        // Buttons
        page.saveAndReturnButton.should('exist')
        page.backToSummaryButton.should('exist')
      })

      it('Should be accessible', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId })
        page.checkIsAccessible()
      })
    })
  })
})
