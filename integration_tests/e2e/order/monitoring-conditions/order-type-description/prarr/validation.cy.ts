import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import PrarrPage from './PrarrPage'

const mockOrderId = uuidv4()
context('order type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })
    cy.signIn()
  })

  it('Should show errors', () => {
    const page = Page.visit(PrarrPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError('Select if the device wearer is being released on a P-RARR')
    page.form.prarrField.validationMessage.contains('Select if the device wearer is being released on a P-RARR')
  })
})
