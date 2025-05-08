import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'

const mockOrderId = uuidv4()

context('Monitoring conditions', () => {
  context('Index', () => {
    context('Viewing a saved order with saved data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            monitoringConditions: {
              startDate: '2025-01-01T00:00:00Z',
              endDate: '2025-02-01T00:00:00Z',
              orderType: 'CIVIL',
              curfew: true,
              exclusionZone: true,
              trail: true,
              mandatoryAttendance: true,
              alcohol: true,
              conditionType: 'BAIL_ORDER',
              orderTypeDescription: 'DAPO',
              sentenceType: 'IPP',
              issp: 'YES',
              hdc: 'NO',
              prarr: 'UNKNOWN',
            },
          },
        })

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

      it('Should allow the user to view the monitoring conditions', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })

        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAndReturnButton.should('not.exist')
        page.form.shouldBeDisabled()

        page.form.orderTypeField.shouldHaveValue('CIVIL')
        page.form.monitoringRequiredField.shouldHaveValue('Curfew')
        page.form.monitoringRequiredField.shouldHaveValue('Exclusion zone monitoring')
        page.form.monitoringRequiredField.shouldHaveValue('Mandatory attendance monitoring')
        page.form.monitoringRequiredField.shouldHaveValue('Trail monitoring')
        page.form.monitoringRequiredField.shouldHaveValue('Curfew')
        page.form.orderTypeDescriptionField.shouldHaveValue('DAPO')
        page.form.conditionTypeField.shouldHaveValue('Bail Order')
        page.form.startDateField.shouldHaveValue(new Date(2025, 0, 1))
        page.form.endDateField.shouldHaveValue(new Date(2025, 1, 1))
        page.form.sentenceTypeField.shouldHaveValue('IPP')
        page.form.isspField.shouldHaveValue('Yes')
        page.form.hdcField.shouldHaveValue('No')
        page.form.prarrField.shouldHaveValue('Not able to provide this information')

        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('exist')
      })
    })
  })
})
