import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import DeletePhotoIdPage from '../../../pages/order/attachments/deletePhotoId'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Delete photo id', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should render the delete licence page', () => {
        const page = Page.visit(DeletePhotoIdPage, { orderId: mockOrderId })

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Buttons
        page.form.deleteButton.should('exist')
        page.form.backButton.should('exist')
        page.backToSummaryButton.should('exist')
      })

      it('Should be accessible', () => {
        const page = Page.visit(DeletePhotoIdPage, { orderId: mockOrderId })
        page.checkIsAccessible()
      })
    })
  })
})
