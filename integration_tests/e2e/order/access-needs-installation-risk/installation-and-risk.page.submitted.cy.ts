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
            installationAndRisk: {
              offence: 'SEXUAL_OFFENCES',
              riskCategory: ['RISK_TO_GENDER', 'SAFEGUARDING_ISSUE'],
              riskDetails: 'Information about potential risks',
              mappaLevel: 'MAPPA 1',
              mappaCaseType: 'TACT (Terrorism Act, Counter Terrorism)',
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
        page.form.riskCategoryField.shouldHaveValue('Offensive towards someone because of their sex or gender')
        page.form.riskCategoryField.shouldHaveValue('Safeguarding Issues')
        page.form.riskDetailsField.shouldHaveValue('Information about potential risks')
        page.form.mappaLevelField.shouldHaveValue('MAPPA 1')
        page.form.mappaCaseTypeField.shouldHaveValue('Terrorism Act, Counter Terrorism')

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
