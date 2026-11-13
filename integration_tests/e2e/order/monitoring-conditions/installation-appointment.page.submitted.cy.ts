import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAppointmentPage from '../../../pages/order/monitoring-conditions/installation-appointment'

const mockOrderId = uuidv4()
context('Monitoring conditions', () => {
  context('Installation appointment', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            installationAppointment: { placeName: 'Mock Place', appointmentDate: '2025-01-01T10:00:00Z' },
          },
        })

        cy.signIn()
      })

      it('Should display content in read only mode', () => {
        const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAsDraftButton.should('not.exist')
        page.returnBackToFormSectionMenuButton
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderId}/summary`)
        page.form.placeNameField.shouldHaveValue('Mock Place')
        page.form.appointmentDateField.shouldHaveValue(new Date(2025, 0, 1, 10, 0, 0))
        page.form.shouldBeDisabled()
        page.errorSummary.shouldNotExist()
      })
    })
    context('Viewing a submitted prison installation order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'test tester', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            installationAppointment: { placeName: 'ALTCOURSE_PRISON', appointmentDate: '2025-01-01T10:00:00Z' },
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

        cy.signIn()
      })

      it('Should display content in read only mode', () => {
        const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'T. Tester')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAsDraftButton.should('not.exist')
        page.returnBackToFormSectionMenuButton
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderId}/summary`)
        page.form.prisonNameField.shouldHaveValue('Altcourse Prison')
        page.form.appointmentDateField.shouldHaveValue(new Date(2025, 0, 1, 10, 0, 0))
        page.form.prisonNameField.shouldBeDisabled()
        page.errorSummary.shouldNotExist()
      })
    })
  })
})
