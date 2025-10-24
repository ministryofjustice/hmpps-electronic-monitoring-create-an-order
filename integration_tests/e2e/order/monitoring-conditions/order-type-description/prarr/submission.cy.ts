import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import PrarrPage from './PrarrPage'
import MonitoringTypesPage from '../monitoring-types/MonitoringTypesPage'

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

  it('Should show errors no answer selected', () => {
    const page = Page.visit(PrarrPage, { orderId: mockOrderId })

    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    // update to monitoring dates page
    Page.verifyOnPage(MonitoringTypesPage)
  })
})
