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
          page.form.variationTypeField.shouldHaveOption('The device wearer’s address')
          page.form.variationTypeField.shouldHaveOption('The device wearer’s personal details')
          page.form.variationTypeField.shouldHaveOption(' Change to add an exclusion zone(s)')
          page.form.variationTypeField.shouldHaveOption('Change to an existing exclusion zone(s)')
          page.form.variationTypeField.shouldHaveOption('The curfew hours')
          page.form.variationTypeField.shouldHaveOption('I am suspending monitoring for the device wearer')
          page.form.variationTypeField.shouldHaveOption('Change to a device type')
          page.form.variationTypeField.shouldHaveOption('Change to an enforceable condition')
          page.form.variationTypeField.shouldHaveOption('I am suspending monitoring for the device wearer')
          page.form.variationTypeField.shouldHaveOption('I have changed something due to an administration error')
          page.form.variationTypeField.shouldHaveOption('I have changed something else in the form')

          page.form.variationTypeField.shouldNotHaveOption('Change of curfew hours')
          page.form.variationTypeField.shouldNotHaveOption('Change of address')
          page.form.variationTypeField.shouldNotHaveOption('Change to add an Exclusion Zone(s)')
          page.form.variationTypeField.shouldNotHaveOption('Change to an existing Exclusion Zone(s).')
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
          page.form.variationTypeField.shouldHaveOption('Change to add an Exclusion Zone(s)')
          page.form.variationTypeField.shouldHaveOption('Change to an existing Exclusion Zone(s).')
          page.form.variationTypeField.shouldHaveOption('Order Suspension')

          page.form.variationTypeField.shouldNotHaveOption('The device wearer’s address')
          page.form.variationTypeField.shouldNotHaveOption('The device wearer’s personal details')
          page.form.variationTypeField.shouldNotHaveOption('Change to add an exclusion zone(s)')
          page.form.variationTypeField.shouldNotHaveOption('Change to an existing exclusion zone(s)')
          page.form.variationTypeField.shouldNotHaveOption('The curfew hours')
          page.form.variationTypeField.shouldNotHaveOption('Change to a device type')
          page.form.variationTypeField.shouldNotHaveOption('Change to an enforceable condition')
          page.form.variationTypeField.shouldNotHaveOption('I am suspending monitoring for the device wearer')
          page.form.variationTypeField.shouldNotHaveOption('I have changed something due to an administration error')
          page.form.variationTypeField.shouldNotHaveOption('I have changed something else in the form')
        })
      })
    })
  })
})
