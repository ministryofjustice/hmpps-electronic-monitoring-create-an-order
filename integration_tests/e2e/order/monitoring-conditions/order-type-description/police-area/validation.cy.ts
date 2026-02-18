import { v4 as uuidv4 } from 'uuid'
import PoliceAreaPage from './PoliceAreaPage'
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
    const page = Page.visit(PoliceAreaPage, { orderId: mockOrderId })

    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError("Select the police force area the device wearer's release address is in")
    page.form.policeAreaField.validationMessage.contains(
      "Select the police force area the device wearer's release address is in",
    )
  })
})
