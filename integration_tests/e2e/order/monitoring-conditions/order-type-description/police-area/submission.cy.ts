import { v4 as uuidv4 } from 'uuid'
import PoliceAreaPage from './PoliceAreaPage'
import Page from '../../../../../pages/page'
import PrarrPage from '../prarr/PrarrPage'
import HardStopPage from '../hard-stop/HardStopPage'

const mockOrderId = uuidv4()
context('police area', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      monitoringConditions: { offenceType: 'Theft from a Vehicle' },
    })

    cy.signIn()
  })

  it('Should submit the form', () => {
    const page = Page.visit(PoliceAreaPage, { orderId: mockOrderId })

    page.form.fillInWith('Essex')
    page.form.continueButton.click()

    Page.verifyOnPage(PrarrPage)
  })

  it('Should go to hard stop page', () => {
    const page = Page.visit(PoliceAreaPage, { orderId: mockOrderId })

    page.form.fillInWith("The device wearer's release address is in a different police force area")
    page.form.continueButton.click()

    Page.verifyOnPage(HardStopPage)
    cy.contains('Device wearer is not eligible for the acquisitive crime pilot').should('exist')
    cy.contains(
      "To be eligible for the acquisitive crime pilot the device wearer's release address must be in an in-scope police force area.",
    ).should('exist')
  })
})
