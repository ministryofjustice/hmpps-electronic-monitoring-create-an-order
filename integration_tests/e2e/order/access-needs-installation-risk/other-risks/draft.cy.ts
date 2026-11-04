import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import { OTHER_RISKS_DETAILS_HINT } from './OtherRisksComponent'
import OtherRisksPage from './OtherRisksPage'

const mockOrderId = uuidv4()

context('other risks page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    cy.signIn()
  })

  it('shows nothing selected', () => {
    const page = Page.visit(OtherRisksPage, { orderId: mockOrderId })

    page.form.hasOtherRisksField.shouldNotBeDisabled()
    page.form.hasOtherRisksField.shouldNotHaveValue()
  })

  it('reveals the details field and its hint when Yes is selected', () => {
    const page = Page.visit(OtherRisksPage, { orderId: mockOrderId })

    page.form.otherRisksDetailsField.element.should('not.be.visible')
    page.form.hasOtherRisksField.set('Yes')
    page.form.otherRisksDetailsField.element.should('be.visible')
    cy.contains(OTHER_RISKS_DETAILS_HINT).should('be.visible')
  })

  it('shows an error when no option is selected', () => {
    const page = Page.visit(OtherRisksPage, { orderId: mockOrderId })

    page.form.continueButton.click()

    Page.verifyOnPage(OtherRisksPage)
    page.errorSummary.shouldHaveError('Select yes if there are any other risks to be aware of')
    page.form.hasOtherRisksField.shouldHaveValidationMessage('Select yes if there are any other risks to be aware of')
  })

  it('shows an error when Yes is selected without details', () => {
    const page = Page.visit(OtherRisksPage, { orderId: mockOrderId })

    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    Page.verifyOnPage(OtherRisksPage)
    page.errorSummary.shouldHaveError('Enter what other risks there are')
    page.form.otherRisksDetailsField.shouldHaveValidationMessage('Enter what other risks there are')
  })
})
