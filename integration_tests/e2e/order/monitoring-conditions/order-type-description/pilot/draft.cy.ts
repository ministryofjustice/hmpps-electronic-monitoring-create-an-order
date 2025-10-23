import { v4 as uuidv4 } from 'uuid'
import PilotPage from './PilotPage'
import Page from '../../../../../pages/page'
import HdcPage from '../hdc/hdcPage'

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

  it('Page accessisble', () => {
    const page = Page.visit(PilotPage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(PilotPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.pilotField.shouldExist()
    page.form.pilotField.shouldNotBeDisabled()

    page.form.continueButton.should('exist')
  })

  it('hdc yes', () => {
    const hdcPage = Page.visit(HdcPage, { orderId: mockOrderId })

    hdcPage.form.fillInWith('Yes')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { orderId: mockOrderId })

    pilotPage.form.pilotField.shouldHaveOption('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.pilotField.shouldHaveOption('GPS acquisitive crime (EMAC)')
    pilotPage.form.pilotField.shouldHaveOption('They are not part of any of these pilots')

    pilotPage.form.fillInWith('They are not part of any of these pilots')
  })

  it('hdc no', () => {
    const hdcPage = Page.visit(HdcPage, { orderId: mockOrderId })

    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { orderId: mockOrderId })

    pilotPage.form.pilotField.shouldHaveOption('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.pilotField.shouldHaveOption('GPS acquisitive crime (EMAC)')
    pilotPage.form.pilotField.shouldHaveOption('They are not part of any of these pilots')

    const hintText =
      'To be eligible for tagging the device wearer must either be part of a pilot or have Alcohol Monitoring on Licence (AML) as a licence condition.'
    pilotPage.form.pilotField.element.contains(hintText).should('be.hidden')
    pilotPage.form.fillInWith('They are not part of any of these pilots')
    pilotPage.form.pilotField.element.contains(hintText)
  })
})
