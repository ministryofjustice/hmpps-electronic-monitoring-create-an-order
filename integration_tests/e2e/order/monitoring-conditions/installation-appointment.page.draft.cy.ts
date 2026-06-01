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
    homeOfficeReferenceNumber: '',
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
    pilot: '',
    offenceType: '',
  },
}
const stubGetOrder = ({ notifyingOrg = 'PRISON', installationLocation = 'PRIMARY' } = {}) => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    order: {
      ...mockDefaultOrder,
      interestedParties: {
        notifyingOrganisation: notifyingOrg,
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOrganisationRegion: '',
        responsibleOfficerName: 'name',
      },
      installationLocation: {
        location: installationLocation,
      },
    },
  })
}

context('Monitoring conditions', () => {
  context('Installation appointment', () => {
    context('Viewing a draft order for a Home Office order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder({ notifyingOrg: 'HOME_OFFICE' })
        cy.signIn()
      })

      it('Should display Home Office specific appointment time question text when installing at a primary address', () => {
        Page.visit(InstallationAppointmentPage, {
          orderId: mockOrderId,
        })
        cy.get('.form-time legend').should(
          'contains.text',
          'What is the preferred time for installation to take place?',
        )
        cy.get('.form-time .govuk-hint').should(
          'contains.text',
          "If the installation can't be done at this time, it will happen during standard hours. Enter time using a 24 hour clock. For example, enter 14:30 instead of 2:30pm",
        )
      })

      it('Should display default appointment time question text when installing at a prison', () => {
        stubGetOrder({ notifyingOrg: 'HOME_OFFICE', installationLocation: 'PRISON' })
        Page.visit(InstallationAppointmentPage, {
          orderId: mockOrderId,
        })
        cy.get('.form-time legend').should('contains.text', 'What time will installation take place?')
        cy.get('.form-time .govuk-hint').should(
          'contains.text',
          'Enter time using a 24 hour clock. For example, enter 14:30 instead of 2:30pm',
        )
      })
    })

    context('Viewing a draft order with no installation appointment', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder()
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
        cy.get('.form-time legend').should('contains.text', 'What time will installation take place?')
        cy.get('.form-time .govuk-hint').should(
          'contains.text',
          'Enter time using a 24 hour clock. For example, enter 14:30 instead of 2:30pm',
        )
      })
    })
  })
})
