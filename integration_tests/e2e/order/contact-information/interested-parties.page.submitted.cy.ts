import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'

const mockOrderId = uuidv4()

context('Contact information', () => {
  context('Interested parties', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
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
          },
        })

        cy.signIn()
      })

      it('should correctly display the page', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        // Should show the header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Should indicate the page is submitted
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')

        // Should display the saved data
        page.form.notifyingOrganisationField.shouldHaveValue('Prison')
        page.form.prisonField.shouldHaveValue('FELTHAM_YOUNG_OFFENDER_INSTITUTION')
        page.form.notifyOrganisationEmailAddressField.shouldHaveValue('test@test.com')
        page.form.responsibleOfficerNameField.shouldHaveValue('John Smith')
        page.form.responsibleOfficerContactNumberField.shouldHaveValue('01234567890')
        page.form.responsibleOrganisationField.shouldHaveValue('Probation')
        page.form.probationRegionField.shouldHaveValue('NORTH_EAST')
        page.form.responsibleOrganisationEmailAddressField.shouldHaveValue('test2@test.com')

        // Should have the correct buttons
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAndReturnButton.should('not.exist')
        page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)

        // Should not be editable
        page.form.shouldBeDisabled()

        // Should not have errors
        page.errorSummary.shouldNotExist()
      })
    })
  })
})
