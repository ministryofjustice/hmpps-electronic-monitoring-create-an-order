import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Summary', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrderWithAttachments', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          attachments: [
            { id: uuidv4(), orderId: mockOrderId, fileName: 'Licence.jpeg', fileType: 'LICENCE' },
            { id: uuidv4(), orderId: mockOrderId, fileName: 'photo.jpeg', fileType: 'PHOTO_ID' },
          ],
        })
        cy.signIn()
      })

      it('Should render summary page with no download links and no delete links', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId })

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')

        // Licence Task
        page.licenseTask.status.should('contain', 'Licence.jpeg')
        page.licenseTask.addAction.should('not.exist')
        page.licenseTask.changeAction.should('not.exist')
        page.licenseTask.deleteAction.should('not.exist')
        page.licenseTask.downloadAction
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderId}/attachments/licence/Licence.jpeg`)

        // Photo ID Task
        page.photoIdTask.status.should('contain', 'photo.jpeg')
        page.photoIdTask.addAction.should('not.exist')
        page.photoIdTask.changeAction.should('not.exist')
        page.photoIdTask.deleteAction.should('not.exist')
        page.photoIdTask.downloadAction
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderId}/attachments/photo_Id/photo.jpeg`)

        // Buttons
        page.saveAndReturnButton.should('not.exist')
        page.backToSummaryButton.should('exist')
      })
    })
  })
})
