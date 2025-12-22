import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'
import InstallationAppointmentPage from '../../../pages/order/monitoring-conditions/installation-appointment'

import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'
import CheckYourAnswersPage from '../../../pages/checkYourAnswersPage'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'

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
        ceprId: 'cepr',
        ccrnId: 'ccrn',
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
        pilot: '',
        offenceType: '',
      },
      addresses: [
        {
          addressType: 'PRIMARY',
          addressLine1: '10 Downing Street',
          addressLine2: '',
          addressLine3: 'London',
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
          pilot: '',
          offenceType: '',
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            location: 'PRISON',
          },
        })
        cy.signIn()
      })

      context('Should submit a correctly formatted installation location', () => {
        const locationMap = new Map<string, string>([
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

        it(`Should continue to check your answer page`, () => {
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
            pilot: '',
            offenceType: '',
          })
          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: '10 Downing Street, London, SW1A 2AB',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(CheckYourAnswersPage, 'Check your answers')
        })
      })

      context('Should continue to Installation appointment page', () => {
        it(`when selected location is prison`, () => {
          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: {
              location: 'PRISON',
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

        it(`when selected location is probation`, () => {
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

        it('no selecting at another address', () => {
          const orderWithoutFixedAddress = { ...mockDefaultOrder }
          orderWithoutFixedAddress.addresses = []
          orderWithoutFixedAddress.deviceWearer.noFixedAbode = true
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: orderWithoutFixedAddress,
          })

          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: {
              location: 'INSTALLATION',
            },
          })

          const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
          const validFormData = {
            location: 'At another address',
          }
          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(InstallationAddressPage)

          cy.task('stubCemoVerifyRequestReceived', {
            uri: `/orders/${mockOrderId}${apiPath}`,
            body: {
              location: 'INSTALLATION',
            },
          }).should('be.true')
        })
      })

      context('When changing an answer from the Check your Answers page', () => {
        it('should return to Monitoring Conditions CYA after no change (prison to prison)', () => {
          const mockCompletedOrder = {
            ...mockDefaultOrder,
            installationLocation: { location: 'PRISON' },
            installationAppointment: { placeName: 'HMP Mock', appointmentDate: '2026-01-05T10:00:00Z' },
            addresses: [
              ...mockDefaultOrder.addresses,
              {
                addressType: 'INSTALLATION',
                addressLine1: 'Mock Prison Address 1',
                addressLine2: 'M',
                addressLine3: 'M',
                addressLine4: 'M',
                postcode: 'MOCK P1',
              },
            ],
            monitoringConditions: {
              ...mockDefaultOrder.monitoringConditions,
              isValid: true,
            },
            monitoringConditionsAlcohol: {
              monitoringType: 'ALCOHOL_ABSTINENCE',
              startDate: '2026-03-27T00:00:00.000Z',
              endDate: '2027-04-28T00:00:00.000Z',
            },
          }

          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: mockCompletedOrder,
          })

          const cyaPage = Page.visit(
            MonitoringConditionsCheckYourAnswersPage,
            { orderId: mockOrderId },
            {},
            'Check your answers',
          )
          const questionText = 'Where will installation of the electronic monitoring device take place?'

          cyaPage.changeLinkByQuestion(questionText).click()

          const locationPage = Page.verifyOnPage(InstallationLocationPage)

          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: { location: 'PRISON' },
          })

          const validFormData = { location: 'At a prison' }
          locationPage.form.fillInWith(validFormData)
          locationPage.form.saveAndContinueButton.click()

          Page.verifyOnPage(
            MonitoringConditionsCheckYourAnswersPage,
            { orderId: mockOrderId },
            {},
            'Check your answers',
          )
        })

        it('should navigate to the appointment page when the installation location is changed from prison to probation', () => {
          const mockCompletedOrder = {
            ...mockDefaultOrder,
            monitoringConditions: {
              ...mockDefaultOrder.monitoringConditions,
              alcohol: true,
            },
            installationLocation: { location: 'PRISON' },
            installationAppointment: {
              placeName: 'HMP Pentonville',
              appointmentDate: '2025-10-20T14:30:00Z',
            },
            addresses: [
              ...mockDefaultOrder.addresses,
              {
                addressType: 'INSTALLATION',
                addressLine1: 'HMP Pentonville',
                addressLine2: 'Caledonian Rd',
                addressLine3: 'Islington',
                addressLine4: 'London',
                postcode: 'N7 8TT',
              },
            ],
            monitoringConditionsAlcohol: {
              monitoringType: 'ALCOHOL_ABSTINENCE',
              startDate: '2025-09-20T00:00:00Z',
              endDate: '2025-12-20T00:00:00Z',
            },
          }

          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: mockCompletedOrder,
          })

          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: { location: 'PROBATION_OFFICE' },
          })

          const cyaPage = Page.visit(
            MonitoringConditionsCheckYourAnswersPage,
            { orderId: mockOrderId },
            {},
            'Check your answers',
          )
          cyaPage
            .changeLinkByQuestion('Where will installation of the electronic monitoring device take place?')
            .click()

          const locationPage = Page.verifyOnPage(InstallationLocationPage)

          const mockOrderAfterChange = {
            ...mockCompletedOrder,
            installationLocation: { location: 'PROBATION_OFFICE' },
            installationAppointment: null,
            addresses: mockCompletedOrder.addresses.filter(a => a.addressType !== 'INSTALLATION'),
          }

          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: mockOrderAfterChange,
          })

          locationPage.form.fillInWith({ location: 'At a probation office' })
          locationPage.form.saveAndContinueButton.click()

          Page.verifyOnPage(InstallationAppointmentPage)
        })
      })
    })
  })
})
