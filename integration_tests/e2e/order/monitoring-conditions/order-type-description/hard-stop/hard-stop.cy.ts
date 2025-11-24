import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceTypePage from '../offence-type/OffenceTypePage'
import PoliceAreaPage from '../police-area/PoliceAreaPage'
import HardStopPage from './HardStopPage'

const mockOrderId = uuidv4()
context('hard stop page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('Should display content', () => {
    const page = Page.visit(HardStopPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')
    page.backButton.should('exist')

    cy.get('#return-button').contains('Return to form')
  })

  it('Should go to hard stop page from offence type page if they did not commit one of these offences', () => {
    const page = Page.visit(OffenceTypePage, { orderId: mockOrderId })

    page.form.fillInWith('They did not commit one of these offences')
    page.form.continueButton.click()

    Page.verifyOnPage(HardStopPage)
    cy.contains('Device wearer is not eligible for the acquisitive crime pilot').should('exist')
    cy.contains(
      'To be eligible for the acquisitive crime pilot the device wearer must have committed an acquisitive offence',
    ).should('exist')
  })

  it('Should go to hard stop page from police area page if release address not in-scope', () => {
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
