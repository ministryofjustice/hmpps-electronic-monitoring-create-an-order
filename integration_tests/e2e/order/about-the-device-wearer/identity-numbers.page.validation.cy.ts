import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'
import { IdentityNumberName } from '../../../pages/components/forms/about-the-device-wearer/identityNumbersForm'
import { NotifyingOrganisation } from '../../../../server/models/NotifyingOrganisation'

const mockOrderId = uuidv4()

const expectedValidationErrors = {
  noSelection: 'Select all identity numbers that you have for the device wearer',
  nomisId: 'Enter prison number',
  pncId: 'Enter PNC ID',
  deliusId: 'Enter CRN',
  complianceAndEnforcementPersonReference: 'Enter Compliance and Enforcement Person Reference',
  courtCaseReferenceNumber: 'Enter Court Case Reference Number',
}

type ValidationCase = {
  notifyingOrganisation: NotifyingOrganisation
  fields: IdentityNumberName[]
  checkboxLabels?: string[]
}

const validationCases: ValidationCase[] = [
  {
    notifyingOrganisation: 'PRISON',
    fields: ['nomisId'],
  },
  {
    notifyingOrganisation: 'HOME_OFFICE',
    fields: ['complianceAndEnforcementPersonReference'],
  },
  {
    notifyingOrganisation: 'PROBATION',
    fields: ['nomisId', 'deliusId'],
    checkboxLabels: ['Prison number', 'Case Reference Number (CRN)'],
  },
  {
    notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
    fields: ['pncId', 'nomisId'],
    checkboxLabels: ['Police National Computer (PNC)', 'Prison number'],
  },
  {
    notifyingOrganisation: 'CIVIL_COUNTY_COURT',
    fields: ['courtCaseReferenceNumber'],
  },
]

context('About the device wearer', () => {
  context('Identity numbers', () => {
    context('Submitting invalid identity numbers', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.signIn()
      })

      validationCases.forEach(({ notifyingOrganisation, fields, checkboxLabels }) => {
        it(`should display field errors for the ${notifyingOrganisation} cohort`, () => {
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: { interestedParties: { notifyingOrganisation } },
          })

          const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId }, {}, fields)

          if (checkboxLabels) {
            page.form.checkboxes.set(checkboxLabels)
          }

          page.form.saveAndContinueButton.click()

          Page.verifyOnPage(IdentityNumbersPage, undefined, undefined, fields)
          page.errorSummary.shouldExist()

          fields.forEach(field => {
            const expectedError = expectedValidationErrors[field]
            page.errorSummary.shouldHaveError(expectedError)

            if (fields.length === 1) {
              page.form.singleField(field).shouldHaveValidationMessage(expectedError)
            } else {
              page.form.field(field).shouldHaveValidationMessage(expectedError)
            }
          })
        })

        if (checkboxLabels) {
          it(`should require an identity number selection for the ${notifyingOrganisation} cohort`, () => {
            cy.task('stubCemoGetOrder', {
              httpStatus: 200,
              id: mockOrderId,
              status: 'IN_PROGRESS',
              order: { interestedParties: { notifyingOrganisation } },
            })

            const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId }, {}, fields)
            page.form.saveAndContinueButton.click()

            Page.verifyOnPage(IdentityNumbersPage, undefined, undefined, fields)
            page.errorSummary.shouldExist()
            page.errorSummary.shouldHaveError(expectedValidationErrors.noSelection)
            page.form.checkboxes.shouldHaveValidationMessage(expectedValidationErrors.noSelection)
          })
        }
      })
    })
  })
})
