import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IntallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'

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
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue, and return buttons', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.continueButton().should('exist')
      page.returnButton().should('exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })
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
            offence: 'some offence',
            riskCategory: ['some risk category'],
            riskDetails: 'some risk details',
            mappaLevel: 'some mappaLevel',
            mappaCaseType: 'some mappaCaseType',
          },
        },
      })
      cy.signIn()
    })

    it('shows risk information caption', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.caption.contains('Risk information')
    })

    it('shows answers for checking', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        { key: 'What type of offence did the device wearer commit? (optional)', value: 'some offence' },
        { key: 'At installation what are the possible risks? (optional)', value: 'some risk category' },
        { key: 'Any other risks to be aware of? (optional)', value: 'some risk details' },
        { key: 'Which level of MAPPA applies? (optional)', value: 'some mappaLevel' },
        { key: 'What is the MAPPA case type? (optional)', value: 'some mappaCaseType' },
      ])
    })

    it('shows correct buttons', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.continueButton().should('exist')
      page.returnButton().should('exist')
    })
  })
})
