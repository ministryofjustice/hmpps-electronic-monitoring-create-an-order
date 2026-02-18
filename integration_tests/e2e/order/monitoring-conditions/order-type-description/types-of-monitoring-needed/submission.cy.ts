import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import TypesOfMonitoringNeededPage from './TypesOfMonitoringNeededPage'
import MonitoringTypesPage from '../monitoring-types/MonitoringTypesPage'

const mockOrderId = uuidv4()
context('types of monitoring needed submission', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('Should go to the next page', () => {
    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.form.fillInWith('No')
    page.form.saveAndContinueButton.click()

    Page.verifyOnPage(MonitoringTypesPage, { orderId: mockOrderId })
  })
})
