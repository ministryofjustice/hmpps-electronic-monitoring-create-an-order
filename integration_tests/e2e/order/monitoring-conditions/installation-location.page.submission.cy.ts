import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'
import EnforcementZonePage from '../../../pages/order/monitoring-conditions/enforcement-zone'
import AttendanceMonitoringPage from '../../../pages/order/monitoring-conditions/attendance-monitoring'
import AlcoholMonitoringPage from '../../../pages/order/monitoring-conditions/alcohol-monitoring'
import TrailMonitoringPage from '../../../pages/order/monitoring-conditions/trail-monitoring'
import CurfewConditionsPage from '../../../pages/order/monitoring-conditions/curfew-conditions'
import InstallationAppointmentPage from '../../../pages/order/monitoring-conditions/installation-appointment'

const mockOrderId = uuidv4()
const apiPath = '/installation-location'
context('Monitoring conditions', () => {
  context('Installation location', () => {
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
      },
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
    }

    const stubGetOrder = monitoringConditions => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          ...mockDefaultOrder,
          monitoringConditions,
        },
      })
    }
    context('Submission', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder({
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
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            location: 'INSTALLATION',
          },
        })
        cy.signIn()
      })

      context('Should submit a correctly formatted installation location', () => {
        const locationMap = new Map<string, string>([
          ['At another address', 'INSTALLATION'],
          ['10 Downing Street, London, SW1A 2AB', 'PRIMARY'],
          ['At a prison', 'PRISON'],
          ['At a probation office', 'PROBATION_OFFICE'],
        ])
        locationMap.forEach((key, value) =>
          it(`Should submit location as ${key}`, () => {
            cy.task('stubCemoSubmitOrder', {
              httpStatus: 200,
              id: mockOrderId,
              subPath: apiPath,
              response: {
                location: value,
              },
            })

            const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })

            const validFormData = {
              location: value,
            }

            page.form.fillInWith(validFormData)
            page.form.saveAndContinueButton.click()
            cy.task('stubCemoVerifyRequestReceived', {
              uri: `/orders/${mockOrderId}${apiPath}`,
              body: {
                location: key,
              },
            }).should('be.true')
          }),
        )
      })

      context('Shoud continue to Installation address page', () => {
        it(`Should continue to Installaion address page`, () => {
          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: 'At another address',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(InstallationAddressPage)
        })
      })

      context('Should continue to monitoring types when primary address is selected', () => {
        beforeEach(() => {
          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: {
              location: 'PRIMARY',
            },
          })
        })

        it(`Should continue to exclusionZone page`, () => {
          stubGetOrder({
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: false,
            exclusionZone: true,
            trail: false,
            mandatoryAttendance: false,
            alcohol: false,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
          })
          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: '10 Downing Street, London, SW1A 2AB',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(EnforcementZonePage)
        })

        it(`Should continue to trail monitoring page`, () => {
          stubGetOrder({
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: false,
            exclusionZone: false,
            trail: true,
            mandatoryAttendance: false,
            alcohol: false,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
          })
          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: '10 Downing Street, London, SW1A 2AB',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(TrailMonitoringPage)
        })

        it(`Should continue to alcohol monitoring page`, () => {
          stubGetOrder({
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
          })
          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: '10 Downing Street, London, SW1A 2AB',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(AlcoholMonitoringPage)
        })

        it(`Should continue to curfew monitoring page`, () => {
          stubGetOrder({
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: true,
            exclusionZone: false,
            trail: false,
            mandatoryAttendance: false,
            alcohol: false,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
          })
          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: '10 Downing Street, London, SW1A 2AB',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(CurfewConditionsPage)
        })

        it(`Should continue to mandatory attendence monitoring page`, () => {
          stubGetOrder({
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: false,
            exclusionZone: false,
            trail: false,
            mandatoryAttendance: true,
            alcohol: false,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
          })
          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: '10 Downing Street, London, SW1A 2AB',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(AttendanceMonitoringPage)
        })
      })

      context('Shoud continue to Installation appointment page', () => {
        it(`when selected location is prison`, () => {
          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: {
              location: 'PROBATION_OFFICE',
            },
          })
          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: 'At a prison',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(InstallationAppointmentPage)
        })

        it(`when selected location is prison`, () => {
          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: {
              location: 'PROBATION_OFFICE',
            },
          })
          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: 'At a probation office',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(InstallationAppointmentPage)
        })
      })
    })
  })
})
