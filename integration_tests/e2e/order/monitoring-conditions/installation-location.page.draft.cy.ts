import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'

const mockOrderId = uuidv4()
const mockDefaultOrder = {
  deviceWearer: {
    nomisId: 'nomis',
    pncId: 'pnc',
    deliusId: 'delius',
    prisonNumber: 'prison',
    homeOfficeReferenceNumber: 'ho',
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
  context('Installation location', () => {
    context('Viewing a draft order with no installation location', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder({
          ...mockDefaultOrder,
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '10 Downing Street',
              addressLine2: 'London',
              addressLine3: '',
              addressLine4: '',
              postcode: 'SW1A 2AB',
            },
          ],
        })
        cy.signIn()
      })

      it('Should display contents', () => {
        const page = Page.visit(InstallationLocationPage, {
          orderId: mockOrderId,
        })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')

        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('not.exist')
        page.checkIsAccessible()
      })

      it('Should grey out fixed address option, when device wearer has no fixed address', () => {
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder({
          ...mockDefaultOrder,
          deviceWearer: {
            nomisId: 'nomis',
            pncId: 'pnc',
            deliusId: 'delius',
            prisonNumber: 'prison',
            homeOfficeReferenceNumber: 'ho',
            firstName: 'test',
            lastName: 'tester',
            alias: 'tes',
            dateOfBirth: '2000-01-01T00:00:00Z',
            adultAtTimeOfInstallation: true,
            sex: 'MALE',
            gender: 'MALE',
            disabilities: 'MENTAL_HEALTH',
            otherDisability: null,
            noFixedAbode: true,
            interpreterRequired: false,
          },
        })
        const page = Page.visit(InstallationLocationPage, {
          orderId: mockOrderId,
        })
        page.form.locationField.shouldHaveDisabledOption('Device wearer has no fixed address')
      })

      it('Should show fixed address option, when device wearer has fixed address', () => {
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        const page = Page.visit(InstallationLocationPage, {
          orderId: mockOrderId,
        })
        page.form.shouldNotBeDisabled()
        page.form.locationField.shouldHaveOption('10 Downing Street, London, SW1A 2AB')
      })

      it('Should show options for probation and prison, when only alcohol monitoring is selected', () => {
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder({
          ...mockDefaultOrder,
          monitoringConditions: {
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: false,
            exclusionZone: false,
            trail: false,
            mandatoryAttendance: false,
            alcohol: true,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
            pilot: '',
          },
        })
        const page = Page.visit(InstallationLocationPage, {
          orderId: mockOrderId,
        })
        page.form.locationField.shouldHaveOption('At a prison')
        page.form.locationField.shouldHaveOption('At a probation office')
      })

      it('Should not show options for probation and prison, when alcohol monitoring is not monitoring type selected', () => {
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder({
          ...mockDefaultOrder,
          monitoringConditions: {
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: false,
            exclusionZone: false,
            trail: false,
            mandatoryAttendance: true,
            alcohol: true,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
            pilot: '',
          },
        })
        const page = Page.visit(InstallationLocationPage, {
          orderId: mockOrderId,
        })
        page.form.locationField.shouldNotHaveOption('At a prison')
        page.form.locationField.shouldNotHaveOption('At a probation office')
      })
    })
  })
})
