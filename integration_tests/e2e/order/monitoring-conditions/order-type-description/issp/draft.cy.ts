import { v4 as uuidv4 } from 'uuid'
import IsspPage from './isspPage'
import Page from '../../../../../pages/page'

const mockOrderId = uuidv4()
context('orderType', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('Page accessisble', () => {
    const page = Page.visit(IsspPage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(IsspPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.isspField.shouldExist()
    page.form.isspField.shouldNotBeDisabled()

    page.form.continueButton.should('exist')
  })
})
