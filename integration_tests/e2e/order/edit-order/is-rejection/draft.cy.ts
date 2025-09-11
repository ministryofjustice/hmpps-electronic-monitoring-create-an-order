import { v4 as uuidv4 } from 'uuid'
import IsRejectionPage from './isRejectionPage'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()
context('Edit Order', () => {
  context('Is Rejection', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

      cy.signIn()
    })

    it('Page accessisble', () => {
      const page = Page.visit(IsRejectionPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })

    it('Should display content', () => {
      const page = Page.visit(IsRejectionPage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      page.form.isRejectionField.shouldExist()
      page.form.isRejectionField.shouldNotBeDisabled()
      page.form.isRejectionField.shouldHaveOption('Yes')
      page.form.isRejectionField.shouldHaveOption('No')

      page.form.saveAndContinueButton.should('exist')
      page.form.backButton.should('exist')
    })
  })
})
