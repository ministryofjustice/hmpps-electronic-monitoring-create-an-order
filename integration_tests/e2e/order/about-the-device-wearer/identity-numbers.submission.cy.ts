import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'
import { IdentityNumberName } from '../../../pages/components/forms/about-the-device-wearer/identityNumbersForm'
import { NotifyingOrganisation } from '../../../../server/models/NotifyingOrganisation'
import { IdentityNumberType } from '../../../../server/models/DeviceWearer'
import DeviceWearerSearchResultsPage from '../../../pages/order/about-the-device-wearer/device-wearer-search-results'

const mockOrderId = uuidv4()
const apiPath = '/device-wearer/identity-numbers'

type SubmissionCase = {
  notifyingOrganisation: NotifyingOrganisation
  fields: IdentityNumberName[]
  formData: Partial<Record<IdentityNumberName, string>>
  identityNumbers: IdentityNumberType[]
}

const submissionCases: SubmissionCase[] = [
  {
    notifyingOrganisation: 'PRISON',
    fields: ['nomisId'],
    formData: { nomisId: 'nomis' },
    identityNumbers: ['NOMIS'],
  },
  {
    notifyingOrganisation: 'HOME_OFFICE',
    fields: ['complianceAndEnforcementPersonReference'],
    formData: { complianceAndEnforcementPersonReference: 'cepr' },
    identityNumbers: ['COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE'],
  },
  {
    notifyingOrganisation: 'PROBATION',
    fields: ['nomisId', 'deliusId'],
    formData: { nomisId: 'nomis', deliusId: 'delius' },
    identityNumbers: ['NOMIS', 'DELIUS'],
  },
  {
    notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
    fields: ['pncId', 'nomisId'],
    formData: { pncId: 'pnc', nomisId: 'nomis' },
    identityNumbers: ['PNC', 'NOMIS'],
  },
  {
    notifyingOrganisation: 'CIVIL_COUNTY_COURT',
    fields: ['courtCaseReferenceNumber'],
    formData: { courtCaseReferenceNumber: 'ccrn' },
    identityNumbers: ['COURT_CASE_REFERENCE_NUMBER'],
  },
]
const emptyIdentityNumbers = {
  nomisId: '',
  pncId: '',
  deliusId: '',
  prisonNumber: '',
  homeOfficeReferenceNumber: '',
  complianceAndEnforcementPersonReference: '',
  courtCaseReferenceNumber: '',
}
const stubIdentityNumbersSubmission = () => {
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
}

context('About the device wearer', () => {
  context('Identity numbers', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          isSentencingAct: true,
          interestedParties: {
            notifyingOrganisation: 'PRISON',
          },
        },
      })
      stubIdentityNumbersSubmission()
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

    submissionCases.forEach(({ notifyingOrganisation, fields, formData, identityNumbers }) => {
      it(`should submit identity numbers for the ${notifyingOrganisation} cohort`, () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { interestedParties: { notifyingOrganisation } },
        })

        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId }, {}, fields)
        page.form.fillInWith(formData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            identityNumbers,
            ...emptyIdentityNumbers,
            ...formData,
          },
        }).should('be.true')
      })
    })

    context('Navigation', () => {
      beforeEach(() => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            interestedParties: { notifyingOrganisation: 'PRISON' },
            isSentencingAct: false,
          },
        })
      })

      it('should continue to device wearer search results page', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        page.form.fillInWith({ nomisId: 'nomis' })
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(DeviceWearerSearchResultsPage, { orderId: mockOrderId, identifyNumber: 'nomis' })
      })

      it('should return to the summary page', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId }, {}, ['nomisId'])

        page.form.fillInWith({ nomisId: 'nomis' })
        page.form.saveAsDraftButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
