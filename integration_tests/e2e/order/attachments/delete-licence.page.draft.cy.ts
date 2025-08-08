import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import DeleteLicencePage from '../../../pages/order/attachments/deleteLicence'

const mockOrderId = uuidv4()

context.skip('Attachments', () => {
  context('Delete licence', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should render the delete licence page', () => {
        const page = Page.visit(DeleteLicencePage, { orderId: mockOrderId })

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Buttons
        page.form.deleteButton.should('exist')
        page.form.backButton.should('exist')
        page.backButton.should('exist')

        // Accessible
        page.checkIsAccessible()
      })
    })
  })
})
