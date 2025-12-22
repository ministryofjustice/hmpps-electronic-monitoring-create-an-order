import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import CourtOrderDocumentPage from './courtOrderDocumentPage'

const mockOrderId = uuidv4()
context('Attachments', () => {
  context('Have Court Order', () => {
    context('when viewing a draft order', () => {
      beforeEach(() => {
        // cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.signIn()
      })

      it('should render the have court order page', () => {
        const page = Page.visit(CourtOrderDocumentPage, { orderId: mockOrderId })

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.havePhotoField.shouldNotBeDisabled()
        page.form.havePhotoField.element.contains('Do you have a court order document to upload?')
        page.form.havePhotoField.shouldHaveOption('Yes')
        page.form.havePhotoField.shouldHaveOption('No')

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')

        page.checkIsAccessible()
      })
    })
  })
})
