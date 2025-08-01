import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import VariationDetailsPage from '../../../pages/order/variation/variationDetails'

const mockOrderId = uuidv4()

context('Variation', () => {
  context('Variation Details', () => {
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
            variationDetails: {
              variationType: 'CHANGE_TO_ADDRESS',
              variationDate: '2025-01-01T00:00:00Z',
              variationDetails: 'Change to address',
            },
          },
        })

        cy.signIn()
      })

      it('should correctly display the page', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        // Should show the header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Should indicate the page is submitted
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')

        // Should display the saved data
        // Hide variation type question based on ticket https://dsdmoj.atlassian.net/browse/ELM-3923
        // page.form.variationTypeField.shouldHaveValue('The device wearer’s address')
        page.form.variationDateField.shouldHaveValue(new Date('2025-01-01T00:00:00Z'))
        page.form.variationDetailsField.shouldHaveValue('Change to address')

        // Should have the correct buttons
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAsDraftButton.should('not.exist')
        page.backButton.should('exist').should('have.attr', 'href', '#')

        // Should not be editable
        page.form.shouldBeDisabled()

        // Should not have errors
        page.errorSummary.shouldNotExist()
      })
    })
  })
})
