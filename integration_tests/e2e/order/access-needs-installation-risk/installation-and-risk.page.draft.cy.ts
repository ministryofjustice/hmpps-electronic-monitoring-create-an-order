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

      it('Should display contents', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backButton.should('exist')
        page.checkIsAccessible()
        page.form.shouldHaveAllOptions()
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

      context('With DDv5 enabled', () => {
        const testFlags = { DD_V5_1_ENABLED: true }
        beforeEach(() => {
          cy.task('setFeatureFlags', testFlags)
        })
        afterEach(() => {
          cy.task('resetFeatureFlags')
        })

        it('Should have additional safeguarding options', () => {
          Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })
          const page = Page.verifyOnPage(InstallationAndRiskPage)
          page.form.riskCategoryField.shouldHaveOption('Safeguarding adult')
          page.form.riskCategoryField.shouldHaveOption('Safeguarding child')
          page.form.riskCategoryField.shouldHaveOption('Safeguarding domestic abuse')
          page.form.riskCategoryField.shouldNotHaveOption('Safeguarding Issues')
        })
      })

      context('With DDv5 disabled', () => {
        const testFlags = { DD_V5_1_ENABLED: false }
        beforeEach(() => {
          cy.task('setFeatureFlags', testFlags)
        })
        afterEach(() => {
          cy.task('resetFeatureFlags')
        })

        it('Should have additional safeguarding options', () => {
          Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })
          const page = Page.verifyOnPage(InstallationAndRiskPage)
          page.form.riskCategoryField.shouldHaveOption('Safeguarding Issues')
          page.form.riskCategoryField.shouldNotHaveOption('Safeguarding adult')
          page.form.riskCategoryField.shouldNotHaveOption('Safeguarding child')
          page.form.riskCategoryField.shouldNotHaveOption('Safeguarding domestic abuse')
        })
      })
    })
  })
})
