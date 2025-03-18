import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import DeleteLicencePage from '../../../pages/order/attachments/deleteLicence'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Delete licence', () => {
    context('Submitting an invalid file', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubDeleteAttachment', { httpStatus: 500, id: mockOrderId, type: 'LICENCE' })
        cy.signIn()
      })

      it('Should show an error if the api fails the licence deletion', () => {
        const page = Page.visit(DeleteLicencePage, { orderId: mockOrderId })

        page.form.deleteButton.click()

        const summaryPage = Page.verifyOnPage(AttachmentSummaryPage)

        summaryPage.errorSummary.shouldHaveTitle('Error deleting attachment')
        summaryPage.errorSummary.shouldHaveError('Mock Error')
      })
    })
  })
})
