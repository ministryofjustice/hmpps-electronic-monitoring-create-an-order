import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import VariationDetailsPage from '../../../pages/order/variation/variationDetails'
import OrderTasksPage from '../../../pages/order/summary'

const mockOrderId = uuidv4()
const stubOrder = (type: string = 'VARIATION', dataDictionaryVersion: string = 'DDV5') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    type,
    order: { type, dataDictionaryVersion },
  })
}
context('Variation', () => {
  context('Variation Details', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        stubOrder()

        cy.signIn()
      })

      it('Should allow the user to update the variation details', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        // Verify page layout is present
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Verify form elements present and editable
        page.form.variationDetailsField.element.should('exist')
        cy.get('form').find('legend').contains('What have you changed in the form?').should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backButton.should('exist')
        page.form.shouldHaveAllOptions()
        // A11y
        page.checkIsAccessible()
      })

      it('Should not show what has changed if type is REVOCATION', () => {
        stubOrder('REVOCATION')
        Page.visit(VariationDetailsPage, { orderId: mockOrderId })
        Page.verifyOnPage(VariationDetailsPage)
        cy.get('form').find('legend').contains('What have you changed in the form?').should('not.exist')
      })
      context('DDv5', () => {
        beforeEach(() => {
          stubOrder()
        })

        it('Should have DDv5 options only', () => {
          Page.visit(VariationDetailsPage, { orderId: mockOrderId })
          const page = Page.verifyOnPage(VariationDetailsPage)
          page.form.variationTypeField.shouldHaveOption('The device wearer’s address')
          page.form.variationTypeField.shouldHaveOption('The device wearer’s personal details')
          page.form.variationTypeField.shouldHaveOption('Change to add an exclusion zone(s)')
          page.form.variationTypeField.shouldHaveOption('Change to an existing exclusion zone(s)')
          page.form.variationTypeField.shouldHaveOption('The curfew hours')
          page.form.variationTypeField.shouldHaveOption('Change of device type (fitted/non fitted)')
          page.form.variationTypeField.shouldHaveOption(
            'Temporary suspension of monitoring (attend a funeral or go on holiday)',
          )
          page.form.variationTypeField.shouldHaveOption('Change to an enforceable condition')
          page.form.variationTypeField.shouldHaveOption('I have changed something due to an administration error')
          page.form.variationTypeField.shouldHaveOption('I have changed something else in the form')

          page.form.variationTypeField.shouldNotHaveOption('Change of curfew hours')
          page.form.variationTypeField.shouldNotHaveOption('Change of address')
          page.form.variationTypeField.shouldNotHaveOption('Change to add an Exclusion Zone(s)')
          page.form.variationTypeField.shouldNotHaveOption('Change to an existing Exclusion Zone(s).')
        })
      })

      context('DDv4', () => {
        beforeEach(() => {
          stubOrder('VARIATION', 'DDV4')
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
          page.form.variationTypeField.shouldNotHaveOption(
            'Temporary suspension of monitoring (attend a funeral or go on holiday)',
          )
          page.form.variationTypeField.shouldNotHaveOption('I have changed something due to an administration error')
          page.form.variationTypeField.shouldNotHaveOption('I have changed something else in the form')
        })
      })
    })
    context('viewing an previous version', () => {
      const mockVersionId = uuidv4()
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetVersion', {
          httpStatus: 200,
          id: mockOrderId,
          versionId: mockVersionId,
          status: 'SUBMITTED',
          order: {
            type: 'VARIATION',
            dataDictionaryVersion: 'DDV5',
          },
        })

        cy.signIn()
      })

      it('navigates correctly back to summary page', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId, versionId: mockVersionId }, {}, true)

        page.returnBackToFormSectionMenuButton.click()

        Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId, versionId: mockVersionId }, {}, true)
      })
    })
  })
})
