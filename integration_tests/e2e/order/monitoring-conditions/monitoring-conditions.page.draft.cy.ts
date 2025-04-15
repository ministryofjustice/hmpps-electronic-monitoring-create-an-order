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

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the monitoring conditions', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()

        page.form.orderTypeField.shouldHaveValue('')
        page.form.monitoringRequiredField.shouldNotHaveValue()
        page.form.orderTypeDescriptionField.shouldHaveValue('')
        page.form.conditionTypeField.shouldHaveValue('')
        page.form.startDateField.shouldNotHaveValue()
        page.form.endDateField.shouldNotHaveValue()
        page.form.sentenceTypeField.shouldHaveValue('')
        page.form.isspField.shouldNotHaveValue()
        page.form.hdcField.shouldNotHaveValue()
        page.form.prarrField.shouldNotHaveValue()
        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('exist')
      })

      it('Should be accessible', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })
        page.checkIsAccessible()
      })
    })
  })
})
