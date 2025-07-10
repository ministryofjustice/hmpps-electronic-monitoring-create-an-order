import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'

const mockOrderId = uuidv4()

context('Monitoring conditions', () => {
  context('Index', () => {
    context('Viewing a draft order with no saved data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { dataDictionaryVersion: 'DDV5' },
        })

        cy.signIn()
      })

      it('Should display contents', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.shouldNotBeDisabled()
        page.backButton.should('exist')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.errorSummary.shouldNotExist()

        page.form.startDateField.shouldNotHaveValue(false)
        page.form.endDateField.shouldNotHaveValue(false)
        page.form.orderTypeField.shouldHaveValue('')
        page.form.conditionTypeField.shouldNotHaveValue()
        page.form.pilotField.shouldHaveValue('')
        page.form.sentenceTypeField.shouldHaveValue('')
        page.form.isspField.shouldNotHaveValue()
        page.form.hdcField.shouldNotHaveValue()
        page.form.prarrField.shouldNotHaveValue()
        page.form.monitoringRequiredField.shouldNotHaveValue()

        page.form.monitoringRequiredField.element.find('input[type=checkbox][value="alcohol"]').should('be.disabled')

        page.form.shouldHaveAllOptions()
      })

      it('should show orderTypeDescriptionField when order data dictionary version is DDv4', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { dataDictionaryVersion: 'DDV4' },
        })

        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })

        page.form.orderTypeDescriptionField.shouldHaveAllOptions()
      })

      // Test disabled because the hint text of the disabled Alcohol Monitoring order type checkbox is too low contrast to meet WCAG 2 AA accessibility standards. This is a known issue in the GOV.UK design system. This test should be enabled again when this design system issue is resolved or the Alcohol Monitoring checkbox is enabled.
      it.skip('Should be accessible', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })
        page.checkIsAccessible()
      })
    })
  })
})
