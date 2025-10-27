import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import MonitoringDatesPage from './MonitoringDatesPage'
import CheckYourAnswersPage from '../../../../../pages/checkYourAnswersPage'

const mockOrderId = uuidv4()

context('monitoringDates', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('Should submit form', () => {
    const page = Page.visit(MonitoringDatesPage, { orderId: mockOrderId })
    page.form.fillInWith({
      startDate: { day: '10', month: '11', year: '2025' },
      endDate: { day: '11', month: '11', year: '2026' },
    })
    page.form.continueButton.click()

    Page.verifyOnPage(CheckYourAnswersPage, 'Monitoring dates')
  })
})
