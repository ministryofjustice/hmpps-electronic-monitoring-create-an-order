import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import DetailsOfInstallationPage from './DetailsOfInstallationPage'

const mockOrderId = uuidv4()
context('dapo order clause', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
      },
    })

    cy.signIn()
  })

  it('shows the correct errors', () => {
    const page = Page.visit(DetailsOfInstallationPage, { orderId: mockOrderId })

    page.form.saveAndContinueButton.click()

    page.form.possibleRiskField.shouldHaveValidationMessage(
      "Select all the possible risks from the device wearer's behaviour",
    )
  })

  it('shows error if risk to gender selected but no details', () => {
    const page = Page.visit(DetailsOfInstallationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      possibleRisks: ['Offensive towards someone because of their sex or gender'],
    })

    page.form.saveAndContinueButton.click()

    page.form.possibleRiskField.shouldHaveValidationMessage('Enter what sex or gender they are a risk to')
  })
})
