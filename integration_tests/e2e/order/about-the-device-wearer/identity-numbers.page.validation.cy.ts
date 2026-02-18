import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'

const mockOrderId = uuidv4()

const expectedValidationErrors = {
  noSelection: 'Select all identity numbers that you have for the device wearer',
  nomisId: 'Enter NOMIS ID',
  pncId: 'Enter PNC',
  deliusId: 'Enter NDelius ID',
  prisonNumber: 'Enter Prison Number',
  complianceAndEnforcementPersonReference: 'Enter Compliance and Enforcement Person Reference',
  courtCaseReferenceNumber: 'Enter Court Case Reference Number',
}

context('About the device wearer', () => {
  context('Identity numbers', () => {
    context('Submitting invalid identity numbers', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display error when no checkbox is selected', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(IdentityNumbersPage)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.noSelection)
        page.form.checkboxes.shouldHaveValidationMessage(expectedValidationErrors.noSelection)
      })

      it('Should display error when checkbox is selected but input is empty', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        page.form.checkboxes.set([
          'Police National Computer (PNC)',
          'National Offender Management Information System (NOMIS)',
          'Prison Number',
          'NDelius ID',
          'Compliance and Enforcement Person Reference (CEPR)',
          'Court Case Reference Number (CCRN)',
        ])

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(IdentityNumbersPage)

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.nomisId)
        page.errorSummary.shouldHaveError(expectedValidationErrors.pncId)
        page.errorSummary.shouldHaveError(expectedValidationErrors.deliusId)
        page.errorSummary.shouldHaveError(expectedValidationErrors.prisonNumber)
        page.errorSummary.shouldHaveError(expectedValidationErrors.complianceAndEnforcementPersonReference)
        page.errorSummary.shouldHaveError(expectedValidationErrors.courtCaseReferenceNumber)

        page.form.nomisIdField.shouldHaveValidationMessage(expectedValidationErrors.nomisId)
        page.form.pncIdField.shouldHaveValidationMessage(expectedValidationErrors.pncId)
        page.form.deliusIdField.shouldHaveValidationMessage(expectedValidationErrors.deliusId)
        page.form.prisonNumberField.shouldHaveValidationMessage(expectedValidationErrors.prisonNumber)
        page.form.complianceField.shouldHaveValidationMessage(
          expectedValidationErrors.complianceAndEnforcementPersonReference,
        )
        page.form.courtCaseField.shouldHaveValidationMessage(expectedValidationErrors.courtCaseReferenceNumber)
      })
    })
  })
})
