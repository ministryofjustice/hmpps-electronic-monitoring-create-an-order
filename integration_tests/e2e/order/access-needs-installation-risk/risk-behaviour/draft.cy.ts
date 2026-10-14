import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import RiskAtAddressPage from '../risk-at-address/RiskAtAddressPage'
import RiskBehaviourPage from './RiskBehaviourPage'

const mockOrderId = uuidv4()

context('risk behaviour page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    cy.signIn()
  })

  it('lists every possible risk as a checkbox', () => {
    const page = Page.visit(RiskBehaviourPage, { orderId: mockOrderId })

    page.form.possibleRiskField.shouldNotBeDisabled()
    page.form.possibleRiskField.shouldHaveAllOptions()
    page.form.possibleRiskField.shouldNotHaveValue()
  })

  it('shows an error when nothing is selected', () => {
    const page = Page.visit(RiskBehaviourPage, { orderId: mockOrderId })

    page.form.continueButton.click()

    page.errorSummary.shouldHaveError("Select all the possible risks from the device wearer's behaviour")
    page.form.possibleRiskField.shouldHaveValidationMessage(
      "Select all the possible risks from the device wearer's behaviour",
    )
  })

  it('saves multiple selections, continues to risk at address and pre-checks them on revisit', () => {
    const page = Page.visit(RiskBehaviourPage, { orderId: mockOrderId })

    page.form.fillInWith(['Violent behaviour or threats of violence', 'Sex offender'])
    page.form.continueButton.click()

    Page.verifyOnPage(RiskAtAddressPage)

    const revisited = Page.visit(RiskBehaviourPage, { orderId: mockOrderId })
    revisited.form.possibleRiskField.shouldHaveValue('Violent behaviour or threats of violence')
    revisited.form.possibleRiskField.shouldHaveValue('Sex offender')
    revisited.form.possibleRiskField.shouldNotHaveValueChecked(
      'There are no risks that the installer should be aware of',
    )
  })
})
