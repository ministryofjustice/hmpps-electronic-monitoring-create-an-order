import { v4 as uuidv4 } from 'uuid'
import PhotoQuestionPage from '../../../pages/order/attachments/photoQuestion'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()
context('Attachments', () => {
  context('Photo Question', () => {
    context('when viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.signIn()
      })
      it('should render the photo question page', () => {
        const page = Page.visit(PhotoQuestionPage, { orderId: mockOrderId })

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.photoQuestionField.shouldNotBeDisabled()

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
      })
    })
  })
})
