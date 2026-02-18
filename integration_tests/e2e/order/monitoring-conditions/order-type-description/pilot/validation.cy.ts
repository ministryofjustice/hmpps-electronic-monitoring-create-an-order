import { v4 as uuidv4 } from 'uuid'
import PilotPage from './PilotPage'
import Page from '../../../../../pages/page'

const stubGetOrder = () => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
  })
}

const mockOrderId = uuidv4()
context('order type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()

    cy.signIn()
  })

  it('Should show errors when I do not select pilot', () => {
    const page = Page.visit(PilotPage, { orderId: mockOrderId })

    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.form.pilotField.validationMessage.contains('Select the type of pilot the device wearer is part of')
  })
})
