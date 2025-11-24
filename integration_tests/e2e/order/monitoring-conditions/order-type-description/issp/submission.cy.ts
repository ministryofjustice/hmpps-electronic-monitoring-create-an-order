import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import IsspPage from './isspPage'
import MonitoringTypePage from '../monitoring-type/MonitoringTypesPage'

const mockOrderId = uuidv4()
context('order type', () => {
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
    const page = Page.visit(IsspPage, { orderId: mockOrderId })

    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    Page.verifyOnPage(MonitoringTypePage)
  })
})
