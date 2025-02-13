import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Upload photo id', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

        cy.signIn()
      })

      it('Should redirect to the attachments summary when trying to upload a photo id to a submitted order', () => {
        cy.visit(`/order/${mockOrderId}/attachments/licence`)

        Page.verifyOnPage(AttachmentSummaryPage)
      })
    })
  })
})
