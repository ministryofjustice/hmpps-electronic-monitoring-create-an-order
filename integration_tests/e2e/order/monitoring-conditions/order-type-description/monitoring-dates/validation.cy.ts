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
})
