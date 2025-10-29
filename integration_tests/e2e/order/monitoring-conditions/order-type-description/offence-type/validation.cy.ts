import { v4 as uuidv4 } from 'uuid'
import OffenceTypePage from './OffenceTypePage'
import Page from '../../../../../pages/page'

const stubGetOrder = () => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
  })
}

const mockOrderId = uuidv4()
context('sentence type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()

    cy.signIn()
  })

  it('Should show errors when I do not select option', () => {
    const page = Page.visit(OffenceTypePage, { orderId: mockOrderId })

    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError('Select the type of offence the device wearer committed')
    page.form.offenceTypeField.validationMessage.contains('Select the type of offence the device wearer committed')
  })
})
