import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAppointmentPage from '../../../pages/order/monitoring-conditions/installation-appointment'

const mockOrderId = uuidv4()
const mockDefaultOrder = {
  deviceWearer: {
    nomisId: 'nomis',
    pncId: 'pnc',
    deliusId: 'delius',
    prisonNumber: 'prison',
    complianceAndEnforcementPersonReference: 'cepr',
    courtCaseReferenceNumber: 'ccrn',
    firstName: 'test',
    lastName: 'tester',
    alias: 'tes',
    dateOfBirth: '2000-01-01T00:00:00Z',
    adultAtTimeOfInstallation: true,
    sex: 'MALE',
    gender: 'MALE',
    disabilities: 'MENTAL_HEALTH',
    otherDisability: null,
    noFixedAbode: false,
    interpreterRequired: false,
  },
  monitoringConditions: {
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-02-01T00:00:00Z',
    orderType: 'CIVIL',
    curfew: true,
    exclusionZone: true,
    trail: true,
    mandatoryAttendance: true,
    alcohol: true,
    conditionType: 'BAIL_ORDER',
    orderTypeDescription: 'DAPO',
    sentenceType: 'IPP',
    issp: 'YES',
    hdc: 'NO',
    prarr: 'UNKNOWN',
    offenceType: '',
  },
}
const stubGetOrder = order => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    order,
  })
}

context('Monitoring conditions', () => {
  context('Installation appointment', () => {
    context('Viewing a draft order with no installation appointment', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder({
          mockDefaultOrder,
        })
        cy.signIn()
      })

      it('Should display contents', () => {
        const page = Page.visit(InstallationAppointmentPage, {
          orderId: mockOrderId,
        })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
        page.form.placeNameField.shouldExist()
        page.form.appointmentDateField.shouldExist()
        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('not.exist')
        page.checkIsAccessible()
      })
    })
  })
})
