import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import InstallationAndRiskCheckYourAnswersSubmittedPage from '../../../pages/order/installation-and-risk/check-your-answers-submitted'

const mockOrderId = uuidv4()

context('installation and risk - check your answers', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue, and return buttons', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.continueButton().should('exist')
      page.returnButton().should('exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('risk information check answers page', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          installationAndRisk: {
            offence: 'SEXUAL_OFFENCES',
            riskCategory: ['RISK_TO_GENDER'],
            riskDetails: 'some risk details',
            mappaLevel: 'MAPPA 1',
            mappaCaseType: 'SOC (Serious Organised Crime)',
          },
        },
      })
      cy.signIn()
    })

    it('shows risk information caption', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.caption.contains('Risk information')
    })

    it('shows answers for checking', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

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
    })

    it('does show "change" links', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.changeLinks.should('exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.continueButton().should('exist')
      page.continueButton().contains('Save and go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Save as draft')
    })
  })

  context('risk information check answers page submitted', () => {
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
            riskCategory: ['RISK_TO_GENDER'],
            riskDetails: 'some risk details',
            mappaLevel: 'MAPPA 1',
            mappaCaseType: 'SOC (Serious Organised Crime)',
          },
        },
      })
      cy.signIn()
    })

    it('shows correct banner', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersSubmittedPage, { orderId: mockOrderId })

      page.banner.contains('You are viewing a submitted form. This form was submitted on the 14 December 2024.')
    })

    it('shows risk information caption', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersSubmittedPage, { orderId: mockOrderId })

      page.caption.contains('Risk information')
    })

    it('shows view answers heading', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersSubmittedPage, { orderId: mockOrderId })

      page.heading.contains('View answers')
    })

    it('shows answers for checking', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersSubmittedPage, { orderId: mockOrderId })

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
    })

    it('does not show "change" links', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersSubmittedPage, { orderId: mockOrderId })

      page.changeLinks.should('not.exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersSubmittedPage, { orderId: mockOrderId })

      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })
})
