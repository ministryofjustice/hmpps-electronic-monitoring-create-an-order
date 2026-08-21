import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'
import { IdentityNumberName } from '../../../pages/components/forms/about-the-device-wearer/identityNumbersForm'

const mockOrderId = uuidv4()
const identityNumberFields: IdentityNumberName[] = [
  'nomisId',
  'deliusId',
  'pncId',
  'complianceAndEnforcementPersonReference',
  'courtCaseReferenceNumber',
]

const expectedValidationErrors = {
  noSelection: 'Select all identity numbers that you have for the device wearer',
  nomisId: 'Enter prison number',
  pncId: 'Enter PNC',
  deliusId: 'Enter CRN',
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
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId }, {}, identityNumberFields)

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(IdentityNumbersPage)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.noSelection)
        page.form.checkboxes.shouldHaveValidationMessage(expectedValidationErrors.noSelection)
      })

      it('Should display error when checkbox is selected but input is empty', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId }, {}, identityNumberFields)

        page.form.checkboxes.set([
          'Prison number',
          'Case Reference Number (CRN)',
          'Police National Computer (PNC)',
          'Compliance and Enforcement Person Reference (CEPR)',
          'Court Case Reference Number (CCRN)',
        ])

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(IdentityNumbersPage)

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.nomisId)
        page.errorSummary.shouldHaveError(expectedValidationErrors.pncId)
        page.errorSummary.shouldHaveError(expectedValidationErrors.deliusId)
        page.errorSummary.shouldHaveError(expectedValidationErrors.complianceAndEnforcementPersonReference)
        page.errorSummary.shouldHaveError(expectedValidationErrors.courtCaseReferenceNumber)

        page.form.field('nomisId').shouldHaveValidationMessage(expectedValidationErrors.nomisId)
        page.form.field('pncId').shouldHaveValidationMessage(expectedValidationErrors.pncId)
        page.form.field('deliusId').shouldHaveValidationMessage(expectedValidationErrors.deliusId)
        page.form
          .field('complianceAndEnforcementPersonReference')
          .shouldHaveValidationMessage(expectedValidationErrors.complianceAndEnforcementPersonReference)
        page.form
          .field('courtCaseReferenceNumber')
          .shouldHaveValidationMessage(expectedValidationErrors.courtCaseReferenceNumber)
      })
    })
  })
})
