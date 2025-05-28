import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'

const mockOrderId = uuidv4()

context('Access needs and installation risk information', () => {
  context('Installation and Risk', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the identity numbers', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backButton.should('exist')
      })

      it('Should be accessible', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })
        page.checkIsAccessible()
      })

      context('With MAPPA disabled', () => {
        const testFlags = { MAPPA_ENABLED: false }
        beforeEach(() => {
          cy.task('setFeatureFlags', testFlags)
        })
        afterEach(() => {
          cy.task('resetFeatureFlags')
        })

        it('Should not render the MAPPA form sections', () => {
          Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

          cy.get('form').find('legend').contains('Which level of MAPPA applies? (optional)').should('not.exist')
          cy.get('form').find('legend').contains('What is the MAPPA case type? (optional)').should('not.exist')
        })
      })

      context('With MAPPA enabled', () => {
        const testFlags = { MAPPA_ENABLED: true }
        beforeEach(() => {
          cy.task('setFeatureFlags', testFlags)
        })
        afterEach(() => {
          cy.task('resetFeatureFlags')
        })

        it('Should render the MAPPA form sections', () => {
          Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

          cy.get('form').find('legend').contains('Which level of MAPPA applies? (optional)').should('exist')
          cy.get('form').find('legend').contains('What is the MAPPA case type? (optional)').should('exist')
        })
      })
    })
  })
})
