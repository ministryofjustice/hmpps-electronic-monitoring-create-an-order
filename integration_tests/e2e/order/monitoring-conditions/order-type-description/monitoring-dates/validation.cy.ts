import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import MonitoringDatesPage from './MonitoringDatesPage'

const mockOrderId = uuidv4()

context('monitoring dates validation', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })
    cy.signIn()
  })

  it('Should show errors when dates are not provided', () => {
    const page = Page.visit(MonitoringDatesPage, { orderId: mockOrderId })
    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.errorSummary.verifyErrorSummary(['Enter start date for monitoring', 'Enter end date for monitoring'])

    page.form.startDateField.validationMessage.contains('Enter start date for monitoring')
    page.form.endDateField.validationMessage.contains('Enter end date for monitoring')
  })

  it('Should show errors when end date is in the past', () => {
    const page = Page.visit(MonitoringDatesPage, { orderId: mockOrderId })
    page.form.fillInWith({
      startDate: { day: '10', month: '11', year: '2025' },
      endDate: { day: '11', month: '11', year: '2024' },
    })
    page.form.continueButton.click()
    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError('End date of monitoring must be in the future')
    page.form.endDateField.validationMessage.contains('End date of monitoring must be in the future')
  })

  it('Should show errors when end date is before start date', () => {
    const page = Page.visit(MonitoringDatesPage, { orderId: mockOrderId })
    page.form.fillInWith({
      startDate: { day: '10', month: '11', year: '2026' },
      endDate: { day: '09', month: '11', year: '2026' },
    })
    page.form.continueButton.click()
    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError('End date must be after start date')
    page.form.endDateField.validationMessage.contains('End date must be after start date')
  })
})
