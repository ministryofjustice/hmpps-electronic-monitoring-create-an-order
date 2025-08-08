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
          orderParameters: {
            havePhoto: true,
          },
        })
        cy.signIn()
      })

      it('Should render the attachment summary page for a new draft order', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId }, {}, 'Check your answers')

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Attachments
        page.attachmentsSection.shouldHaveItems([
          { key: 'Upload a copy of the licence or court order document', value: '' },
          { key: 'Do you have a photo to upload?', value: 'No' },
        ])

        page.changeLinks.should('exist')

        // Buttons
        page.saveAndReturnButton.should('exist')
      })

      it('Should render the attachment summary page for a draft order with uploaded attachments', () => {
        const page = Page.visit(
          AttachmentSummaryPage,
          { orderId: mockOrderIdWithAttachments },
          {},
          'Check your answers',
        )

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Attachments
        page.attachmentsSection.shouldHaveItems([
          { key: 'Upload a copy of the licence or court order document', value: 'Licence.jpeg' },
          { key: 'Do you have a photo to upload?', value: 'Yes' },
          { key: 'Upload a photo of the device wearer', value: 'photo.jpeg' },
        ])
        page.attachmentsSection.element
          .find('.govuk-summary-list__value')
          .contains('Licence.jpeg')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/licence/Licence.jpeg`)

        page.attachmentsSection.element
          .find('.govuk-summary-list__value')
          .contains('photo.jpeg')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/photo_Id/photo.jpeg`)

        page.changeLinks.should('exist')

        // Buttons
        page.saveAndReturnButton.should('exist')
        page.backButton.should('exist')
      })

      it('Should be accessible', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId }, {}, 'Check your answers')
        page.checkIsAccessible()
      })
    })
  })
})
