import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'
import OrderTasksPage from '../../../pages/order/summary'

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
          fmsResultDate: new Date('2024 12 14'),
          orderParameters: { havePhoto: true },
        })
        cy.signIn()
      })

      it('Should render summary page with no download links and no delete links', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId }, {}, 'View answers')

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.submittedBanner.should(
          'contain',
          'You are viewing a submitted form. This form was submitted on the 14 December 2024',
        )

        // Licence Task
        page.attachmentsSection.shouldHaveItems([
          { key: 'Upload a copy of the licence or court order document', value: 'Licence.jpeg' },
          { key: 'Do you have a photo to upload?', value: 'Yes' },
          { key: 'Upload a photo of the device wearer', value: 'photo.jpeg' },
        ])

        page.attachmentsSection.element
          .find('.govuk-summary-list__value')
          .contains('Licence.jpeg')
          .should('have.attr', 'href', `/order/${mockOrderId}/attachments/licence/Licence.jpeg`)

        page.attachmentsSection.element
          .find('.govuk-summary-list__value')
          .contains('photo.jpeg')
          .should('have.attr', 'href', `/order/${mockOrderId}/attachments/photo_Id/photo.jpeg`)

        page.changeLinks.should('not.exist')

        // Buttons
        page.backToSummaryButton.should('exist')
        page.backButton.should('exist')
      })

      it('should go to main page when I click the return button', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId }, {}, 'View answers')

        page.backToSummaryButton.click()

        Page.verifyOnPage(OrderTasksPage)
      })
    })
  })
})
