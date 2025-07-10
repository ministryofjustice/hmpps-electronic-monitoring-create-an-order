import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import ProbationDeliveryUnitPage from '../../../pages/order/contact-information/probation-delivery-unit'

const mockOrderId = uuidv4()

context('Contact information', () => {
  context('Probation delivery unit', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            dataDictionaryVersion: 'DDV5',
            interestedParties: {
              notifyingOrganisation: 'PRISON',
              notifyingOrganisationName: 'FELTHAM_YOUNG_OFFENDER_INSTITUTION',
              notifyingOrganisationEmail: 'test@test.com',
              responsibleOfficerName: 'John Smith',
              responsibleOfficerPhoneNumber: '01234567890',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOrganisationEmail: 'test2@test.com',
            },
            probationDeliveryUnit: {
              unit: 'COUNTY_DURHAM_AND_DARLINGTON',
            },
          },
        })

        cy.signIn()
      })

      it('should correctly display the page', () => {
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        // Should show the header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Should indicate the page is submitted
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')

        // Should display the saved data
        page.form.unitField.shouldHaveValue('County Durham and Darlington')

        // Should have the correct buttons
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAndReturnButton.should('not.exist')
        page.backButton.should('exist').should('have.attr', 'href', '#')

        // Should not be editable
        page.form.shouldBeDisabled()

        // Should not have errors
        page.errorSummary.shouldNotExist()
      })
    })
  })
})
