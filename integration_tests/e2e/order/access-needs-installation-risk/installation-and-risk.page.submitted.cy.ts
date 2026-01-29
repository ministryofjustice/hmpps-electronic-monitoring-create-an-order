import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'

const mockOrderId = uuidv4()

context('Access needs and installation risk information', () => {
  context('Installation and Risk', () => {
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
            installationAndRisk: {
              offence: 'SEXUAL_OFFENCES',
              offenceAdditionalDetails: 'Information about offence',
              riskCategory: ['SEXUAL_OFFENCES', 'DANGEROUS_ANIMALS'],
              riskDetails: 'Information about potential risks',
              mappaLevel: null,
              mappaCaseType: null,
            },
          },
        })

        cy.signIn()
      })

      it('should correctly display the page', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

        // Should show the header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Should indicate the page is submitted
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')

        // Should display the saved data
        page.form.offenceField.shouldHaveValue('SEXUAL_OFFENCES')
        page.form.offenceAdditionalDetailsField.shouldHaveValue('Information about offence')
        page.form.possibleRiskField.shouldHaveValue('Sex offender')
        page.form.riskCategoryField.shouldHaveValue('Animals at the property, for example dogs')
        page.form.riskDetailsField.shouldHaveValue('Information about potential risks')

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
