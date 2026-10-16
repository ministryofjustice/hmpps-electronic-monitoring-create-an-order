import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import OtherRisksPage from '../other-risks/OtherRisksPage'
import RiskAtAddressPage from './RiskAtAddressPage'
import { NO_RISK_OPTION, RISK_AT_ADDRESS_HINT, RISK_UNKNOWN_OPTION } from './RiskAtAddressComponent'

const mockOrderId = uuidv4()

context('risk at address page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: { dataDictionaryVersion: 'DDV5' },
    })
    cy.signIn()
  })

  it('shows the hint and lists the risk categories without diversity concerns', () => {
    const page = Page.visit(RiskAtAddressPage, { orderId: mockOrderId })

    cy.contains(RISK_AT_ADDRESS_HINT).should('be.visible')
    page.form.riskCategoryField.shouldNotBeDisabled()
    page.form.riskCategoryField.shouldHaveAllOptions()
    page.form.riskCategoryField.shouldNotHaveOption('Diversity concerns')
    page.form.riskCategoryField.shouldNotHaveValue()
  })

  it('shows an error when nothing is selected', () => {
    const page = Page.visit(RiskAtAddressPage, { orderId: mockOrderId })

    page.form.continueButton.click()

    Page.verifyOnPage(RiskAtAddressPage)
    page.errorSummary.shouldHaveError('Select all the possible risks at the installation address')
    page.form.riskCategoryField.shouldHaveValidationMessage('Select all the possible risks at the installation address')
  })

  it('saves multiple selections, continues to other risks and pre-checks them on revisit', () => {
    const page = Page.visit(RiskAtAddressPage, { orderId: mockOrderId })

    page.form.fillInWith(['Managed through IOM', 'Animals at the property, for example dogs'])
    page.form.continueButton.click()

    Page.verifyOnPage(OtherRisksPage)

    const revisited = Page.visit(RiskAtAddressPage, { orderId: mockOrderId })
    revisited.form.riskCategoryField.shouldHaveValue('Managed through IOM')
    revisited.form.riskCategoryField.shouldHaveValue('Animals at the property, for example dogs')
    revisited.form.riskCategoryField.shouldNotHaveValueChecked('Other known risks')
  })
  ;[NO_RISK_OPTION, RISK_UNKNOWN_OPTION].forEach(exclusiveOption => {
    it(`selecting "${exclusiveOption}" deselects the other options`, () => {
      const page = Page.visit(RiskAtAddressPage, { orderId: mockOrderId })

      page.form.fillInWith(['Managed through IOM', 'Other known risks'])
      page.form.fillInWith(exclusiveOption)

      page.form.riskCategoryField.shouldHaveValue(exclusiveOption)
      page.form.riskCategoryField.shouldNotHaveValueChecked('Managed through IOM')
      page.form.riskCategoryField.shouldNotHaveValueChecked('Other known risks')
    })
  })

  it('selecting a risk deselects the exclusive options', () => {
    const page = Page.visit(RiskAtAddressPage, { orderId: mockOrderId })

    page.form.fillInWith(NO_RISK_OPTION)
    page.form.fillInWith('Managed through IOM')

    page.form.riskCategoryField.shouldNotHaveValueChecked(NO_RISK_OPTION)
  })
})
