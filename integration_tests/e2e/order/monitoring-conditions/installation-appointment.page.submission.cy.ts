import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import Page from '../../../pages/page'
import InstallationAppointmentPage from '../../../pages/order/monitoring-conditions/installation-appointment'
import FindAddressPage from '../postcode-lookup/find-address/findAddressPage'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'

const mockOrderId = uuidv4()
const apiPath = '/installation-appointment'
context('Monitoring conditions', () => {
  context('Installation Appointment', () => {
    context('Submission', () => {
      const validFormData = {
        placeName: 'Altcourse Prison',
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
            interestedParties: {
              notifyingOrganisation: 'PRISON',
              notifyingOrganisationName: 'WYMOTT_PRISON',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'POLICE',
              responsibleOrganisationPhoneNumber: '01234567890',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'CHESHIRE',
              responsibleOrganisationAddress: {
                addressType: 'RESPONSIBLE_ORGANISATION',
                addressLine1: 'addressLine1',
                addressLine2: 'addressLine2',
                addressLine3: 'addressLine3',
                addressLine4: 'addressLine4',
                postcode: 'postcode',
              },
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
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
        page.form.fillInWith(validFormData, 'PRISON')
        page.form.saveAndContinueButton.click()
        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            placeName: 'ALTCOURSE_PRISON',
            appointmentDate: '2025-01-01T10:00:00.000Z',
            appointmentTimeDetails: '',
          },
        }).should('be.true')
        Page.verifyOnPage(FindAddressPage)
      })

      it('Should submit a correctly formatted installation appointment and continue to installation address page with the prison name auto populated when installation is at prison', () => {
        const formDataUsingDefaultPlaceName = {
          appointmentDate: new Date(2025, 0, 1, 10, 0, 0),
        }
        const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })

        cy.contains('label', 'What is the name of the prison where installation will take place?').should('be.visible')

        cy.get('input#placeName').should('have.value', 'Wymott Prison')
        cy.get('select#placeName-select').should('have.value', 'WYMOTT_PRISON')

        page.form.fillInWith(formDataUsingDefaultPlaceName, 'PRISON')
        page.form.saveAndContinueButton.click()
        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            placeName: 'WYMOTT_PRISON',
            appointmentDate: '2025-01-01T10:00:00.000Z',
            appointmentTimeDetails: '',
          },
        }).should('be.true')
        Page.verifyOnPage(FindAddressPage)
      })

      context('when the address is primary', () => {
        it('should continue to check your answers', () => {
          const formDataForSubmission = {
            placeName: 'Mock Data',
            appointmentDate: new Date(2025, 0, 1, 10, 0, 0),
          }
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
            ...formDataForSubmission,
          })
          page.form.saveAndContinueButton.click()

          cy.task('stubCemoVerifyRequestReceived', {
            uri: `/orders/${mockOrderId}${apiPath}`,
            body: {
              placeName: formDataForSubmission.placeName,
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
