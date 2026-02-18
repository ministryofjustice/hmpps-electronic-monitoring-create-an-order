import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import IsspPage from './isspPage'

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

  it('Should show errors no answer selected', () => {
    const page = Page.visit(IsspPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.form.isspField.validationMessage.contains('Select Yes if the device wearer is on the ISSP')
  })
})
