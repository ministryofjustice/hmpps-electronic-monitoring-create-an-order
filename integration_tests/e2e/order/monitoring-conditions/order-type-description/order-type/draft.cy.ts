import { v4 as uuidv4 } from 'uuid'
import OrderTypePage from './OrderTypePage'
import Page from '../../../../../pages/page'

const mockOrderId = uuidv4()
context('Edit Order', () => {
  context('Is Rejection', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Page accessisble', () => {
      const page = Page.visit(OrderTypePage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })

    it('Should display content', () => {
      const page = Page.visit(OrderTypePage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      page.form.orderTypeField.shouldExist()
      page.form.orderTypeField.shouldNotBeDisabled()
      page.form.orderTypeField.shouldHaveOption('Release from prison')
      page.form.orderTypeField.shouldHaveOption('Community')

      page.form.continueButton.should('exist')
    })
  })
})
