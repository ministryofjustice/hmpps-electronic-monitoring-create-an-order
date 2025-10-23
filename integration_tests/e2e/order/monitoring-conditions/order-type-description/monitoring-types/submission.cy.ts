import { v4 as uuidv4 } from 'uuid'
import MonitoringTypesPage from './MonitoringTypesPage'
import Page from '../../../../../pages/page'
import CheckYourAnswersPage from '../../../../../pages/checkYourAnswersPage'

const stubGetOrder = () => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
  })
}

const mockOrderId = uuidv4()
context('pilot', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()

    cy.signIn()
  })

  it('Should submit the form', () => {
    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

    page.form.fillInWith('Curfew')
    page.form.continueButton.click()

    Page.verifyOnPage(CheckYourAnswersPage, 'Check your answers')
  })
})
