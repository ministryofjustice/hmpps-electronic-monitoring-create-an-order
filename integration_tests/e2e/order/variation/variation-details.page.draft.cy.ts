import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import VariationDetailsPage from '../../../pages/order/variation/variationDetails'

const mockOrderId = uuidv4()

context('Variation', () => {
  context('Variation Details', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should allow the user to update the variation details', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        // Verify page layout is present
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Verify form elements present and editable
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backButton.should('exist')
        page.form.shouldHaveAllOptions()
        // A11y
        page.checkIsAccessible()
      })

      context('With DDv5 enabled', () => {
        const testFlags = { DD_V5_1_ENABLED: true }
        beforeEach(() => {
          cy.task('setFeatureFlags', testFlags)
        })
        afterEach(() => {
          cy.task('resetFeatureFlags')
        })

        it('Should have DDv5 options only', () => {
          Page.visit(VariationDetailsPage, { orderId: mockOrderId })
          const page = Page.verifyOnPage(VariationDetailsPage)
          page.form.variationTypeField.shouldHaveOption('Change to Address')
          page.form.variationTypeField.shouldHaveOption('Change to Personal Details')
          page.form.variationTypeField.shouldHaveOption('Change to add Exclusion Zone(s)')
          page.form.variationTypeField.shouldHaveOption('Change to an Exclusion')
          page.form.variationTypeField.shouldHaveOption('Change to Curfew Hours')
          page.form.variationTypeField.shouldHaveOption('Order Suspension')
          page.form.variationTypeField.shouldHaveOption('Change to Device Type')
          page.form.variationTypeField.shouldHaveOption('Change to Enforceable Condition')
          page.form.variationTypeField.shouldHaveOption('Admin Error')
          page.form.variationTypeField.shouldHaveOption('Other')

          page.form.variationTypeField.shouldNotHaveOption('Change of curfew hours')
          page.form.variationTypeField.shouldNotHaveOption('Change of address')
          page.form.variationTypeField.shouldNotHaveOption('Change to add an Inclusion or Exclusion Zone(s)')
          page.form.variationTypeField.shouldNotHaveOption('Change to an existing Inclusion or Exclusion Zone(s).')
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

        it('Should have DDv4 options only', () => {
          Page.visit(VariationDetailsPage, { orderId: mockOrderId })
          const page = Page.verifyOnPage(VariationDetailsPage)

          page.form.variationTypeField.shouldHaveOption('Change of curfew hours')
          page.form.variationTypeField.shouldHaveOption('Change of address')
          page.form.variationTypeField.shouldHaveOption('Change to add an Inclusion or Exclusion Zone(s)')
          page.form.variationTypeField.shouldHaveOption('Change to an existing Inclusion or Exclusion Zone(s).')
          page.form.variationTypeField.shouldHaveOption('Order Suspension')

          page.form.variationTypeField.shouldNotHaveOption('Change to Address')
          page.form.variationTypeField.shouldNotHaveOption('Change to Personal Details')
          page.form.variationTypeField.shouldNotHaveOption('Change to add Exclusion Zone(s)')
          page.form.variationTypeField.shouldNotHaveOption('Change to an Exclusion')
          page.form.variationTypeField.shouldNotHaveOption('Change to Curfew Hours')
          page.form.variationTypeField.shouldNotHaveOption('Change to Device Type')
          page.form.variationTypeField.shouldNotHaveOption('Change to Enforceable Condition')
          page.form.variationTypeField.shouldNotHaveOption('Admin Error')
          page.form.variationTypeField.shouldNotHaveOption('Other')
        })
      })
    })
  })
})
