import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'

const mockOrderId = uuidv4()

context('Installation and risk - check your answers', () => {
  context('Order that failed to submit to Serco', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'ERROR',
        order: {
          installationAndRisk: {
            offence: 'SEXUAL_OFFENCES',
            riskCategory: ['RISK_TO_GENDER'],
            riskDetails: 'some risk details',
            mappaLevel: 'MAPPA 1',
            mappaCaseType: 'SOC (Serious Organised Crime)',
          },
          fmsResultDate: new Date('2024 12 14'),
        },
      })
      cy.signIn()
    })

    it('should show answers without any actions', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'View answers')

      // Should show the correct answers
      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        { key: 'What type of offence did the device wearer commit? (optional)', value: 'Sexual offences' },
        {
          key: 'At installation what are the possible risks? (optional)',
          value: 'Offensive towards someone because of their sex or gender',
        },
        { key: 'Any other risks to be aware of? (optional)', value: 'some risk details' },
        { key: 'Which level of MAPPA applies? (optional)', value: 'MAPPA 1' },
        { key: 'What is the MAPPA case type? (optional)', value: 'Serious Organised Crime' },
      ])

      // Should not have any "change" links
      page.changeLinks.should('not.exist')

      // Should show the correct buttons
      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })
})
