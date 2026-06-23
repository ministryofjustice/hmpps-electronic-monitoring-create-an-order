import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import Page from '../../../pages/page'
import InstallationAppointmentPage from '../../../pages/order/monitoring-conditions/installation-appointment'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'

const mockOrderId = uuidv4()
const apiPath = '/installation-appointment'
context('Monitoring conditions', () => {
  context('Installation Appointment', () => {
    context('Submission', () => {
      const validFormData = {
        placeName: 'Mock Place',
        appointmentDate: new Date(2025, 0, 1, 10, 0, 0),
      }
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            installationLocation: {
              location: 'PRISON',
            },
          },
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            placeName: 'mock place',
            appointmentDate: '2025-01-01T10:00:00Z',
            appointmentTimeDetails: '',
          },
        })
        cy.signIn()
      })

      it('Should submit a correctly formatted installation appointment and continue to installation address page', () => {
        const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()
        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            placeName: validFormData.placeName,
            appointmentDate: '2025-01-01T10:00:00.000Z',
            appointmentTimeDetails: '',
          },
        }).should('be.true')
        Page.verifyOnPage(InstallationAddressPage)
      })

      context('when the address is primary', () => {
        it('should continue to check your answers', () => {
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: {
              interestedParties: {
                notifyingOrganisation: 'HOME_OFFICE',
                notifyingOrganisationName: '',
                notifyingOrganisationEmail: 'notifying@organisation',
                responsibleOrganisation: 'HOME_OFFICE',
                responsibleOfficerPhoneNumber: '',
                responsibleOrganisationEmail: 'responsible@organisation',
                responsibleOrganisationRegion: '',
                responsibleOfficerName: 'name',
              },
              installationLocation: {
                location: 'PRIMARY',
              },
            },
          })
          const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
          const appointmentTimeDetails = faker.string.fromCharacters(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            10,
          )
          page.form.fillInWith({
            appointmentTimeDetails,
            ...validFormData,
          })
          page.form.saveAndContinueButton.click()

          cy.task('stubCemoVerifyRequestReceived', {
            uri: `/orders/${mockOrderId}${apiPath}`,
            body: {
              placeName: validFormData.placeName,
              appointmentDate: '2025-01-01T10:00:00.000Z',
              appointmentTimeDetails,
            },
          }).should('be.true')
          Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answers')
        })
      })
    })
  })
})
