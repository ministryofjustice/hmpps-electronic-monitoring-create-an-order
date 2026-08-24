import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'
import DeviceWearerSearchResultsPage from '../../../pages/order/about-the-device-wearer/device-wearer-search-results'

const mockOrderId = uuidv4()
const apiPath = '/device-wearer/identity-numbers'

context('About the device wearer', () => {
  context('Identity numbers', () => {
    context('Submitting valid identity numbers', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            nomisId: null,
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            complianceAndEnforcementPersonReference: null,
            courtCaseReferenceNumber: null,
            firstName: null,
            lastName: null,
            alias: null,
            adultAtTimeOfInstallation: null,
            sex: null,
            gender: null,
            dateOfBirth: null,
            disabilities: null,
            noFixedAbode: false,
            interpreterRequired: null,
          },
        })
        cy.task('stubCemoRequest', {
          httpStatus: 200,
          method: 'GET',
          subPath: `orders/${mockOrderId}/device-wearer/search-results`,
          response: {
            fullName: 'Ermintrude Jones',
            dateOfBirth: '1974-01-19T00:00:00Z',
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted identity numbers submission', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        const validFormData = {
          nomisId: 'nomis',
          pncId: 'pnc',
          deliusId: 'delius',
          prisonNumber: 'prison',
          complianceAndEnforcementPersonReference: 'cepr',
          courtCaseReferenceNumber: 'ccrn',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            identityNumbers: [
              'PNC',
              'NOMIS',
              'PRISON_NUMBER',
              'DELIUS',
              'COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE',
              'COURT_CASE_REFERENCE_NUMBER',
            ],
            nomisId: 'nomis',
            pncId: 'pnc',
            deliusId: 'delius',
            prisonNumber: 'prison',
            homeOfficeReferenceNumber: '',
            complianceAndEnforcementPersonReference: 'cepr',
            courtCaseReferenceNumber: 'ccrn',
          },
        }).should('be.true')
      })

      it('should continue to device wearer search results page', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        const validFormData = {
          nomisId: 'nomis',
          pncId: 'pnc',
          deliusId: 'delius',
          prisonNumber: 'prison',
          complianceAndEnforcementPersonReference: 'cepr',
          courtCaseReferenceNumber: 'ccrn',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(DeviceWearerSearchResultsPage, { orderId: mockOrderId }, { searchedIdentifier: 'pnc' })
      })

      it('should return to the summary page', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        const validFormData = {
          nomisId: 'nomis',
          pncId: 'pnc',
          deliusId: 'delius',
          prisonNumber: 'prison',
          complianceAndEnforcementPersonReference: 'cepr',
          courtCaseReferenceNumber: 'ccrn',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAsDraftButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
