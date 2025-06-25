import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAppointmentPage from '../../../pages/order/monitoring-conditions/installation-appointment'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'

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
          },
        }).should('be.true')
        Page.verifyOnPage(InstallationAddressPage)
      })
    })
  })
})
