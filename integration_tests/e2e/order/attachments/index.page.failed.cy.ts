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
          status: 'ERROR',
          attachments: [
            { id: uuidv4(), orderId: mockOrderId, fileName: 'Licence.jpeg', fileType: 'LICENCE' },
            { id: uuidv4(), orderId: mockOrderId, fileName: 'photo.jpeg', fileType: 'PHOTO_ID' },
          ],
        })
        cy.signIn()
      })

      it('Should render summary page with no download links and no delete links', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId }, {}, 'View answers')

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.submittedBanner.contains(
          'This form failed to submit. This was due to a technical problem. For more information ',
        )
        page.submittedBanner.contains('a', 'view the guidance (opens in a new tab)')

        // Attachments
        page.attachmentsSection.shouldHaveItems([
          { key: 'Upload a copy of the licence or court order document', value: 'Licence.jpeg' },
          { key: 'Upload a photo of the device wearer (optional)', value: 'photo.jpeg' },
        ])
        page.attachmentsSection.element
          .find('.govuk-summary-list__value')
          .contains('Licence.jpeg')
          .should('have.attr', 'href', `/order/${mockOrderId}/attachments/licence/Licence.jpeg`)

        page.attachmentsSection.element
          .find('.govuk-summary-list__value')
          .contains('photo.jpeg')
          .should('have.attr', 'href', `/order/${mockOrderId}/attachments/photo_Id/photo.jpeg`)

        // Buttons
        page.saveAndReturnButton.should('not.exist')
        page.returnBackToFormSectionMenuButton.should('exist')
      })
    })
  })
})
